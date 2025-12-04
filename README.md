# README.md
# Product Recommender System

Full-stack recommendation engine with Sentiment Analysis.

## Quick Start (Local)

1.  **Backend**:
    ```bash
    cd backend
    python -m venv venv && source venv/bin/activate  # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    # Ensure all artifact CSVs/joblibs are in backend/ folder
    uvicorn app:app --reload --port 8000
    ```

2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Open http://localhost:5173

## Docker Compose

```bash
# Ensure artifacts are in backend/ folder first
docker-compose up --build