from backend.infrastructure.iris import engine
from sqlalchemy import text


def init_tables():
    with engine.connect() as conn:
        with conn.begin():
            sql = f"""
                CREATE TABLE patients ( patient_id VARCHAR,
                description_vector VECTOR(DOUBLE, 384)
                )
            """
            conn.execute(text(sql))


if __name__ == "__main__":
    init_tables()
    print("MIGRATION DONE")
    # pass
