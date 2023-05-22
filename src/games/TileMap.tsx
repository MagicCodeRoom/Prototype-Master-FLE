
import Tile from "./Tile";
import gs from "../data/GameSpecs";

interface Roof {
    x: number;
    y: number;
    w: number;
    h: number;
    data: number[];
  }

export default class TileMap{
    map: Array<Tile>; // cannot be map: [] coz = Array<unknown> , Tile is pushed in and don't correspond to unknown
    w: number;
    h: number;
    levels: number;

    
    //d, an array containing the tileType ids
    buildMapFromData:(d: number[], w: number, h: number)=>boolean;

    addRoofs:(roofs:Array<Roof>)=>void
 
    constructor(){
        this.map	= [];
        this.w		= 0;
        this.h		= 0;
        this.levels  = 4; //number of layers to draw // 4 is hardcoded / it should be done dynamically in normal time
        
        //d = gs.mapper, nTileW and nTileH
        this.buildMapFromData = function(d, w, h){ 
        this.w		= w;
        this.h		= h;
        if(d.length!=(w*h)){
            return false; 
        }
        this.map.length	= 0; // rest
        //push
        for(var y = 0; y < h; y++){
            for(var x = 0; x < w; x++){
                // push the right tile 
                // 3rd arg is tile number type
                this.map.push( new Tile(x, y, d[ ((y*w)+x) ] ) );
                
            }
        }
        return true;
        };

        //  take an array of roof objects as its argument
        this.addRoofs = function(roofs:Array<Roof>){
            for(var i in roofs){
                var r = roofs[i];
                
                if(r.x < 0 || r.y < 0 || r.x >= this.w || r.y >= this.h ||
                    (r.x+r.w)>this.w || (r.y+r.h)>this.h ||
                    r.data.length!=(r.w*r.h))
                {
                    continue;
                }
                
                for(var y = 0; y < r.h; y++)
                {
                    for(var x = 0; x < r.w; x++)
                    {
                        var tileIdx = (((r.y+y)*this.w)+r.x+x);
                        
                        this.map[tileIdx].roof = r;
                        this.map[tileIdx].roofType = r.data[((y*r.w)+x)];
                    }
                }
            }
        };
    };

}