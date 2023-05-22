import TileMap from "./TileMap";




export default class PlacedItemStack{
    type    :number;
    qty     :number;
    x       :number;
    y       :number;

    placeAt : (nx:number, ny:number, mapTileData:TileMap, toIndex:(x:number, y:number)=>number)=> void


    constructor(id:number, qty:number){
        this.type = id;
        this.qty = qty;
        this.x = 0;
        this.y = 0;

        // places the stack on the map
        this.placeAt = function(nx:number, ny:number,  mapTileData:TileMap, toIndex:(x:number, y:number)=>number){
            //first check if the stack is already placed on the tile 
            if(mapTileData.map[toIndex(this.x, this.y)].itemStack==this){
                mapTileData.map[toIndex(this.x, this.y)].itemStack = null;
            }
            
            this.x = nx;
            this.y = ny;
            
            mapTileData.map[toIndex(nx, ny)].itemStack = this;
        };


    }

}
    
    
    
    




