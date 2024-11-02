FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

RUN pip install poetry

COPY pyproject.toml poetry.lock ./

RUN poetry config virtualenvs.create false && poetry install --no-root

COPY . .

RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "backend.app:app_instance", "--host", "0.0.0.0", "--port", "8000"]
