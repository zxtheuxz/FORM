import Redis, { RedisOptions } from 'ioredis';

// URL de conexão fornecida pelo EasyPanel
const REDIS_URL = 'redis://default:435ccfa1e2e01233a342@site_site:6379';

// Configuração do Redis
const redisConfig: RedisOptions = {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  connectTimeout: 10000,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

// Criar instância do Redis usando a URL de conexão
const redis = new Redis(REDIS_URL, redisConfig);

// Monitoramento de conexão
redis.on('connect', () => {
  console.log('Conectado ao Redis');
});

redis.on('error', (err: Error) => {
  console.error('Erro na conexão Redis:', err);
});

redis.on('ready', () => {
  console.log('Redis pronto para receber comandos');
});

// Cache wrapper com tratamento de erros melhorado
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao buscar cache:', error);
    return null;
  }
}

export async function setCache(key: string, value: any, expireInSeconds = 3600): Promise<void> {
  try {
    const stringValue = JSON.stringify(value);
    await redis.setex(key, expireInSeconds, stringValue);
  } catch (error) {
    console.error('Erro ao definir cache:', error);
  }
}

// Função para testar a conexão
export async function testRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão Redis:', error);
    return false;
  }
}

export default redis; 