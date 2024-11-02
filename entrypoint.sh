#!/bin/bash

set -e

cd /app

# Wait for IRIS to be ready
echo "Waiting for IRIS to be ready..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if nc -z iris 1972; then
        echo "IRIS is ready!"
        break
    fi
    echo "Attempt $attempt: IRIS is not ready yet..."
    sleep 5
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "Failed to connect to IRIS after $max_attempts attempts"
    exit 1
fi

poetry install --no-root

poetry run python -m backend.infrastructure.migration

poetry run uvicorn backend.app:app_instance --host 0.0.0.0 --port 8000

