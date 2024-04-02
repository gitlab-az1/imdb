import { VirtualMemory, writeString, readString } from './memory';


describe('Virtual Memory', () => {
  test('it should be ok', () => {
    expect(25 ** 0.5).toBe(5);
  });

  test('should create a new instance', () => {
    const memory = new VirtualMemory();
    expect(memory).toBeInstanceOf(VirtualMemory);
  });
  
  test('should get the memory capacity', () => {
    const memory = new VirtualMemory();
    expect(memory.capacity).toBe((Number.MAX_SAFE_INTEGER - 1) / 8);
  });

  test('should get the memory size', () => {
    const memory = new VirtualMemory();
    expect(memory.size()).toBe(0);
  });

  test('should get the memory byte length', () => {
    const memory = new VirtualMemory();
    expect(memory.byteLength()).toBe(0);
  });

  test('should allocate memory', () => {
    const memory = new VirtualMemory();
    const address = memory.alloc(10);
    expect(address).toBe(0);
  });
  
  test('should write a string to memory', () => {
    const memory = new VirtualMemory();
    const address = writeString(memory, 'Hello');

    if(!address) return expect(typeof address).toBe('number');
    expect(readString(memory, address, 5)).toBe('Hello');
  });

  test('should free memory', () => {
    const memory = new VirtualMemory();
    const address = memory.alloc(10);
    expect(memory.free(address)).toBe(true);
  });

  test('should not free memory with a non-existent address', () => {
    const memory = new VirtualMemory();
    expect(memory.free(0)).toBe(false);
  });

  test('should not allocate memory with a size of 0', () => {
    const memory = new VirtualMemory();
    expect(() => memory.alloc(0)).toThrow(RangeError);
  });

  test('should not allocate memory exceeding the memory capacity', () => {
    const memory = new VirtualMemory();
    expect(() => memory.alloc(memory.capacity + 1)).toThrow(RangeError);
  });
});
