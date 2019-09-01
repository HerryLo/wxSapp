import { strict } from "assert";
import { string, number } from "prop-types";

export interface SelectedSort {
    name: string;
    des: string;
    req: string;
    inc: string;
    color: string;
    iconClass: string;
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
