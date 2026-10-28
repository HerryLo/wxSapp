// src/data/plants.ts
export type CoordType = 'exact' | 'est' | 'approx';
/** 坐标系：wgs84（原始记录）| gcj02（来自腾讯/高德地图 POI，可直接用于 map 组件） */
export type CoordSys = 'wgs84' | 'gcj02';
export type CityKey = 'shanghai' | 'wuhan';

export interface Plant {
  id: number;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  sys: CoordSys;
  type: CoordType;
  note?: string;
}

export interface CityPlants {
  key: CityKey;
  name: string;
  /** 地图默认视角 */
  center: { latitude: number; longitude: number; scale: number };
  plants: Plant[];
}

export const coordTypeText: Record<CoordType, string> = {
  exact: '精确坐标',
  est: '估算坐标',
  approx: '近似坐标',
};

/** 设施点位与信息整理更新时间 */
export const PLANTS_UPDATED_AT = '2026-10-28';

/**
 * 垃圾焚烧厂坐标来源说明：
 * - gcj02 条目：来自腾讯地图 POI / 官方公示，可直接用于微信 map 组件，不再转换
 * - wgs84 条目：原始记录或环评 DMS 坐标，展示前经 wgs2gcj 纠偏
 */
export const shanghaiPlants: Plant[] = [
  { id: 1, title: '老港再生能源利用中心', address: '浦东新区老港镇南滨公路2088弄288号', latitude: 31.045574, longitude: 121.905887, sys: 'wgs84', type: 'exact', note: '含一、二期，统计口径可能分列' },
  { id: 2, title: '浦东海滨资源再利用中心（浦发热电）', address: '浦东新区老港镇堤韵路1399号', latitude: 31.067568, longitude: 121.878778, sys: 'gcj02', type: 'exact', note: '坐标来源：腾讯地图 POI' },
  { id: 3, title: '黎明资源再利用中心', address: '浦东新区曹路镇浩江路259号', latitude: 31.282576, longitude: 121.718096, sys: 'gcj02', type: 'exact', note: '坐标来源：腾讯地图 POI' },
  { id: 4, title: '宝山再生能源利用中心', address: '宝山区罗泾镇川念路169号', latitude: 31.474722, longitude: 121.381808, sys: 'wgs84', type: 'exact', note: '原罗泾钢铁厂地块' },
  { id: 5, title: '上海江桥生活垃圾焚烧厂', address: '嘉定区江桥镇绥德路800号', latitude: 31.267870, longitude: 121.361897, sys: 'gcj02', type: 'exact', note: '运营主体：上海环城再生能源有限公司；坐标来源：腾讯地图 POI' },
  { id: 6, title: '嘉定再生能源（嘉定焚烧厂）', address: '嘉定区外冈镇恒飞路2000号（古塘村688号）', latitude: 31.3965, longitude: 121.2040, sys: 'wgs84', type: 'est', note: '官方地址为外冈镇恒飞路2000号/古塘村688号，位于宝钱公路南侧约600米、外钱公路以西；坐标仍为估算，建议拾取校准' },
  { id: 7, title: '天马再生能源（天马焚烧厂）', address: '松江区佘山镇青天路669号', latitude: 31.0926, longitude: 121.1044, sys: 'wgs84', type: 'exact', note: '' },
  { id: 8, title: '奉贤焚烧厂（东石塘/维皓）', address: '奉贤区柘林镇漴缺村1488号/1490号', latitude: 30.829080, longitude: 121.451939, sys: 'gcj02', type: 'exact', note: '一、二期相邻，合并为一个点位；坐标来源：腾讯地图 POI' },
  { id: 9, title: '金山环境再生能源（金山焚烧厂）', address: '金山区金山卫镇海金路728号', latitude: 30.708306, longitude: 121.278602, sys: 'gcj02', type: 'exact', note: '金山第二工业区A33地块；坐标来源：腾讯地图 POI' },
  { id: 10, title: '崇明固废处置综合利用中心', address: '崇明区港沿镇港沿公路4098号', latitude: 31.633756, longitude: 121.699653, sys: 'wgs84', type: 'exact', note: '坐标来源：环评公示（121°41′58.75″E, 31°38′1.52″N），已纠正原 31.59/121.66 的近似值' },
];

export const wuhanPlants: Plant[] = [
  { id: 1, title: '锅顶山生活垃圾焚烧发电厂', address: '汉阳区永丰街道汉阳大道永安堂172号', latitude: 30.569316, longitude: 114.183726, sys: 'gcj02', type: 'exact', note: '运营：武汉博瑞环保；坐标来源：腾讯地图 POI' },
  { id: 2, title: '新沟生活垃圾焚烧发电厂', address: '东西湖区新沟镇惠安大道129号', latitude: 30.689145, longitude: 113.962048, sys: 'wgs84', type: 'exact', note: '运营：武汉深能环保（深圳能源）；坐标来源：Global Energy Monitor' },
  { id: 3, title: '汉口北生活垃圾焚烧发电厂', address: '黄陂区盘龙城经济开发区刘店村', latitude: 30.6890, longitude: 114.2870, sys: 'wgs84', type: 'est', note: '运营：武汉汉口绿色能源；坐标为按地址估算，建议拾取校准' },
  { id: 4, title: '星火生活垃圾焚烧发电厂', address: '青山区（武汉化学工业区）绿色大道18号', latitude: 30.6080, longitude: 114.4430, sys: 'wgs84', type: 'est', note: '运营：武汉绿色动力；坐标为按地址估算，建议拾取校准' },
  { id: 5, title: '长山口生活垃圾焚烧发电厂', address: '江夏区郑店街雷竹村', latitude: 30.3270, longitude: 114.2360, sys: 'wgs84', type: 'est', note: '运营：武汉市绿色环保能源；武汉规模最大（约3500吨/日）；坐标为估算' },
  { id: 6, title: '千子山焚烧发电厂（一期、二期）', address: '蔡甸区土桐线千子山循环经济产业园内', latitude: 30.4150, longitude: 114.0300, sys: 'wgs84', type: 'est', note: '一、二期同园区，合并为一个点位；坐标为估算' },
];

export const plantCities: CityPlants[] = [
  {
    key: 'shanghai',
    name: '上海',
    center: { latitude: 31.1548, longitude: 121.5639, scale: 9 },
    plants: shanghaiPlants,
  },
  {
    key: 'wuhan',
    name: '武汉',
    center: { latitude: 30.5200, longitude: 114.2000, scale: 9 },
    plants: wuhanPlants,
  },
];

/** 所有城市设施总数 */
export const plantTotal = plantCities.reduce(
  (total, city) => total + city.plants.length,
  0
);

/** 城市名列表，用于文案展示，如「上海 · 武汉」 */
export const plantCityNames = plantCities.map(city => city.name).join(' · ');
