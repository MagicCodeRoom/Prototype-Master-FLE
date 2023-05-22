
import MapObject from "./MapObject";
import Stack from "./Stack";

interface Roof {
    x: number;
    y: number;
    w: number;
    h: number;
    data: number[];
  }



export default class Tile{
    x		    :number;
    y			:number;
    type		:number;
    walkable    :boolean;
    trigerQuiz  : boolean
    roof		: Roof | null;
    roofType	:number; // roofType is the id of the corresponding entry for the roof graphic to use in the tileTypes array.
    object      : MapObject | null
    itemStack   : Stack | null
    hasNPC      : boolean;
    hasSecret   : boolean;
    secretObj   : {[key:string]:any}={};
    npcName      :string;
    isVisible    : boolean
    visibleOpacity : number
    eventEnter	:(...args: any[]) => void; //...args: any[] make it possible to pass any number of argument
    
    constructor(tx:number, ty:number, tt:number){
        this.x			= tx;
        this.y			= ty;
        this.type		= tt;// tt: the id of the tileType entry of the tile at this position.
        this.roof		= null;
        this.roofType	= 0; // roofType is the id of the corresponding entry for the roof graphic to use in the tileTypes array.
        this.object     = null; // stores a ref of an object if palced on this
        this.hasNPC     = false;
        this.hasSecret  = false
        this.secretObj  = {}
        this.trigerQuiz = false
        this.npcName      = "";
        this.itemStack  =  null;
        this.walkable   = true ;
        this.isVisible  = false ;
        this.visibleOpacity = 0.01
    
       
        this.eventEnter = () => {};


    }
}