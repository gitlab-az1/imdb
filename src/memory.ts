import math from 'next-math';



const MAX_SAFE_MEMORY_SIZE = math.floor((Number.MAX_SAFE_INTEGER - 1) / 8);


export interface VirtualizedMemory {
  readonly capacity: number;

  size(): number;
  byteLength(): number;
  has(address: number): boolean;
  alloc(size: number): number;
  free(address: number): boolean;
  erase(): void;
  read(address: number, length?: number, offset?: number): Uint8Array | null;
  write(address: number, data: Uint8Array, offset?: number): boolean;
  copy(srcAddress: number, destAddress: number, length: number, srcOffset?: number, destOffset?: number): boolean;
  fill(address: number, value: number, length: number, offset?: number): boolean;
  clear(address: number, length: number, offset?: number): boolean;
  writeUint8(address: number, value: number, offset?: number): boolean;
  writeUint16(address: number, value: number, offset?: number): boolean;
  writeUint32(address: number, value: number, offset?: number): boolean;
  writeUint64(address: number, value: bigint, offset?: number): boolean;
  writeInt8(address: number, value: number, offset?: number): boolean;
  writeInt16(address: number, value: number, offset?: number): boolean;
  writeInt32(address: number, value: number, offset?: number): boolean;
  writeInt64(address: number, value: bigint, offset?: number): boolean;
  writeBigInt64(address: number, value: bigint, offset?: number): boolean;
  hasVar(name: string): boolean;
  setVar(name: string, address: number): void;
  freeVar(name: string): boolean;
  readVar(name: string, length?: number, offset?: number): Uint8Array | null;
  writeVar(name: string, data: Uint8Array, offset?: number): boolean;
  copyVar(srcName: string, destName: string, length: number, srcOffset?: number, destOffset?: number): boolean;
  fillVar(name: string, value: number, length: number, offset?: number): boolean;
  clearVar(name: string, length: number, offset?: number): boolean;
  getVarAddress(name: string): number | null;
  readUint32(address: number, offset?: number): number;
}



export class VirtualMemory implements VirtualizedMemory {
  public static get MAX_SAFE_CAPACITY(): number {
    return MAX_SAFE_MEMORY_SIZE;
  }

  readonly #mappedAddressNames: Map<string, number> = new Map();
  readonly #memory: Map<number, Uint8Array> = new Map();
  #occupiedAddresses: number[] = [];
  readonly #capacity: number;

  public constructor(capacity: number = MAX_SAFE_MEMORY_SIZE) {
    if(capacity > MAX_SAFE_MEMORY_SIZE) {
      throw new RangeError('Memory capacity exceeds the maximum safe size');
    }

    this.#capacity = capacity;
  }

  public size(): number {
    return this.#memory.size;
  }

  public byteLength(): number {
    let byteLength = 0;

    for(const item of this.#memory.values()) {
      if(!(item instanceof Uint8Array)) {
        throw new TypeError('Invalid memory value type');
      }

      byteLength += item.byteLength;
    }

    return byteLength;
  }

  public get capacity(): number {
    return this.#capacity;
  }

  public has(address: number): boolean {
    return this.#memory.has(address);
  }

  public hasVar(name: string): boolean {
    return this.#mappedAddressNames.has(name);
  }

  public alloc(size: number): number {
    if(size <= 0) {
      throw new RangeError('Memory allocation size must be greater than 0');
    }

    if(this.byteLength() + size > this.#capacity) {
      throw new RangeError('Memory allocation exceeds the memory capacity');
    }

    let address = this.#occupiedAddresses.length > 0 ? math.max(...this.#occupiedAddresses) + 1 : this.size();

    while(this.has(address)) {
      address++;
    }

    this.#memory.set(address, new Uint8Array(size));
    return address;
  }

  public setVar(name: string, address: number): void {
    if(this.hasVar(name)) {
      throw new Error('Variable name already exists');
    }

    this.#mappedAddressNames.set(name, address);
  }

