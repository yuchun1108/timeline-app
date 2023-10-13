export interface AnimInfo
{
    channels: Channel[];
}

export interface AnimNode
{
    discriminator:string;
    id:string;
}

export interface Channel extends AnimNode
{
    discriminator:"channel";
    name:string;
    target:string;
    attr:string;
    keyframes: Keyframe[];
}

export interface Keyframe extends AnimNode
{
    discriminator:"keyframe";
    index:number;
    value:any;
}