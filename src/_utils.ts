/**
 * permission for files created by the app `[chmod 644]`.
 * 
 * permissions role:
 * `rw-r--r--`
 * 
 * `owner: read, write`
 * 
 * `group: read`
 * 
 * `others: read`
 * 
 * ```js
 * 0o644
 * ```
 * 
 * @example
 * ```js
 * import fs from 'node:fs'
 * fs.writeFileSync('new-file.txt', 'Hello World!', { mode: 0o644, encoding: 'utf-8' });
 * ```
 */
export const FILE_PERMISSION = 0o644;

/**
 * permission for folders created by the app `[chmod 755]`.
 * 
 * permissions role:
 * `rwxr-xr-x`
 * 
 * `owner: read, write, execute`
 * 
 * `group: read, execute`
 * 
 * `others: read, execute`
 * 
 * ```js
 * 0o755 
 * ```
 * 
 * @example
 * ```js
 * import fs from 'node:fs';
 * await fs.mkdirSync('new-folder', { mode: 0o755 });
 * ```
 */
export const FOLDER_PERMISSION = 0o755;


/**
 * Joins an array of strings with a separator
 * 
 * @param {any[]} arr Some array
 * @param {string} [separator=' | '] The separator to use
 * @returns {string} The joined string
 */
export function join<T extends any[]>(arr: T, separator: string = ' | '): string {
  return arr.map(item => {
    if(typeof item === 'string') return `'${item}'`;
    return item;
  }).join(separator);
}

/**
 * Returns a function that can only be called once
 * 
 * @param fn The function to wrap 
 * @returns The wrapped function
 */
export function once<T>(fn: (...args: any[]) => T): (...args: any[]) => T {
  let called = false;
  let result: T;

  return (...args: any[]) => {
    if(called) return result;

    called = true;
    return (result = fn(...args));
  };
}


/**
 * Maps an object to a new object
 * 
 * @param {object} obj The object to map 
 * @param {Function} mapper The mapper function 
 * @returns {object} The mapped object
 */
export function map<T extends Record<string | number | symbol, any>, V, K extends string | number | symbol>(obj: Record<K, V>, mapper: ((key: K, value: V) => any)): T {
  return Object.entries(obj).reduce((accumulator, [key, value]) => {
    return {
      ...accumulator,
      [key]: mapper(key as K, value as V),
    };
  }, {} as T);
}


/**
 * Removes duplicate values from an array
 * 
 * @param {any[]} arr The array to remove duplicates from 
 * @returns {any[]} The array without duplicates
 */
export function uniq<T extends unknown[]>(arr: T): T {
  return [...new Set(arr)] as T;
}
