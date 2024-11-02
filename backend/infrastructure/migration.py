from backend.infrastructure.iris import engine
from sqlalchemy import text


def init_tables():
    with engine.connect() as conn:
        with conn.begin():
            sql = f"""
                CREATE TABLE IF NOT EXISTS patients ( patient_id VARCHAR,
                embedding VECTOR(DOUBLE, 288)
                )
            """
            conn.execute(text(sql))


if __name__ == "__main__":
    init_tables()
    print("MIGRATION DONE")
