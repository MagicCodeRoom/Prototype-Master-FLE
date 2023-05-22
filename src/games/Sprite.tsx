// interface Frames {
//     x:number;
//     y:number;
//     w:number;
//     h:number;
//     d:number;
// }
// interface CanvasRenderingContext2D {
//     drawImage(image: HTMLImageElement, x: number, y: number, width?: number, height?: number,
//               dx?: number, dy?: number, dWidth?: number, dHeight?: number): void;
// }

export default class Sprite{

    animated	: boolean;
    frameCount	: number;
    duration	: number;
    loop        : boolean;
    frames      : any;
    opacity : number
    draw        :(t:number, x:number, y:number, ctx:CanvasRenderingContext2D ,tileset:HTMLImageElement)=>void

    constructor(data:Array<{[key:string]: number }>){
    this.opacity = 1
    this.animated	= data.length > 1; // is true if there is more than one frame to be looped
	this.frameCount	= data.length;
	this.duration	= 0;
	this.loop		= true; // tell if the sprite animation should be looped
	if(data.length > 1){
		for(var i in data){
			if(typeof data[i].d=='undefined'){
				data[i].d = 100; // d is the duration in ms
			}
			this.duration += data[i].d;
			
			if(typeof data[i].loop   !='undefined'){
				this.loop = data[i].loop ? true : false;
			}
		}
	}
	this.frames	= data; // data is an array

    this.draw = function(t:number, x:number, y:number,  ctx: CanvasRenderingContext2D, tileset:HTMLImageElement){
        // console.log("draeing")
        let frameIdx = 0;
        
        if(!this.loop && this.animated && t>=this.duration){
            frameIdx = (this.frames.length - 1);
        }
        else if(this.animated){
            t = t % this.duration;
            var totalD = 0;
            
            for(let j in this.frames)
            {
                totalD += this.frames[i].d;
                frameIdx = Number(j);
                
                if(t<=totalD)
                {
                    break;
                }
            }
        }
        // check if the frame has an offset
        let offset = (typeof this.frames[frameIdx].offset=='undefined' ? [0,0] : this.frames[frameIdx].offset);

        ctx.globalAlpha = this.opacity;


        ctx.drawImage(tileset, 
                        this.frames[frameIdx].x, this.frames[frameIdx].y,
                        this.frames[frameIdx].w, this.frames[frameIdx].h, 
                        x + offset[0], 
                        y + offset[1], 
                        this.frames[frameIdx].w+10, this.frames[frameIdx].h+10
                        
            );/// !!!! size + 10 to avoid the margin issues


        }




    }
}