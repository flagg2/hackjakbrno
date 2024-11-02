from sqlalchemy.ext.asyncio import create_async_engine

USERNAME = 'demo'
PASSWORD = 'demo'
HOSTNAME = 'localhost'
PORT = '1972' 
NAMESPACE = 'USER'
CONNECTION_STRING = f"iris://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{NAMESPACE}"

engine = create_async_engine(CONNECTION_STRING)
