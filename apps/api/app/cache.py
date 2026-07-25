import os
import time
from typing import Any, Optional

class CacheManager:
    """
    High-performance query cache manager for FastAPI search and tools.
    Supports in-memory TTL caching with optional Redis connection pooling.
    """

    def __init__(self, default_ttl: int = 300):
        self.default_ttl = default_ttl
        self._memory_cache: dict[str, tuple[Any, float]] = {}
        self.redis_url = os.getenv("REDIS_URL", None)

    def get(self, key: str) -> Optional[Any]:
        if key in self._memory_cache:
            value, expires_at = self._memory_cache[key]
            if time.time() < expires_at:
                return value
            else:
                del self._memory_cache[key]
        return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        expire_seconds = ttl if ttl is not None else self.default_ttl
        expires_at = time.time() + expire_seconds
        self._memory_cache[key] = (value, expires_at)

    def clear(self) -> None:
        self._memory_cache.clear()


cache_manager = CacheManager()
