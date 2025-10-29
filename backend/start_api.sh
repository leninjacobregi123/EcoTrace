#!/bin/bash
cd /home/lenin/IR_2025/ecotrace/backend
source venv/bin/activate
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
