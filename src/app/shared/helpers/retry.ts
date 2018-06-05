export function retry<T>(func: () => Promise<T>, times: number, interval: number) : Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    if(times <= 0) {
      reject('Cannot retry 0 times');
      return;
    }

    if(times === 1) {
      resolve(await func());
      return;
    }

    try {
      const response = await func();
      resolve(response);
      return;
    } catch(e) {
      console.warn(e.message);
    }

    setTimeout(async () => {
      resolve(await this.retry(func, times - 1, interval));
    }, interval);
  });
}