  public free(address: number): boolean {
    if(!this.has(address)) return false;
    
    this.#memory.delete(address);
    this.#occupiedAddresses = this.#occupiedAddresses.filter(occupiedAddress => occupiedAddress !== address);

    for(const [name, mappedAddress] of this.#mappedAddressNames) {
      if(mappedAddress === address) {
        this.#mappedAddressNames.delete(name);
        break;
      }
    }

    return true;
  }

  public freeVar(name: string): boolean {
    if(!this.hasVar(name)) return false;
    return this.free(this.#mappedAddressNames.get(name) as number);
  }

  public erase(): void {
    this.#memory.clear();
    this.#occupiedAddresses = [];
    this.#mappedAddressNames.clear();
  }

  public read(address: number, length?: number, offset: number = 0): Uint8Array | null {
    if(!this.has(address)) return null;

    const memory = this.#memory.get(address);

    if(!(memory instanceof Uint8Array)) {
      throw new TypeError('Invalid memory value type');
    }

    length ??= memory.byteLength;

    if(offset < 0 || offset >= memory.byteLength) {
      throw new RangeError('Invalid memory read offset');
    }

    if(length <= 0 || offset + length > memory.byteLength) {
      throw new RangeError('Invalid memory read length');
    }

    return (
      length === memory.byteLength && offset === 0 ?
        memory :
        memory.subarray(offset, offset + length)
    );
  }

  public readVar(name: string, length?: number, offset: number = 0): Uint8Array | null {
    if(!this.hasVar(name)) return null;
    return this.read(this.#mappedAddressNames.get(name) as number, length, offset);
  }

  public getVarAddress(name: string): number | null {
    if(!this.hasVar(name)) return null;
    return this.#mappedAddressNames.get(name) as number;
  }

  public write(address: number, data: Uint8Array, offset: number = 0): boolean {
    if(!this.has(address)) return false;

    if(!(data instanceof Uint8Array)) {
      throw new TypeError('Invalid memory write data type');
    }

    const memory = this.#memory.get(address);

    if(!(memory instanceof Uint8Array)) {
      throw new TypeError('Invalid memory value type');
    }

    if(offset < 0 || offset >= memory.byteLength) {
      throw new RangeError('Invalid memory write offset');
    }

    if(data.byteLength <= 0 || offset + data.byteLength > memory.byteLength) {
      throw new RangeError('Invalid memory write data length');
    }

    memory.set(data, offset);
    return true;
  }

  public writeVar(name: string, data: Uint8Array, offset: number = 0): boolean {
    if(!this.hasVar(name)) return false;
    return this.write(this.#mappedAddressNames.get(name) as number, data, offset);
  }

  public copy(srcAddress: number, destAddress: number, length: number, srcOffset: number = 0, destOffset: number = 0): boolean {
    if(!this.has(srcAddress) || !this.has(destAddress)) return false;
    
    const srcMemory = this.#memory.get(srcAddress);
    const destMemory = this.#memory.get(destAddress);
    
    if(!(srcMemory instanceof Uint8Array) || !(destMemory instanceof Uint8Array)) {
      throw new TypeError('Invalid memory value type');
    }
    
    if(srcOffset < 0 || srcOffset >= srcMemory.byteLength) {
      throw new RangeError('Invalid memory copy source offset');
    }
    
    if(destOffset < 0 || destOffset >= destMemory.byteLength) {
      throw new RangeError('Invalid memory copy destination offset');
    }
    
    if(length <= 0 || srcOffset + length > srcMemory.byteLength || destOffset + length > destMemory.byteLength) {
      throw new RangeError('Invalid memory copy length');
    }
    
    destMemory.set(srcMemory.subarray(srcOffset, srcOffset + length), destOffset);
    return true;
  }

  public copyVar(srcName: string, destName: string, length: number, srcOffset: number = 0, destOffset: number = 0): boolean {
    if(!this.hasVar(srcName) || !this.hasVar(destName)) return false;
    return this.copy(this.#mappedAddressNames.get(srcName) as number, this.#mappedAddressNames.get(destName) as number, length, srcOffset, destOffset);
  }

  public fill(address: number, value: number, length: number, offset: number = 0): boolean {
    if(!this.has(address)) return false;
        
    const memory = this.#memory.get(address);
        
    if(!(memory instanceof Uint8Array)) {
      throw new TypeError('Invalid memory value type');
    }
        
    if(offset < 0 || offset >= memory.byteLength) {
      throw new RangeError('Invalid memory fill offset');
    }
        
    if(length <= 0 || offset + length > memory.byteLength) {
      throw new RangeError('Invalid memory fill length');
    }
        
    memory.fill(value, offset, offset + length);
    return true;
  }

  public fillVar(name: string, value: number, length: number, offset: number = 0): boolean {
    if(!this.hasVar(name)) return false;
    return this.fill(this.#mappedAddressNames.get(name) as number, value, length, offset);
  }

  public clear(address: number, length: number, offset: number = 0): boolean {
    return this.fill(address, 0, length, offset);
  }

  public clearVar(name: string, length: number, offset: number = 0): boolean {
    return this.fillVar(name, 0, length, offset);
  }

  public writeUint8(address: number, value: number, offset: number = 0): boolean {
    return this.write(address, new Uint8Array([value]), offset);
  }

  public writeUint16(address: number, value: number, offset: number = 0): boolean {
    return this.write(address, new Uint8Array(new Uint16Array([value]).buffer), offset);
  }

  public writeUint32(address: number, value: number, offset: number = 0): boolean {
    return this.write(address, new Uint8Array(new Uint32Array([value]).buffer), offset);
  }

  public writeUint64(address: number, value: bigint, offset: number = 0): boolean {
    return this.write(address, new Uint8Array(new BigUint64Array([value]).buffer), offset);
  }

  public writeInt8(address: number, value: number, offset: number = 0): boolean {
    return this.write(address, new Uint8Array(new Int8Array([value]).buffer), offset);
  }

  public writeInt16(address: number, value: number, offset: number = 0): boolean {
    return this.write(address, new Uint8Array(new Int16Array([value]).buffer), offset);
  }

  public writeInt32(address: number, value: number, offset: number = 0): boolean {
    return this.write(address, new Uint8Array(new Int32Array([value]).buffer), offset);
  }

  public writeInt64(address: number, value: bigint, offset: number = 0): boolean {
    return this.write(address, new Uint8Array(new BigInt64Array([value]).buffer), offset);
  }

  public writeBigInt64(address: number, value: bigint, offset: number = 0): boolean {
    return this.write(address, new Uint8Array(new BigUint64Array([value]).buffer), offset);
  }

  public readUint32(address: number, offset: number = 0): number {
    const data = this.read(address, 4, offset);
    if(!data) return 0;
    
    return new Uint32Array(data.buffer)[0];
  }
}


export function writeString(
  mem: VirtualizedMemory,
  value: string,
  offset: number = 0,
  encoding: BufferEncoding = 'utf-8' // eslint-disable-line comma-dangle
): number | null {
  let encodedValue: Uint8Array;

  if(typeof Buffer !== 'undefined') {
    encodedValue = Buffer.from(value, encoding);
  } else {
    encodedValue = new TextEncoder().encode(value);
  }

  const addr = mem.alloc(encodedValue.byteLength);
  if(!mem.write(addr, encodedValue, offset)) return null;
  
  return addr;
}


export function readString(
  mem: VirtualizedMemory,
  address: number,
  length?: number,
  offset: number = 0,
  encoding: BufferEncoding = 'utf-8' // eslint-disable-line comma-dangle
): string | null {
  const data = mem.read(address, length, offset);
  if(!data) return null;

  if(typeof Buffer !== 'undefined') return Buffer.from(data).toString(encoding);
  return new TextDecoder().decode(data);
}



let appMemory: VirtualMemory | undefined;

export function getMemory(): VirtualMemory {
  if(!appMemory) {
    appMemory = new VirtualMemory();
  }

  return appMemory;
}


export function sizeof(dataType: 'number' | 'uint32'): number {
  switch(dataType) {
    case 'number':
      return 0x8;
    case 'uint32':
      return 0x4;
    default:
      throw new TypeError('Invalid data type');
  }
}


export default VirtualMemory;
