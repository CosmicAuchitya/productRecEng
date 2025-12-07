# backend/utils.py
import os
import pandas as pd
import numpy as np
import joblib
import scipy.sparse
import logging
import requests
from bs4 import BeautifulSoup

# Try importing rapidfuzz, fallback to difflib
try:
    from rapidfuzz import process, fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    import difflib
    HAS_RAPIDFUZZ = False

logger = logging.getLogger("uvicorn")

# Global Cache
ARTIFACTS = {
    "loaded": False,
    "all_recs_df": None,
    "meta_dict": {},
    "product_ids": [],
    "tfidf_matrix": None,
    "nn_model": None,
    "product_index_map": {},
    "sentiment_df": None,
    "catalog_list": []
}

def load_artifacts():
    """Lazy loads artifacts from disk into global cache."""
    if ARTIFACTS["loaded"]:
        return

    logger.info("Loading artifacts...")
    
    # 1. Load Bulk Recommendations (Fast Path)
    if os.path.exists("all_product_recs_top10.csv"):
        ARTIFACTS["all_recs_df"] = pd.read_csv("all_product_recs_top10.csv")
    
    # 2. Load Metadata
    df_meta = pd.DataFrame()
    if os.path.exists("products_aggregated_recon.csv"):
        df_meta = pd.read_csv("products_aggregated_recon.csv")
    elif os.path.exists("products_aggregated.csv"):
        df_meta = pd.read_csv("products_aggregated.csv")
    
    # 3. Load Sentiment if separate
    if os.path.exists("sentiment_agg.csv") and not df_meta.empty:
        df_sent = pd.read_csv("sentiment_agg.csv")
        if 'avg_sentiment' not in df_meta.columns:
            df_meta = pd.merge(df_meta, df_sent, on='product_id', how='left')

    # 4. Merge Images from cleaned_dataset if missing
    if not df_meta.empty and 'img_link' not in df_meta.columns:
        if os.path.exists("cleaned_dataset.csv"):
            try:
                df_links = pd.read_csv("cleaned_dataset.csv", usecols=['product_id', 'product_link', 'img_link'])
                df_links = df_links.drop_duplicates(subset=['product_id'])
                df_meta = pd.merge(df_meta, df_links, on='product_id', how='left')
                logger.info("Successfully merged image links.")
            except Exception as e:
                logger.warning(f"Error merging links: {e}")

    # 5. Fix Ratings
    if not df_meta.empty:
        if 'avg_rating' in df_meta.columns and 'rating' not in df_meta.columns:
            df_meta['rating'] = df_meta['avg_rating']

    # Fill NaNs for safe consumption
    if not df_meta.empty:
        cols_defaults = {
            'avg_sentiment': 0.0, 'percent_positive': 0.0, 'percent_negative': 0.0,
            'rating': 0.0, 'avg_rating': 0.0, 'discounted_price': 0.0,
            'product_link': '', 'img_link': '', 'product_name': 'Unknown',
            'category': 'General', 'aggregated_reviews': ''
        }
        for col, val in cols_defaults.items():
            if col in df_meta.columns:
                df_meta[col] = df_meta[col].fillna(val)
            else:
                df_meta[col] = val 

        ARTIFACTS["meta_dict"] = df_meta.set_index('product_id').to_dict('index')
        ARTIFACTS["product_ids"] = df_meta['product_id'].tolist()
        
        # Create lightweight typeahead list
        try:
            ARTIFACTS["catalog_list"] = df_meta[['product_id', 'product_name']].to_dict('records')
        except Exception as e:
            logger.warning(f"Could not create catalog list: {e}")
            ARTIFACTS["catalog_list"] = []
    else:
        logger.warning("Metadata DataFrame is empty! Check if products_aggregated.csv exists.")

    ARTIFACTS["loaded"] = True
    logger.info("Artifacts loaded successfully.")

def _ensure_models_loaded():
    if ARTIFACTS["nn_model"] is None and os.path.exists("nn_model.joblib"):
        ARTIFACTS["nn_model"] = joblib.load("nn_model.joblib")
    if ARTIFACTS["tfidf_matrix"] is None and os.path.exists("tfidf_matrix.npz"):
        ARTIFACTS["tfidf_matrix"] = scipy.sparse.load_npz("tfidf_matrix.npz")
    if not ARTIFACTS["product_index_map"] and ARTIFACTS["product_ids"]:
        ARTIFACTS["product_index_map"] = {pid: i for i, pid in enumerate(ARTIFACTS["product_ids"])}

