export interface GarbageItem {
    name: string;
    category: string;
    content: string;
}

export interface GarbageResponse {
    code: number;
    data?: Array<GarbageItem>;
    msg?: string;
}

export interface SelectedSort {
    name: string;
    des: string;
    req: string;
    inc: string;
    color: string;
    iconClass: string;
}

export interface SavedCity {
    name: string;
    location: string;
}

export interface CityItem {
    id: string;
    name: string;
    adm2?: string;
    lat?: string;
    lon?: string;
}

export interface WrongItem {
    n: string;
    c: string;
    chosen: number;
    ts: number;
}

export interface DailyStats {
    lastDate: string;
    streak: number;
    total: number;
}

interface resultsItemType {
    currentCity: string;
    pm25: number;
    index: Array<{
        des: string;
        tipt: string;
        title: string;
        zs: string;
    }>;
    weather_data: Array<weatherDataItemType>;
}

interface weatherDataItemType {
    date: string;
    dayPictureUrl: string;
    nightPictureUrl: string;
    weather: string;
    wind: string;
    temperature: string;
}

export interface currentWeatherType {
    currentCity: string;
    pm25: string;
    date: string;
    temperature: string;
    weatherDesc: string;
    wind: string;
    arrDate: Array<string>;
}

interface originalDataType {
    error: number;
    status: string;
    date: string;
    results: Array<resultsItemType>;
}

export interface dataInfoType {
    originalData: originalDataType;
    currentWeather: Array<currentWeatherType>;
}
