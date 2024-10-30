import Redis from "ioredis";

// Redis client singleton function
const redisClientSingleton = () => {
  return new Redis(process.env.REDIS_CONNECT!);
};

// Declare a global type to store the Redis client
declare const globalThis: {
  redisGlobal: ReturnType<typeof redisClientSingleton>;
} & typeof global;

// Initialize the Redis client, reusing the global one if available
const redis = globalThis.redisGlobal ?? redisClientSingleton();

export default redis;

// Assign the client to the global object in non-production environments to persist across hot reloads
if (process.env.NODE_ENV !== "production") globalThis.redisGlobal = redis;

// Example usage (can be removed or placed in a separate part of your code)
(async () => {
  await redis.set("foo", "bar");
})();
