from sqlalchemy import create_engine

USERNAME = 'demo'
PASSWORD = 'demo'
HOSTNAME = 'localhost'
PORT = '52773' 
NAMESPACE = 'USER'
CONNECTION_STRING = f"iris://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{NAMESPACE}"

engine = create_engine(CONNECTION_STRING)
