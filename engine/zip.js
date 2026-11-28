'use strict';
const PipiZip = (function zipFactory() {
  const encoder = new TextEncoder();
  const crcTable = Uint32Array.from({ length: 256 }, (_, i) => {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  function crc32(bytes) {
    let c = 0xffffffff;
    for (const b of bytes) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }
  async function deflateRaw(bytes) {
    if (typeof CompressionStream !== 'function') return null;
    try {
      const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
      return new Uint8Array(await new Response(stream).arrayBuffer());
    } catch {
      return null;
    }
  }
  async function zip(files, { compress = deflateRaw } = {}) {
    if (!Array.isArray(files) || files.length > 65535) throw Error("error.zip.entries");
    const parts = [],
      central = [],
      names = new Set();
    let offset = 0,
      cs = 0;
    for (const [name, raw] of files) {
      if (typeof name !== 'string' || !name || names.has(name)) throw Error("error.zip.entry");
      names.add(name);
      const fn = encoder.encode(name),
        data = typeof raw === 'string' ? encoder.encode(raw) : raw;
      if (!(data instanceof Uint8Array) || fn.length > 65535 || data.length > 0xffffffff)
        throw Error("error.zip.size");
      const crc = crc32(data);
      let packed = data,
        method = 0;
      if (compress && data.length) {
        try {
          const candidate = await compress(data);
          if (candidate instanceof Uint8Array && candidate.length < data.length) {
            packed = candidate;
            method = 8;
          }
        } catch {
          /* Keep a valid stored entry on unsupported runtimes. */
        }
      }
      const loc = new Uint8Array(30 + fn.length),
        l = new DataView(loc.buffer);
      l.setUint32(0, 0x04034b50, true);
      l.setUint16(4, 20, true);
      l.setUint16(6, 0x800, true);
      l.setUint16(8, method, true);
      l.setUint16(12, 33, true);
      l.setUint32(14, crc, true);
      l.setUint32(18, packed.length, true);
      l.setUint32(22, data.length, true);
      l.setUint16(26, fn.length, true);
      loc.set(fn, 30);
      const cen = new Uint8Array(46 + fn.length),
        d = new DataView(cen.buffer);
      d.setUint32(0, 0x02014b50, true);
      d.setUint16(4, 20, true);
      d.setUint16(6, 20, true);
      d.setUint16(8, 0x800, true);
      d.setUint16(10, method, true);
      d.setUint16(14, 33, true);
      d.setUint32(16, crc, true);
      d.setUint32(20, packed.length, true);
      d.setUint32(24, data.length, true);
      d.setUint16(28, fn.length, true);
      d.setUint32(42, offset, true);
      cen.set(fn, 46);
      parts.push(loc, packed);
      central.push(cen);
      offset += loc.length + packed.length;
      cs += cen.length;
      if (offset + cs + 22 > 0xffffffff) throw Error("error.zip.size");
    }
    const end = new Uint8Array(22),
      e = new DataView(end.buffer);
    e.setUint32(0, 0x06054b50, true);
    e.setUint16(8, files.length, true);
    e.setUint16(10, files.length, true);
    e.setUint32(12, cs, true);
    e.setUint32(16, offset, true);
    const out = new Uint8Array(offset + cs + 22);
    let at = 0;
    for (const p of [...parts, ...central, end]) {
      out.set(p, at);
      at += p.length;
    }
    return out;
  }
  return { crc32, zip, deflateRaw };
})();
if (typeof module !== 'undefined') module.exports = PipiZip;
