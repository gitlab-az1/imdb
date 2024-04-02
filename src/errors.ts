import type { Dict } from './_types';


export class Exception extends Error {
  [key: string]: any;
  
  public readonly message: string;
  public readonly name: string;

  constructor(message?: string, contextObject?: Dict<unknown>) {
    super(message);
    
    this.message = message ?? '';
    this.name = 'Exception';

    if(typeof contextObject === 'object' && Object.keys(contextObject).length > 0) {
      for(const prop in contextObject) {
        if(['name', 'message', 'cause', 'stack'].includes(prop)) continue;
        (this as unknown as Dict<any>)[prop] = contextObject[prop];
      }
    }
  }
}
