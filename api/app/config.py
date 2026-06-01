from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./knaq.db"
    cors_origins: str = "http://localhost:3000"
    log_level: str = "INFO"
    data_dir: str = str(Path(__file__).parent.parent.parent / "data")

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
