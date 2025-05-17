import os
from dotenv import load_dotenv
from functools import lru_cache

class Settings:
    def __init__(self):
        # Load environment variables from .env file if it exists
        load_dotenv()
        
        # Database settings
        self.DB_USER = os.getenv("DB_USER", "postgres")
        self.DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
        self.DB_HOST = os.getenv("DB_HOST", "localhost")
        self.DB_PORT = os.getenv("DB_PORT", "5432")
        self.DB_NAME = os.getenv("DB_NAME", "training_app")
        
        # Environment
        self.ENV = os.getenv("ENV", "development")
        
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

@lru_cache()
def get_settings() -> Settings:
    return Settings() 