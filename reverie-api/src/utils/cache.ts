import Redis from 'ioredis'

const redis = new Redis('redis://redis:6379')

const cacheMethodCalls = (
  object: any,
  methodsToFlushCacheWith: string[] = []
) => {
  const handler = {
    get: (module: any, methodName: any) => {
      const method: any = module[methodName]
      return async (...methodArgs: any) => {
        if (methodsToFlushCacheWith.includes(methodName)) {
          await redis.flushdb()
          return await method.apply(this, methodArgs)
        }

        const cacheKey = `${methodName}-${JSON.stringify(methodArgs)}`
        const cacheResult = await redis.get(cacheKey)
        if (!cacheResult) {
          const result = await method.apply(this, methodArgs)
          await redis.set(cacheKey, JSON.stringify(result))
          return result
        }

        return JSON.parse(cacheResult)
      }
    },
  }

  return new Proxy(object, handler)
}

export { cacheMethodCalls }
