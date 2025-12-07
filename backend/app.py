# backend/app.py
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn
from utils import (
    load_artifacts, 
    find_best_match, 
    recommend_for_seed, 
    get_product_meta, 
    scrape_amazon_price, 
    ARTIFACTS
)

app = FastAPI(title="Product Recommender API")

# --- FIX START: Allow ALL Origins (Sabko Allow Karein) ---
# Ye 'Nuclear Option' hai jo CORS error ko jad se khatam kar dega.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Sare domains allow kar diye
    allow_credentials=True,
    allow_methods=["*"],  # Sare methods (GET, POST, OPTIONS) allow
    allow_headers=["*"],  # Sare headers allow
)
# ---------------------------------------------------------

@app.on_event("startup")
async def startup_event():
    print("API Starting up. Artifacts will be loaded on first request.")

@app.get("/health")
def health():
    return {"status": "ok", "artifacts_loaded": ARTIFACTS["loaded"]}

@app.get("/meta/products")
def get_product_catalog():
    load_artifacts()
    if not ARTIFACTS["catalog_list"]:
        return []
    return ARTIFACTS["catalog_list"][:2000]

@app.get("/product/{product_id}")
def get_product_details(product_id: str):
    meta = get_product_meta(product_id)
    if not meta:
        raise HTTPException(status_code=404, detail="Product not found")
    return meta

@app.get("/product/live_price/{product_id}")
def get_live_price(product_id: str):
    price = scrape_amazon_price(product_id)
    meta = get_product_meta(product_id)
    cached_price = meta.get('discounted_price') if meta else 0
    
    if not price:
        return {"status": "cached", "price": cached_price}
        
    return {"status": "live", "price": price}

@app.get("/recommend/by_id")
def recommend_by_id(product_id: str, top_n: int = 10):
    meta = get_product_meta(product_id)
    if not meta:
        raise HTTPException(status_code=404, detail="Seed product not found")
        
    recs = recommend_for_seed(product_id, top_n)
    
    return {
        "seed_product_id": meta["product_id"],
        "seed_product_name": meta["product_name"],
        "recommendations": recs
    }

@app.get("/recommend/by_name")
def recommend_by_name(q: str, top_n: int = 10):
    pid, name, score = find_best_match(q)
    if not pid:
        raise HTTPException(status_code=404, detail="No matching product found")
        
    meta = get_product_meta(pid)
    recs = recommend_for_seed(pid, top_n)
    
    return {
        "seed_product_id": pid,
        "seed_product_name": name,
        "match_score": score,
        "recommendations": recs
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
