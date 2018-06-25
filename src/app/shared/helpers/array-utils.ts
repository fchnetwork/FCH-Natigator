export function multiSlice<T>(array: T[][], take: number, skip: number): T[][] {
  const result = [];
  let skipRemaining = skip;
  let takeRemaining = take;

  for (let rowIndex = 0; rowIndex < array.length; rowIndex++) {
    result.push([]);
    for (let colIndex = 0; colIndex < array[rowIndex].length; colIndex++) {
      if(skipRemaining) {
        skipRemaining--;
      } else if (takeRemaining) {
        result[rowIndex].push(array[rowIndex][colIndex]);
        takeRemaining--;
      }
    }
  }

  return result;
}

export function unique<T>(array: T[]): T[] {
  if(!array) {
    return array;
  }

  return Array.from<T>(new Set(array));
}
