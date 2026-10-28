// src/utils/coord.ts
// WGS84 -> GCJ-02 坐标转换（微信内置地图为 GCJ-02，需纠偏）

const PI = 3.14159265358979324;
const A = 6378245.0;
const EE = 0.00669342162296594323;

function outOfChina(lng: number, lat: number): boolean {
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

function transLat(x: number, y: number): number {
  let r =
    -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  r += ((20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2) / 3;
  r += ((20 * Math.sin(y * PI) + 40 * Math.sin((y / 3) * PI)) * 2) / 3;
  r += ((160 * Math.sin((y / 12) * PI) + 320 * Math.sin((y * PI) / 30)) * 2) / 3;
  return r;
}

function transLng(x: number, y: number): number {
  let r =
    300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  r += ((20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2) / 3;
  r += ((20 * Math.sin(x * PI) + 40 * Math.sin((x / 3) * PI)) * 2) / 3;
  r += ((150 * Math.sin((x / 12) * PI) + 300 * Math.sin((x / 30) * PI)) * 2) / 3;
  return r;
}

export function wgs2gcj(lng: number, lat: number): [number, number] {
  if (outOfChina(lng, lat)) return [lng, lat];
  let dLat = transLat(lng - 105, lat - 35);
  let dLng = transLng(lng - 105, lat - 35);
  const radLat = (lat / 180) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI);
  dLng = (dLng * 180) / ((A / sqrtMagic) * Math.cos(radLat) * PI);
  return [lng + dLng, lat + dLat];
}
