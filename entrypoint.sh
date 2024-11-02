#!/bin/bash

set -e

cd /app

poetry run python -m backend.migration

poetry run uvicorn backend.app:app_instance --host 0.0.0.0 --port 8000