def get_product_meta(pid):
    load_artifacts()
    meta = ARTIFACTS["meta_dict"].get(pid, {})
    if not meta:
        return None
    
    reviews = str(meta.get('aggregated_reviews', ''))
    review_list = reviews.split(' ||| ')[:10]
    
    return {
        "product_id": pid,
        "product_name": meta.get('product_name'),
        "category": meta.get('category'),
        "rating": float(meta.get('rating', 0.0)),
        "discounted_price": float(meta.get('discounted_price', 0.0)),
        "img_link": meta.get('img_link'),
        "product_link": meta.get('product_link'),
        "avg_sentiment": float(meta.get('avg_sentiment', 0.0)),
        "percent_positive": float(meta.get('percent_positive', 0.0)),
        "percent_negative": float(meta.get('percent_negative', 0.0)),
        "reviews_sample": review_list
    }

def find_best_match(query):
    load_artifacts()
    
    if not ARTIFACTS["catalog_list"]:
        return None, None, 0

    names = [p['product_name'] for p in ARTIFACTS["catalog_list"]]
    pids = [p['product_id'] for p in ARTIFACTS["catalog_list"]]

    if HAS_RAPIDFUZZ:
        result = process.extractOne(query, names, scorer=fuzz.WRatio)
        if result:
            matched_name, score, idx = result
            return pids[idx], matched_name, score
    else:
        matches = difflib.get_close_matches(query, names, n=1, cutoff=0.0)
        if matches:
            idx = names.index(matches[0])
            return pids[idx], matches[0], 80.0
    return None, None, 0

def recommend_for_seed(seed_id, top_n=10):
    load_artifacts()
    
    # 1. Fast Path: CSV
    if ARTIFACTS["all_recs_df"] is not None:
        df = ARTIFACTS["all_recs_df"]
        subset = df[df['seed_product_id'] == seed_id].sort_values('rank').head(top_n)
        if not subset.empty:
            recs = []
            for _, row in subset.iterrows():
                r = row.to_dict()
                if 'recommended_product_id' in r:
                    r['product_id'] = r.pop('recommended_product_id')
                if 'recommended_product_name' in r:
                    r['product_name'] = r.pop('recommended_product_name')
                recs.append(r)
            return recs

    # 2. Slow Path: On-demand NN
    _ensure_models_loaded()
    nn = ARTIFACTS["nn_model"]
    matrix = ARTIFACTS["tfidf_matrix"]
    idx_map = ARTIFACTS["product_index_map"]
    
    if not nn or not matrix or seed_id not in idx_map:
        return []

    seed_idx = idx_map[seed_id]
    distances, indices = nn.kneighbors(matrix[seed_idx], n_neighbors=top_n + 5)
    
    distances = distances.flatten()
    indices = indices.flatten()
    
    candidates = []
    pids = ARTIFACTS["product_ids"]
    
    for i, idx in enumerate(indices):
        pid = pids[idx]
        if pid == seed_id: continue
        meta = ARTIFACTS["meta_dict"].get(pid, {})
        base_sim = 1.0 - distances[i]
        
        avg_sent = float(meta.get('avg_sentiment', 0.0))
        rating = float(meta.get('rating', 0.0))
        
        sent_adjust = 0.0
        if avg_sent >= 0.2: sent_adjust = 0.05
        elif avg_sent <= -0.05: sent_adjust = -0.05
        rating_boost = 0.02 if rating >= 4.4 else 0.0
        
        final_score = base_sim + sent_adjust + rating_boost
        
        candidates.append({
            **meta,
            "product_id": pid,
            "final_score": final_score
        })
        
    candidates.sort(key=lambda x: x['final_score'], reverse=True)
    return candidates[:top_n]

# --- HONEST SCRAPER IMPLEMENTATION ---
def scrape_amazon_price(product_id):
    """
    Attempts to fetch REAL price from Amazon.
    Returns None if blocked by Amazon (Security).
    No fake data.
    """
    url = f"https://www.amazon.in/dp/{product_id}"
    
    # Headers to mimic a real browser request
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Referer": "https://www.amazon.in/"
    }

    try:
        # Use session for better connection handling
        session = requests.Session()
        response = session.get(url, headers=headers, timeout=5)
        
        # 503 is typical 'Service Unavailable' when Amazon blocks bots
        if response.status_code != 200:
            logger.warning(f"Amazon Blocked/Failed with status: {response.status_code}")
            return None
        
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Try multiple common selectors for price on Amazon
        selectors = ['.a-price-whole', '#priceblock_ourprice', '#priceblock_dealprice', '.a-price .a-offscreen']
        
        for sel in selectors:
            element = soup.select_one(sel)
            if element:
                price_text = element.text.strip().replace('₹', '').replace(',', '').split('.')[0]
                if price_text.isdigit():
                    return price_text
            
        return None
    except Exception as e:
        logger.warning(f"Scraping exception for {product_id}: {e}")
        return None
