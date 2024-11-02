from fastapi import FastAPI

from backend.handlers import file_upload, file_processing, similarity_search


def create_app() -> FastAPI:
    app = FastAPI(title="Pump Perfect", docs_url="/ui", redoc_url="/redoc", openapi_url="/openapi.json")
    
    app.include_router(file_upload.router)
    app.include_router(file_processing.router)
    app.include_router(similarity_search.router)

    return app

app_instance = create_app()
