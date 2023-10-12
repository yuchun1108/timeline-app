export interface AnimInfo
{
    channels: Channel[];
}

export interface Channel
{
    name:string;
    keyframes: Keyframe[];
    id:string;
}

export interface Keyframe{
    index:number;
    id:string;
}