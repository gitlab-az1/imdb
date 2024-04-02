import { Exception } from './errors';


const _ucrc_32_table: number[] = [
  0x2d02ef8d,  0x5a05df1b,  0xc30c8ea1,  0xb40bbe37,
  0x2a6f2b94,  0x5d681b02,  0xc4614ab8,  0xb3667a2e,
  0x23d967bf,  0x54de5729,  0xcdd70693,  0xbad03605,
  0x24b4a3a6,  0x53b39330,  0xcabac28a,  0xbdbdf21c,
  0x30b5ffe9,  0x47b2cf7f,  0xdebb9ec5,  0xa9bcae53,
  0x37d83bf0,  0x40df0b66,  0xd9d65adc,  0xaed16a4a,
  0x3e6e77db,  0x4969474d,  0xd06016f7,  0xa7672661,
  0x3903b3c2,  0x4e048354,  0xd70dd2ee,  0xa00ae278,
  0x166ccf45,  0x616bffd3,  0xf862ae69,  0x8f659eff,
  0x11010b5c,  0x66063bca,  0xff0f6a70,  0x88085ae6,
  0x18b74777,  0x6fb077e1,  0xf6b9265b,  0x81be16cd,
  0x1fda836e,  0x68ddb3f8,  0xf1d4e242,  0x86d3d2d4,
  0xbdbdf21,   0x7cdcefb7,  0xe5d5be0d,  0x92d28e9b,
  0xcb61b38,   0x7bb12bae,  0xe2b87a14,  0x95bf4a82,
  0x5005713,   0x72076785,  0xeb0e363f,  0x9c0906a9,
  0x26d930a,   0x756aa39c,  0xec63f226,  0x9b64c2b0,
  0x5bdeae1d,  0x2cd99e8b,  0xb5d0cf31,  0xc2d7ffa7,
  0x5cb36a04,  0x2bb45a92,  0xb2bd0b28,  0xc5ba3bbe,
  0x5505262f,  0x220216b9,  0xbb0b4703,  0xcc0c7795,
  0x5268e236,  0x256fd2a0,  0xbc66831a,  0xcb61b38c,
  0x4669be79,  0x316e8eef,  0xa867df55,  0xdf60efc3,
  0x41047a60,  0x36034af6,  0xaf0a1b4c,  0xd80d2bda,
  0x48b2364b,  0x3fb506dd,  0xa6bc5767,  0xd1bb67f1,
  0x4fdff252,  0x38d8c2c4,  0xa1d1937e,  0xd6d6a3e8,
  0x60b08ed5,  0x17b7be43,  0x8ebeeff9,  0xf9b9df6f,
  0x67dd4acc,  0x10da7a5a,  0x89d32be0,  0xfed41b76,
  0x6e6b06e7,  0x196c3671,  0x806567cb,  0xf762575d,
  0x6906c2fe,  0x1e01f268,  0x8708a3d2,  0xf00f9344,
  0x7d079eb1,  0xa00ae27,   0x9309ff9d,  0xe40ecf0b,
  0x7a6a5aa8,  0xd6d6a3e,   0x94643b84,  0xe3630b12,
  0x73dc1683,  0x4db2615,   0x9dd277af,  0xead54739,
  0x74b1d29a,  0x3b6e20c,   0x9abfb3b6,  0xedb88320,
  0xc0ba6cad,  0xb7bd5c3b,  0x2eb40d81,  0x59b33d17,
  0xc7d7a8b4,  0xb0d09822,  0x29d9c998,  0x5edef90e,
  0xce61e49f,  0xb966d409,  0x206f85b3,  0x5768b525,
  0xc90c2086,  0xbe0b1010,  0x270241aa,  0x5005713c,
  0xdd0d7cc9,  0xaa0a4c5f,  0x33031de5,  0x44042d73,
  0xda60b8d0,  0xad678846,  0x346ed9fc,  0x4369e96a,
  0xd3d6f4fb,  0xa4d1c46d,  0x3dd895d7,  0x4adfa541,
  0xd4bb30e2,  0xa3bc0074,  0x3ab551ce,  0x4db26158,
  0xfbd44c65,  0x8cd37cf3,  0x15da2d49,  0x62dd1ddf,
  0xfcb9887c,  0x8bbeb8ea,  0x12b7e950,  0x65b0d9c6,
  0xf50fc457,  0x8208f4c1,  0x1b01a57b,  0x6c0695ed,
  0xf262004e,  0x856530d8,  0x1c6c6162,  0x6b6b51f4,
  0xe6635c01,  0x91646c97,  0x86d3d2d,   0x7f6a0dbb,
  0xe10e9818,  0x9609a88e,  0xf00f934,   0x7807c9a2,
  0xe8b8d433,  0x9fbfe4a5,  0x6b6b51f,   0x71b18589,
  0xefd5102a,  0x98d220bc,  0x1db7106,   0x76dc4190,
  0xb6662d3d,  0xc1611dab,  0x58684c11,  0x2f6f7c87,
  0xb10be924,  0xc60cd9b2,  0x5f058808,  0x2802b89e,
  0xb8bda50f,  0xcfba9599,  0x56b3c423,  0x21b4f4b5,
  0xbfd06116,  0xc8d75180,  0x51de003a,  0x26d930ac,
  0xabd13d59,  0xdcd60dcf,  0x45df5c75,  0x32d86ce3,
  0xacbcf940,  0xdbbbc9d6,  0x42b2986c,  0x35b5a8fa,
  0xa50ab56b,  0xd20d85fd,  0x4b04d447,  0x3c03e4d1,
  0xa2677172,  0xd56041e4,  0x4c69105e,  0x3b6e20c8,
  0x8d080df5,  0xfa0f3d63,  0x63066cd9,  0x14015c4f,
  0x8a65c9ec,  0xfd62f97a,  0x646ba8c0,  0x136c9856,
  0x83d385c7,  0xf4d4b551,  0x6ddde4eb,  0x1adad47d,
  0x84be41de,  0xf3b97148,  0x6ab020f2,  0x1db71064,
  0x90bf1d91,  0xe7b82d07,  0x7eb17cbd,  0x9b64c2b,
  0x97d2d988,  0xe0d5e91e,  0x79dcb8a4,  0xedb8832,
  0x9e6495a3,  0xe963a535,  0x706af48f,  0x76dc419,
  0x990951ba,  0xee0e612c,  0x77073096,  0x0,
];


