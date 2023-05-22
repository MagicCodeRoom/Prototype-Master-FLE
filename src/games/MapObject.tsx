
import gs from "../data/GameSpecs";
import { ObjectTypes } from "../data/GameSpecs";
import TileMap from "./TileMap";

//#12 new class to store our map object: stores the map tile on which the object appears and the object's type

export default class MapObject{
    x: number;
    y: number;
    type: number;
    placeAt:(x:number, y:number)=>void

    mapTileData:TileMap;

    constructor(nt:number, mapTileData:TileMap, toIndex:(x:number, y:number)=>number){
        this.x		= 0;
        this.y		= 0;
        this.type	= nt;
        this.mapTileData = mapTileData

        // place the object at postion on map
        this.placeAt = function(nx:number, ny:number){
            // if the object has previously been placed if first detroyes its reference on the current tile
            if(mapTileData.map[toIndex(this.x, this.y)].object==this){
                mapTileData.map[toIndex(this.x, this.y)].object = null;
            }
            this.x = nx;
            this.y = ny;
            
            mapTileData.map[toIndex(nx, ny)].object = this;
        };




    }
}