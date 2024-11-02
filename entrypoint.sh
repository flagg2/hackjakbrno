#!/bin/bash

poetry run python backend/migration.py
poetry run uvicorn backend.app:app_instance --host 0.0.0.0 --port 8000

