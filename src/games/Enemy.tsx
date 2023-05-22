
import Character from "./Character";
import Sprite from "./Sprite";
import gs from "../data/GameSpecs";
import TileMap from "./TileMap";

export default class Enemy extends Character{
    test: string
    constructor(tileTypes: any, toIndex:(x:number, y:number)=>number, mapTileData:TileMap,
    isNpc:boolean,isEnemy:boolean, charName:string, playMode:string, classRoomClient:any, startPos:number[],navigate:any){
        super(tileTypes, toIndex,mapTileData,isNpc,isEnemy, charName, playMode, classRoomClient, startPos,navigate);

    this.test = "hey"
    let sPa = 600
    


// marching
this.isEnemy = true
var ghost_w = 16
var ghost_h = 34
var ghost_x = 16
var ghost_y = 62


this.sprites[gs.directions.right]  = new Sprite([
                                                {x:ghost_x*0,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*1,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*2,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
                                                {x:ghost_x*3,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*4,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*5,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*6,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
                                                {x:ghost_x*7,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},

                                            
]);
    
this.sprites[gs.directions.up]  = new Sprite([  {x:ghost_x*8,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*9,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*10,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
                                                {x:ghost_x*11,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*12,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*13,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*14,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
                                                {x:ghost_x*15,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                            ]);



this.sprites[gs.directions.left]  = new Sprite([
                                                {x:ghost_x*16,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*17,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*18,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
                                                {x:ghost_x*19,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*20,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*21,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*22,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
                                                {x:ghost_x*23,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},

]);

this.sprites[gs.directions.down]  = new Sprite([{x:ghost_x*24,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*25,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*26,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
                                                {x:ghost_x*27,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*28,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*29,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                {x:ghost_x*30,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
                                                {x:ghost_x*31,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},

]);
///standing




this.sprites[gs.directions.standingRight]  = new Sprite([

    
    {x:ghost_x*16,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*17,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*18,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
    {x:ghost_x*19,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*20,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*21,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*22,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
    {x:ghost_x*23,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
   
]);

this.sprites[gs.directions.standingUp]  = new Sprite([  
    {x:ghost_x*8,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*9,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*10,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
    {x:ghost_x*11,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*12,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*13,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*14,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
    {x:ghost_x*15,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
]);



this.sprites[gs.directions.standingLeft]  = new Sprite([


    {x:ghost_x*0,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*1,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*2,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
    {x:ghost_x*3,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*4,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*5,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
    {x:ghost_x*6,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
    {x:ghost_x*7,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
  
    ]);


this.sprites[gs.directions.standingDown]  = new Sprite([{x:ghost_x*24,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                        {x:ghost_x*25,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                        {x:ghost_x*26,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
                                                        {x:ghost_x*27,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                        {x:ghost_x*28,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                        {x:ghost_x*29,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},
                                                        {x:ghost_x*30,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa}, 
                                                        {x:ghost_x*31,y:ghost_y*1,w:ghost_w,h:ghost_h,d:sPa},

                                                    ]);








    }
}