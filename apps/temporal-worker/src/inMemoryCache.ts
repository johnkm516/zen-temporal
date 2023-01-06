import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

export const inMemoryCache = new CacheContainer(new MemoryStorage());