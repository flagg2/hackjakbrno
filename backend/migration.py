import asyncio

from sqlalchemy import text

from backend.iris import engine

async def init_tables():
    async with engine.connect() as conn:
        async with conn.begin():# Load 
            sql = f"""
            CREATE TABLE patients (
            patient_id VARCHAR,
            description_vector VECTOR(FLOAT, 384)
            )
                    """
            await conn.execute(text(sql))


if __name__ == "__main__":
    asyncio.run(init_tables())
