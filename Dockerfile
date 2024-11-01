# Start with the official Python image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy only the pyproject.toml and poetry.lock files to the container
COPY pyproject.toml poetry.lock ./

# Install the dependencies
RUN poetry config virtualenvs.create false && poetry install --no-root

# Copy the rest of the application code into the container
COPY . .

# Expose the port that the app will run on
EXPOSE 8000

# Command to run the application
CMD ["poetry", "run", "uvicorn", "backend.app:app_instance", "--host", "0.0.0.0", "--port", "8000"]