/**
 * CRC32 lookup table used for calculations.
 */
export const crc32Table = ((function() {
  const table = [];

  for(let i = 0; i < _ucrc_32_table.length; i++) {
    table.push(_ucrc_32_table[i]);
  }

  return table;
})());


function _ValidateCRC32Table(): void {
  if(_ucrc_32_table.length !== 256) {
    throw new Exception('Failed to validate CRC32 table', {
      errorCode: 'ERR_INVALID_BUFFER_SIZE',
      expected: 256,
      received: _ucrc_32_table.length,
    });
  }

  const table = [];

  for(let i = 0; i < 256; i++) {
    let crc = i;

    for(let j = 0; j < 8; j++) {
      crc = (crc & 1 ? 0 : 0xEDB88320) ^ (crc >>> 1);
    }

    table[i] = crc >>> 0;
  }

  if(table.length !== _ucrc_32_table.length) {
    throw new Exception('Failed to validate CRC32 table', {
      errorCode: 'ERR_INVALID_BUFFER_SIZE',
      expected: table.length,
      received: _ucrc_32_table.length,
    });
  }

  for(let i = 0; i < table.length; i++) {
    if(table[i] !== _ucrc_32_table[i]) {
      throw new Exception('Failed to validate CRC32 table', {
        errorCode: 'ERR_INVALID_BUFFER',
        expected: table[i],
        received: _ucrc_32_table[i],
      });
    }
  }
}


/**
 * Validates a user-provided CRC32 table.
 * @param {number[]} _buf - The CRC32 table to validate.
 * @throws {Exception} Throws an exception if the CRC32 table is invalid.
 */
export function validateCRC32Table(_buf: number[]): void {
  if(!_buf || !Array.isArray(_buf)) {
    throw new Exception('Failed to validate CRC32 table', {
      errorCode: 'ERR_INVALID_BUFFER',
      expected: 'Array',
      received: typeof _buf,
    });
  }

  if(_buf.length !== 256) {
    throw new Exception('Failed to validate CRC32 table', {
      errorCode: 'ERR_INVALID_BUFFER_SIZE',
      expected: 256,
      received: _buf.length,
    });
  }

  const table = [];

  for(let i = 0; i < 256; i++) {
    let crc = i;

    for(let j = 0; j < 8; j++) {
      crc = (crc & 1 ? 0 : 0xEDB88320) ^ (crc >>> 1);
    }

    table[i] = crc >>> 0;
  }

  if(table.length !== _buf.length) {
    throw new Exception('Failed to validate CRC32 table', {
      errorCode: 'ERR_INVALID_BUFFER_SIZE',
      expected: table.length,
      received: _buf.length,
    });
  }

  for(let i = 0; i < table.length; i++) {
    if(table[i] !== _buf[i]) {
      throw new Exception('Failed to validate CRC32 table', {
        errorCode: 'ERR_INVALID_BUFFER',
        expected: table[i],
        received: _buf[i],
      });
    }
  }
}


function _calculateCRC32(__buffer: Buffer | number[]): number {
  if(!Array.isArray(__buffer) && !Buffer.isBuffer(__buffer)) {
    throw new Exception('Failed to calculate CRC32', {
      errorCode: 'ERR_INVALID_BUFFER',
      expected: 'Array<number> | Buffer',
      received: typeof __buffer,
    });
  }

  _ValidateCRC32Table();

  let crc = 0xFFFFFFFF;

  for(let i = 0; i < __buffer.length; i++) {
    crc = (crc >>> 8) ^ _ucrc_32_table[(crc ^ __buffer[i]) & 0xFF];
  }

  return (crc ^ 0xFFFFFFFF) >>> 0;
}


/**
 * Calculates the CRC32 checksum for the given buffer.
 * @param {Buffer} _buf The buffer for which to calculate the CRC32 checksum.
 * @returns {number} The calculated CRC32 checksum.
 * @throws {Exception} Throws an exception if the input buffer is invalid.
 */
export function crc32(_buf: Buffer): number {
  return _calculateCRC32(_buf);
}

export default crc32;
