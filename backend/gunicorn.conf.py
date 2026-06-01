"""
Gunicorn configuration for ConceptsIn5 on Render.
Tuned for Render free tier (512 MB RAM) and starter ($7/mo) tier.
"""
import multiprocessing
import os

# ─── Worker Configuration ──────────────────────────────────────
# Free tier: use 1-2 workers (512MB RAM limit)
# Starter tier: use (cpu_count * 2 + 1)
workers = int(os.getenv("GUNICORN_WORKERS", 2))
worker_class = "sync"
threads = 2

# ─── Timeouts ──────────────────────────────────────────────────
# Increase for cold starts and heavy AI/NLP operations
timeout = 120
keepalive = 5
graceful_timeout = 30

# ─── Connection Limits ─────────────────────────────────────────
# Restart workers after N requests to prevent memory leaks
max_requests = 1000
max_requests_jitter = 100  # Random jitter to avoid thundering herd

# ─── Logging (stdout — Render captures this) ──────────────────
accesslog = "-"    # "-" means stdout
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s "%(r)s" %(s)s %(b)s %(D)sµs'

# ─── Network ───────────────────────────────────────────────────
# Render injects $PORT; Procfile passes it via --bind 0.0.0.0:$PORT
# forwarded_allow_ips must be "*" to trust Render's reverse proxy for HTTPS detection
forwarded_allow_ips = "*"
secure_scheme_headers = {"X-FORWARDED-PROTO": "https"}
