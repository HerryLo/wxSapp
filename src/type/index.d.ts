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

interface Target<T> {
    dataset: T;
    id: string;
    offsetLeft: number;
    offsetTop: number;
    x: number;
    y: number;
}

interface Touches {
    clientX: number;
    clientY: number;
    force: number;
    identifier: number;
    pageX: number;
    pageY: number;
}

export interface EventHandle<T> extends ITouchEvent {
    preventDefault: ()=> void;
    changedTouches: Array<Touches>;
    detail: { x: number, y: number};
    currentTarget: Target<T>;
    target: Target<T>;
    type: string;
    timeStamp: number;
}
