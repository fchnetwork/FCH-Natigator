export async function safePromise<T>(promise: Promise<T>, defaultValue: T = null) {
  try {
    return await promise;
  } catch (e) {
    return defaultValue;
  }
}