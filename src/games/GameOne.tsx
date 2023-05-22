
import { useEffect, useRef, useState,  useContext } from "react"
import  { useSearchParams, useNavigate} from "react-router-dom";
import {w3cwebsocket as W3CWebsocket} from "websocket"; // npm install websocket THEN npm i @types/websocket
import MyContext from "../ProviderComp";
import Character from "./Character";

import tilespics from "../images/tileset.png"



import campingPics  from "../images/gTiles/camping.png" // 3= 32

import cityPropsPics  from "../images/gTiles/cityProps.png" // 3= 32

import cityTerrainsPics  from "../images/gTiles/cityTerrains.png" // 3= 32

import interiorsPics from "../images/gTiles/interiors.png"
import officePics from "../images/gTiles/office.png"
import floorsPics from "../images/gTiles/floors.png"


import condoPics  from "../images/gTiles/condo.png" // 3= 32
import gymePics  from "../images/gTiles/gyme.png" // 3= 32

import terrainsPics  from "../images/gTiles/terrains.png" // 3= 32

import noir from "../images/gTiles/noir.png"
import red from "../images/gTiles/red.png"

import NpcApics from "../images/npcA.png"
import coinsSetPics from "../images/money.png"


import lockImage from "../images/lock.png"


import arrowUp from "../images/arrowUp.png"
import arrowDown from "../images/arrowDown.png"
import arrowLeft from "../images/arrowLeft.png"
import arrowRight from "../images/arrowRight.png"

import Enemy from "./Enemy";
import enemyPics from "../images/enemyX.png" // 5 is full opaque


// import cat from "../images/quests/cat.png"
import IMAGES from "../components/ComComp/ImageImport";

import NpcBpics from "../images/npcB.png"
import NpcCpics from "../images/npcC.png"

import NpcPpics from "../images/police.png"





import gs from "../data/GameSpecs";
import { uis } from "../data/UiSpecs";
import TileMap from "./TileMap";
import MapObject from "./MapObject";
import PlacedItemStack from "./PlacedItemStack";
import Sprite from "./Sprite";
import { time } from "console";
import DialogueBox from "./DialogueBox";
import VidCom from "../components/ComComp/VidCom";
import AnswerBox from "./AnswerBox";


import ActionTree from "./ActionTree";
import { Document } from "postcss";

import { v4 as uuidv4 } from 'uuid';

// import importImages from "../components/ComComp/ImageImport";


interface LastKeysUp{[key:string]:number}
interface Chars{[key:string]:Character}
// interface CanvasRenderingContext2D {
//     drawImage(image: HTMLImageElement, x: number, y: number, width?: number, height?: number,
//               dx?: number, dy?: number, dWidth?: number, dHeight?: number): void;
// }

interface Ans {
      ans:{[key:number]:{0: string; 1: boolean; 2: () => void }}};

interface InvIMg{[key:string]:any}



  
  
export default function GameOne(){
    const navigate = useNavigate()
    const context =  useContext(MyContext)
    var room_name = 1
    const privateRoomClient =  new W3CWebsocket(`${context.restWs}/ws/quickstart/${room_name}/`)
    // const enemyRoomClient =  new W3CWebsocket(`${context.restWs}/ws/quickstart/${room_name}/`)

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasDref= useRef<HTMLCanvasElement>(null);
    const canvasIref= useRef<HTMLCanvasElement>(null);

    const [ans, setAns] = useState<{}[]>([]);
    // const locker = useRef(false)
    const showIbox = useRef(false)

    const iBoxPagination = useRef(0)

    const [visibilityState, setVisibilityState] = useState("visible")

    // const numPadMode  = useRef("alphabetic")
    // const numPadMode  = useRef("numerical")
    //   "alphabetic"   "numerical"
    const [searchParams, setSearchParams] = useSearchParams();
    
  
    var imagesList:InvIMg ={}
    var codeEntered:string = ""

    const ctlGhostOpacity = useRef(1)

   


  



    // tileset stores the image
    var lockPng:any, missionImgLoaded = false, lockPngLoaded=false


    var arrowUpPng:any, arrowUpPngLoaded = false
    var arrowDownPng:any, arrowDownPngLoaded = false
    var arrowLeftPng:any, arrowLeftPngLoaded = false
    var arrowRightPng:any, arrowRightPngLoaded = false


    var catImg:any , catImgMissionLoaded = false  
    var coinsSet:any ,coinsSetURL = coinsSetPics , coinsSetLoaded = false  
    var tilesetEnemy:any, tilesetURLEnemy = enemyPics, tilesetLoadedEnemy = false ;
   
    
    var terrainsSet:any = null, terrainsSetURL = terrainsPics  , terrainsSetLoaded = false 

   

    var interiorsPicsSet:any = null, interiorsPicsSetURL = interiorsPics  , interiorsPicsSetLoaded = false 
    var officePicsSet:any = null, officePicsSetURL = officePics , officePicsSetLoaded = false 
    var floorsPicsSet:any = null, floorsPicsSetURL = floorsPics , floorsPicsSetLoaded = false 



    var campingSet:any = null, campingSetURL = campingPics  , campingSetLoaded = false
    
    var cityPropsSet:any = null, cityPropsSetURL = cityPropsPics  , cityPropsSetLoaded = false 

    var cityTerrainsSet:any = null, cityTerrainsSetURL = cityTerrainsPics  , cityTerrainsSetLoaded = false 


    var condoSet:any = null, condoSetURL = condoPics  , condoSetLoaded = false 
    var gymeSet:any = null, gymeSetURL = gymePics , gymeSetLoaded = false 

    var noirSet:any = null, noirSetURL = noir , noirSetLoaded = false 




    var tileset:any = null, tilesetURL = tilespics , tilesetLoaded = false , lastFrameTime = 0;

    var tilesetNpcA:any, tilesetURLNpcA = NpcApics , tilesetLoadedNpcA = false ;
    var tilesetNpcB:any, tilesetURLNpcB = NpcBpics , tilesetLoadedNpcB = false 
    var tilesetNpcC:any, tilesetURLNpcC = NpcCpics , tilesetLoadedNpcC = false 
    var tilesetNpcP:any, tilesetURLNpcP = NpcPpics , tilesetLoadedNpcP = false 
    //#11
    // TileMap will be the class for managing and drawing out map so below #10 will be put there
    var mapTileData = new TileMap();

    //#10  // move in #11 to Tilemap
    var tileEvents = {
        23 : drawBridge,
        25 : drawBridge,
        121 : function(c:Character) { c.placeAt(1,8); },
        161 : function(c:Character) { c.placeAt(1,6); }
    };
    function drawBridge()
    {
        gs.maper[toIndex(4,5)] = (gs.maper[toIndex(4,5)]==4 ? 2 : 4);
    }
    

    //#9 // gameSpeeds is in gs now
    var gameTime = 0;
    var currentSpeed = 0
   
   //#13

    var coin = new Sprite([
        {x:0,y:0,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:16,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:32,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:48,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:64,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:80,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:96,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:112,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:128,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:144,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:160,w:16,h:16,d:200, start:0, end:0},
        {x:0,y:176,w:16,h:16,d:200, start:0, end:0},
    ])



    

    // TS2
    var arrowType:any={}
    

      // tyleTypes is cutting the tiles image

      // sur Master on a l'id / on peut retrouver x et y a partir de l'id. h et w c'est 48
      // combien de loop ? pour autant de la longeur du map
      // type = layers type
      //loop tous les layers et si !=0 ajouter tyle 
      // comment faire pour un rock qui est sol mais aussi transparent sur les bords 
      // il faut poser grass et rock
      // rock est layer +
      // il faut dessiner layer par layer id / id

    //   chars["player"].missionsObjList.find(x => x.id === 'cat')

        var tileTypes: any ={

        }

        // var baseLayer = gs.layers.find(x=> x.id ===1)

      
        // {
        //     "firstgid":1,
        //     "source":"terrains.tsx"
        //    }, 
        //    {
        //     "firstgid":1377,
        //     "source":"Interiors.tsx"
        //    }, 
        //    {
        //     "firstgid":18401,
        //     "source":"cityProps.tsx"
        //    }, 
        //    {
        //     "firstgid":21121,
        //     "source":"pink.tsx"
        //    }, 
        //    {
        //     "firstgid":21122,
        //     "source":"noir.tsx"
        //    }, 
        //    {
        //     "firstgid":21131,
        //     "source":"lasers.tsx"

        var tilesetsGid =[
            //     {
            //     "firstgid":1,
            //     "source":"noir",
            //     "x":48,
            //     "y":48
            //    }, 
            //    {
            //     "firstgid":1377,
            //     "source":"cityTerrains",
            //     "x":944,
            //     "y":1088
            //    }, 
               {
                 "firstgid":1,
                 "source":"terrains",
                 "x":512,
                 "y":688
                }, 
               
            //     {
            //     "firstgid":5389,
            //     "source":"camping",
            //     "x":512,
            //      "y":2704

            //     }, 
                {
                "firstgid":18401,
                "source":"cityProps",
                "x":512,
                "y":1360
                }, 
                {
                "firstgid":1377,
                "source":"interiors",
                "x":256,
                "y":17024
                }, 
            //     {
            //     "firstgid":38829,
            //     "source":"office",
            //     "x":256,
            //     "y":848
            //     }, 
            //     {
            //     "firstgid":30541,
            //     "source":"floors",
            //     "x":512,
            //     "y":4144
            //     }, 
    
                {
                "firstgid":21131,
                "source":"lasers",
                "x":50,
                "y":50
                }

                 
        //     {
        //  "firstgid":1,
        //  "source":"noir"
        // }, 
        // {
        //  "firstgid":10,
        //  "source":"terrains"
        // }, 
        // {
        //  "firstgid":1386,
        //  "source":"red"
        // }
            
        ]



       for(var lx=0; lx< gs.layers.length; lx++){
            
            let layer = gs.layers?.find(x=> x.id ===lx+1)
            
            if(layer?.data!== undefined ){

                for(var iz=0; iz< layer?.data.length; iz++){
                    
                    var setUsed = layer?.set
                    var levelOn = layer?.level
                    var firstGid = tilesetsGid.find(x=>x.source === setUsed)
                    var hide = layer?.hide

                    
                    var tileInd =  layer?.data[iz]===0?  0:  layer?.data[iz]- (firstGid?.firstgid===undefined?0:firstGid?.firstgid);
                    
                    var posx= [0,0]
                    
                    if(firstGid!==undefined){
                        // ! x tiles (cols) of the tileSET IMAGE
                        posx = [tileInd % (firstGid.x/16), Math.floor(tileInd/(firstGid.x/16))]
    
                        // console.log("----->>>",posx, " ", tileInd," ",setUsed  )
                    }

                    // modulo the n tile x and y of the tileSet IMAGE
                    if(tileTypes[layer.name] ===undefined){
                        tileTypes[layer.name] = {}
                    }
                    
                    tileTypes[layer.name][iz]={
                        tileInd:tileInd,
                        set:setUsed ,
                        level: levelOn,
                        hide: hide,
                        sprite:new Sprite([{x:16* posx[0],y:16*posx[1],w:16,h:16, start:0, end:0}])}


                }
            }
        
       }
 
    //An index signature is a way to specify the types of properties that can be accessed using an index. 
    const keysDown: { [key: number]: boolean } = {
        37: false,
        38: false,
        39: false,
        40: false,
        84: false,
        65: false, 
        82: false,
        73: false,
    }
    // last direction=> trigger the standing animation
    const  enemyNumber = useRef(3)

    var lastKeysUp:LastKeysUp={
        player:37,
        npcExplorer:37,
        npcC:37,
        npcP:40
    }

    for(let it=0; it<enemyNumber.current;it++){
        lastKeysUp["enemy"+it]=37
    }


    var viewport = {
        screen		: [0,0],
        startTile	: [0,0],
        endTile		: [0,0],
        offset		: [0,0],
        update		: function(px:number, py:number) {
            this.offset[0] = Math.floor((this.screen[0]/2) - px);
            this.offset[1] = Math.floor((this.screen[1]/2) - py);
    
            var tile = [ Math.floor(px/gs.tileSize), Math.floor(py/gs.tileSize) ];
    
            this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / gs.tileSize);
            this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / gs.tileSize);
    
            if(this.startTile[0] < 0){ 
                this.startTile[0] = 0; 
            }
            if(this.startTile[1] < 0){ 
                this.startTile[1] = 0; 
            }
    
            this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / gs.tileSize);
            this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / gs.tileSize);
    
            if(this.endTile[0] >= gs.nTileW){ 
                this.endTile[0] = gs.nTileW-1; 
            }
            if(this.endTile[1] >= gs.nTileH){ 
                this.endTile[1] = gs.nTileH-1; 
            }
        }
    };

    // function toIndex(x:number,y:number){
    //     return ((y*gs.nTileW)+x)
    // }
  
    //CHARS INIT
    // hard coded charId   
    const autoPosOn =(arr:number[], val:number)=>{
        var indexes = [], i = -1;
        while ((i = arr.indexOf(val, i+1)) !== -1){
            indexes.push(i);
        }
       
        //pidck rand ind the indtoPoss
        var posArray = []
        for(let x=0;x<enemyNumber.current;x++){
            var randomPlaceId = indexes[Math.floor(Math.random() * indexes.length)];
            posArray.push( [randomPlaceId%gs.nTileW, Math.floor(randomPlaceId/gs.nTileW)])
            
        }
        return posArray
    }

    let params = searchParams.get("mode")
    var startPosPlayer = [9,20]
    var startPosNpcC = [10,15]
    var startPosNpcExplorer = [14,14]
    var startPosNpcP = [13,5]

    var pos = [[2, 14],[3, 17],[10, 18],[15, 17],[18, 1],[4, 4],[4, 6]]

    var chars:Chars={
        player:new Character(tileTypes, toIndex,  mapTileData, false,false, "player", params!=null?params:"NA", privateRoomClient, startPosPlayer, navigate), //privateRoomClient 
        npcExplorer :new Character(tileTypes, toIndex,  mapTileData, true,false, "npcExplorer", params!=null?params:"NA", privateRoomClient, startPosNpcExplorer, navigate ),      
        npcC:new Character(tileTypes, toIndex,  mapTileData, true,false, "npcC", params!=null?params:"NA" , privateRoomClient, startPosNpcC ,navigate),
        npcP:new Character(tileTypes, toIndex,  mapTileData, true,false, "npcP", params!=null?params:"NA" , privateRoomClient, startPosNpcP, navigate),

    }

    for(let en=0; en<enemyNumber.current; en++){
        chars[`enemy${en}`]= new Enemy(tileTypes, toIndex,  mapTileData, true, true,`enemy${en}`, params!=null?params:"NA", privateRoomClient, pos[en],navigate);
    }

    Object.keys(chars).forEach(key=>{
        chars[key].charsDial =chars
        // chars[key].myActionTree = new ActionTree(key,chars )
    })

    function toIndex(x:number,y:number){
        return ((y*gs.nTileW)+x)
    }

    // DRAW /////////////////////////////////////////////////////////////////////////////////////////////////////
    const drawGame =({ctx}:{ctx:CanvasRenderingContext2D}, {ctxD}:{ctxD:CanvasRenderingContext2D}, {ctxI}:{ctxI:CanvasRenderingContext2D})=>{
        if(!ctx) {return;}
        // if(visibilityRef.current ==="hidden"){return}
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        var currentFrameTime = Date.now()

        // console.log(chars["player"])
        if(Object.keys(chars["player"].txtForBtn).length !=0){

        }

        var timeElapsed = currentFrameTime - lastFrameTime;

        // #9 in game elapsed time 
        gameTime+= timeElapsed * gs.gameSpeeds[currentSpeed].mult;

        // the FPS should be here
        // #9 change currentFrmaTime to gameTime
      
      if(!chars.player.processMovement(gameTime,lastKeysUp, chars, ctxD, ctxI) && gs.gameSpeeds[currentSpeed].mult!=0){
        if(params==="ctlmode"){

            if(keysDown[38] && chars.player.canMoveUp()){ chars.player.moveUp(gameTime); }
            //down                   
            else if(keysDown[40] && chars.player.canMoveDown()){chars.player.moveDown(gameTime);}
            //left
            else if(keysDown[37] &&  chars.player.canMoveLeft()){ 
                

             
                chars.player.moveLeft(gameTime);
            }
            //right
            else if(keysDown[39] && chars.player.canMoveRight()){chars.player.moveRight(gameTime); }
            //pickUp obj
            else if(keysDown[80]){ 
                console.log("clickingpick?")
                chars.player.pickUp(); 
            }
        }
          // up  // if key down, moving in the game boudaries and on a PTMO tile, then move
         

      }

        // process movement but will autocheck first if ok for move
        // maybe make an array for a looped path
        
        var  npcMoveFreq = 1000
        if(!chars.npcExplorer.processMovement(gameTime,lastKeysUp, chars, ctxD, ctxI) && gs.gameSpeeds[currentSpeed].mult!=0){
            if(params==="ctlmode"){

                var randDir= Math.floor(Math.random()*npcMoveFreq)
                if(params==="ctlmode"){
                        switch(true){
                            case randDir===1:
                                if(chars.npcExplorer.canMoveUp()){ 
                                        chars.npcExplorer.moveUp(gameTime);
                                        lastKeysUp.npcExplorer= 38
                                }
                                break;
                            case randDir===2:
                                if(chars.npcExplorer.canMoveDown()){
                                    chars.npcExplorer.moveDown(gameTime)
                                    lastKeysUp.npcExplorer= 40 
                                };
                                break;
                            case randDir===3:
                                if(chars.npcExplorer.canMoveLeft()){
                                        chars.npcExplorer.moveLeft(gameTime);
                                        lastKeysUp.npcExplorer= 37
                                    }
                                break;
                            case randDir===4:
                                if(chars.npcExplorer.canMoveRight()){
                                        chars.npcExplorer.moveRight(gameTime);
                                        lastKeysUp.npcExplorer= 39
                                }
                                break;
                            default:

                                // console.log("")
                                // if(npcA.canMoveRight()){npcA.moveRight(gameTime); }
                
            
                    }
                }

            }


     
        }



        if(!chars.npcC.processMovement(gameTime,lastKeysUp, chars, ctxD, ctxI) && gs.gameSpeeds[currentSpeed].mult!=0){
            if(params==="ctlmode"){

                var randDir= Math.floor(Math.random()*npcMoveFreq)
                    if(params==="ctlmode"){
                            switch(true){
                                case randDir===1:
                                    if(chars.npcC.canMoveUp()){ 
                                            chars.npcC.moveUp(gameTime);        
                                            lastKeysUp.npcC= 38
                                    }
                                    break;
                                case randDir===2:
                                    if(chars.npcC.canMoveDown()){
                                            chars.npcC.moveDown(gameTime)
                                            lastKeysUp.npcC= 40 
                                        };
                
                                    break;
                                case randDir===3:
                                    if(chars.npcC.canMoveLeft()){ 
                                            chars.npcC.moveLeft(gameTime);
                                            lastKeysUp.npcC= 37
                
                                        }
                                    break;
                                case randDir===4:
                                    if(chars.npcC.canMoveRight()){
                                            chars.npcC.moveRight(gameTime);
                                            lastKeysUp.npcC= 39
                
                                    }
                                    break;
                                default:
                                    // console.log("")
                                    // if(npcA.canMoveRight()){npcA.moveRight(gameTime); }
                    
            
                        }
                    }

            }
     
        }

        //NPC P moves

        if(!chars.npcP.processMovement(gameTime,lastKeysUp, chars, ctxD, ctxI) && gs.gameSpeeds[currentSpeed].mult!=0){
            if(params==="ctlmode"){

                var randDir= Math.floor(Math.random()*npcMoveFreq)
                    // if(params==="ctlmode"){
                    //         switch(true){
                    //             case randDir===1:
                    //                 if(chars.npcP.canMoveUp()){ 
                    //                         chars.npcP.moveUp(gameTime);        
                    //                         lastKeysUp.npcP= 38
                    //                 }
                    //                 break;
                    //             case randDir===2:
                    //                 if(chars.npcP.canMoveDown()){
                    //                         chars.npcP.moveDown(gameTime)
                    //                         lastKeysUp.npcP= 40 
                    //                     };
                
                    //                 break;
                    //             case randDir===3:
                    //                 if(chars.npcP.canMoveLeft()){ 
                    //                         chars.npcP.moveLeft(gameTime);
                    //                         lastKeysUp.npcP= 37
                
                    //                     }
                    //                 break;
                    //             case randDir===4:
                    //                 if(chars.npcP.canMoveRight()){
                    //                         chars.npcP.moveRight(gameTime);
                    //                         lastKeysUp.npcP= 39
                
                    //                 }
                    //                 break;
                    //             default:
                    //                 // console.log("")
                    //                 // if(npcA.canMoveRight()){npcA.moveRight(gameTime); }
                    
            
                    //     }
                    // }

            }
     
        }


        for(const key in chars){
            if(chars[key].isEnemy===true && !chars[key].processMovement(gameTime,lastKeysUp, chars, ctxD, ctxI) && gs.gameSpeeds[currentSpeed].mult!=0){
                if(params==="ctlmode"){
                    var randDir= Math.floor(Math.random()*npcMoveFreq)
                        if(params==="ctlmode"){
                                switch(true){
                                    case randDir===1:
                                        if(chars[key].canMoveUp()){ 
                                            chars[key].moveUp(gameTime);        
                                            lastKeysUp[chars[key].charName]= 38
                                        }
                                        break;
                                    case randDir===2:
                                        if(chars[key].canMoveDown()){
                                            chars[key].moveDown(gameTime)
                                            lastKeysUp[chars[key].charName]= 40 
                                            };
                    
                                        break;
                                    case randDir===3:
                                        if(chars[key].canMoveLeft()){ 
                                            chars[key].moveLeft(gameTime);
                                            lastKeysUp[chars[key].charName]= 37
                    
                                            }
                                        break;
                                    case randDir===4:
                                        if(chars[key].canMoveRight()){
                                            chars[key].moveRight(gameTime);
                                            lastKeysUp[chars[key].charName]= 39
                                        }
                                        break;
                                    default:
                                        // console.log("")
                                        // if(npcA.canMoveRight()){npcA.moveRight(gameTime); }
                        
                            }
                        }
                }
         
            }
    

        }


        // if(!chars.enemyOne.processMovement(gameTime,lastKeysUp, chars, ctxD, ctxI) && gs.gameSpeeds[currentSpeed].mult!=0){
        //     if(params==="ctlmode"){


        //         var randDir= Math.floor(Math.random()*npcMoveFreq/2)
        //             if(params==="ctlmode"){
        //                     switch(true){
        //                         case randDir===1:
        //                             if(chars.enemyOne.canMoveUp()){ 
        //                                 chars.enemyOne.moveUp(gameTime);        
        //                                 lastKeysUp.enemyOne= 38
        //                             }
        //                             break;
        //                         case randDir===2:
        //                             if(chars.enemyOne.canMoveDown()){
        //                                 chars.enemyOne.moveDown(gameTime)
        //                                 lastKeysUp.enemyOne= 40 
        //                                 };
                
        //                             break;
        //                         case randDir===3:
        //                             if(chars.enemyOne.canMoveLeft()){ 
        //                                 chars.enemyOne.moveLeft(gameTime);
        //                                 lastKeysUp.enemyOne= 37
                
        //                                 }
        //                             break;
        //                         case randDir===4:
        //                             if(chars.enemyOne.canMoveRight()){
        //                                 chars.enemyOne.moveRight(gameTime);
        //                                 lastKeysUp.enemyOne= 39
        //                             }
        //                             break;
        //                         default:
        //                             // console.log("")
        //                             // if(npcA.canMoveRight()){npcA.moveRight(gameTime); }
                    
            
        //                 }
        //             }
        //     }
     
        // }

    
        viewport.update(chars.player.position[0] + (chars.player.dimension[0]/2),
		                chars.player.position[1] + (chars.player.dimension[1]/2));

        // viewport.update(chars.npcExplorer.position[0] + (chars.npcExplorer.dimension[0]/2),
		// chars.npcExplorer.position[1] + (chars.npcExplorer.dimension[1]/2));

        //#11
        // find the roof covering the tile and the tile the player is currently moving to 
        var playerRoof1 = mapTileData.map[toIndex(
            chars.player.tileFrom[0], chars.player.tileFrom[1])].roof;
        var playerRoof2 = mapTileData.map[toIndex(
            chars.player.tileTo[0], chars.player.tileTo[1])].roof;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);


        //#12
        // zlayers
        for(var z = 0; z < mapTileData.levels; z++){

            for(var i= viewport.startTile[0]; i<= viewport.endTile[0] ; i++){
                for(var j= viewport.startTile[1]; j<= viewport.endTile[1]; j++){

                   

                    if(z==0){ 

                        
                        let keysTilesType = Object.keys(tileTypes)
                        let tilesSetUsed = undefined
                        for(let objs=0; objs<keysTilesType.length; objs++){
                            let key =[keysTilesType[objs]][0]
                            if(key==="limits"){
                                if(tileTypes[key][toIndex(i,j)].tileInd!==0){
                                    mapTileData.map[toIndex(i,j)].walkable=false

                                }
                            }else if( tileTypes[key][toIndex(i,j)].tileInd!==0 && tileTypes[key][toIndex(i,j)].level ===0 && mapTileData.map[toIndex(i,j)].isVisible===true){
                                //!! wil not draw tiles id 0 !!! change on 
                                switch(tileTypes[key][toIndex(i,j)].set){
                                    case "cityTerrains":
                                        
                                        tilesSetUsed = cityTerrainsSet;
                                    break;
                                    case "noir":
                                        // console.log()
                                        tilesSetUsed =noirSet;
                                    break;
                                    case "terrains":
                                        // console.log()
                                        tilesSetUsed =terrainsSet;
                                    break;
                                    case "camping":
                                        tilesSetUsed = campingSet;
                                    break;
                                    case "cityProps":
                                        tilesSetUsed = cityPropsSet;
                                    break;
                                    case "condo":
                                        tilesSetUsed = condoSet;
                                    break;
                                    case "gyme":
                                        tilesSetUsed = gymeSet;
                                    break;
                                    case "interiors":
                                        tilesSetUsed = interiorsPicsSet;
                                    break;
                                    case "office":
                                        tilesSetUsed = officePicsSet;
                                    break;
                                    case "floors":
                                        tilesSetUsed =  floorsPicsSet;
                                    break;
                                    default:
                                        // console.log("terrain error")

                                }
                                
                                
                        
                       


                                //
                                tileTypes[key][toIndex(i,j)].sprite.opacity  = mapTileData.map[toIndex(i,j)].visibleOpacity
                                
                              
                                tileTypes[key][toIndex(i,j)].sprite.draw(
                                    gameTime,
                                    viewport.offset[0] + (i*gs.tileSize),
                                    viewport.offset[1] + (j*gs.tileSize),
                                    ctx,
                                    tilesSetUsed 
                                );

                                if(params==="ctlmode" && tileTypes[key][toIndex(i,j)].hide===true){
                                    tileTypes[key][toIndex(i,j)].sprite.opacity =0
                                }


            
                                // ctx.fillText(`Game speed ${currentSpeed}: ${gs.gameSpeeds[currentSpeed].name}, gameTime:${gameTime}`, 200, 500);
                                

                            }

                        }

                        // tileTypes[toIndex(i,j)].sprite.draw(
                        //     gameTime,
                        //     viewport.offset[0] + (i*gs.tileSize),
                        //     viewport.offset[1] + (j*gs.tileSize),
                        //     ctx,
                        //     terrainsSet
                        // );

                        // tileTypes2[toIndex(i,j)].sprite.draw(
                        //     gameTime,
                        //     viewport.offset[0] + (i*gs.tileSize),
                        //     viewport.offset[1] + (j*gs.tileSize),
                        //     ctx,
                        //     terrainsSet
                        // );


                    
                    }

                    else if(z==1){
                        // stars
                        // #13 drawing the stacks 
                        // console.log("------------",mapTileData.map[toIndex(i,j)].type)
                        // tileTypes[key][toIndex(i,j)].sprite.opacity  = mapTileData.map[toIndex(i,j)].visibleOpacity
                        var is = mapTileData.map[toIndex(i,j)].itemStack;
                       
                        if(is!=null){
                            var is = mapTileData.map[toIndex(i,j)].itemStack;
                           

                            if(is!=null){
                                gs.itemTypes[is.type].sprite.draw(
                                    gameTime,
                                    viewport.offset[0] + (i*gs.tileSize) + gs.itemTypes[is.type].offset[0],
                                    viewport.offset[1] + (j*gs.tileSize) + gs.itemTypes[is.type].offset[1],
                                    ctx,
                                    tileset
                                );

                            }
                            mapTileData.map[toIndex(i,j)].visibleOpacity =0
                          
                        }

                    }

                    //#12 placing objects on the map
                    var o = mapTileData.map[toIndex(i,j)].object;
                    if(o!=null && gs.objectTypes[o.type].zIndex==z){

                        var ot = gs.objectTypes[o.type];

                        ot.sprite.draw(gameTime,
                            viewport.offset[0] + (i*gs.tileSize) + ot.offset[0],
                            viewport.offset[1] + (j*gs.tileSize) + ot.offset[1],
                            ctx,
                            tileset
                        );
                        
                    }
                    // #11 roofs draws the roof at level 2
                    if(z==2
                        // && mapTileData.map[toIndex(i,j)].roofType!=0 &&
                        // mapTileData.map[toIndex(i,j)].roof !=playerRoof1 &&
                        // mapTileData.map[toIndex(i,j)].roof !=playerRoof2
                        ){
                    

                            let keysTilesType = Object.keys(tileTypes)
                            let tilesSetUsed = undefined
                            for(let objs=0; objs<keysTilesType.length; objs++){

                                let key =[keysTilesType[objs]][0]

                                if(tileTypes[key][toIndex(i,j)].level ===2){
                                    switch(tileTypes[key][toIndex(i,j)].set){
                                        case "noir":
                                        // console.log()
                                        tilesSetUsed =noirSet;
                                        break;
                                        case "terrains":
                                            // console.log()
                                            tilesSetUsed =terrainsSet;
                                        break;
                                        case "camping":
                                            tilesSetUsed = campingSet;
                                        break;
                                        case "cityProps":
                                            tilesSetUsed = cityPropsSet;
                                        break;
                                        case "cityTerrains":
                                            tilesSetUsed = cityTerrainsSet;
                                        break;
                                        case "condo":
                                            tilesSetUsed = condoSet;
                                        break;
                                        case "gyme":
                                            tilesSetUsed = gymeSet;
                                        break;
                                        case "interiors":
                                            tilesSetUsed = interiorsPicsSet;
                                        break;
                                        case "office":
                                            tilesSetUsed = officePicsSet;
                                        break;
                                        case "floors":
                                            tilesSetUsed =  floorsPicsSet;
                                        break;
                                        default:
                                            tilesSetUsed = terrainsSet
    
                                    }
                                    if(tileTypes[key][toIndex(i,j)].tileInd!==0){
                                        tileTypes[key][toIndex(i,j)].sprite.opacity  = mapTileData.map[toIndex(i,j)].visibleOpacity
                                
                                        tileTypes[key][toIndex(i,j)].sprite.draw(
                                            gameTime,
                                            viewport.offset[0] + (i*gs.tileSize),
                                            viewport.offset[1] + (j*gs.tileSize),
                                            ctx,
                                            tilesSetUsed 
                                        );
                                    }
                                }
    
                            }












                        // tileTypes[mapTileData.map[toIndex(i,j)].roofType].sprite.draw(
                        //     gameTime,
                        //     viewport.offset[0] + (i*gs.tileSize),
                        //     viewport.offset[1] + (j*gs.tileSize),
                        //     ctx,
                        //     tileset
                        // );


                    }
                   
                lastFrameTime = currentFrameTime;
            }
        }

        //#12 include the char in z
       
        if(z==1){
            //DRAW PLAYER 
        


            // dialBox.isOnDial(gameTime,chars.player.startInteraction, ctxD)
            
            chars.player.sprites[chars.player.direction].draw(
				gameTime,
				viewport.offset[0] + chars.player.position[0],
				viewport.offset[1] + chars.player.position[1],
                ctx,
                tilesetNpcA,
                )

            if(chars.player.isSurprised===true && params==="viewmode"){
                ctx.fillStyle = 'red';
                ctx.strokeStyle = 'green';
                ctx.font = "30px Arial";
                ctx.fillText("!",viewport.offset[0] + chars.player.position[0]+ chars.player.spriteW/2+1  ,viewport.offset[1] + chars.player.position[1]-5,)
                ctx.strokeText("!",viewport.offset[0] + chars.player.position[0]+ chars.player.spriteW/2+1  ,viewport.offset[1] + chars.player.position[1]-5);
                ctx.fill()
                ctx.stroke()
            }

            // ENEMY DRAW
            for(let key in chars){
                // console.log(`${chars[key].charName} enemy> ${chars[key].isEnemy}`)
                if(chars[key].isEnemy ===true){
                    // chars[key].sprites[chars[key].direction].opacity  = mapTileData.map[toIndex(chars[key].tileFrom[0],chars[key].tileFrom[1])].visibleOpacity
                    chars[key].sprites[chars[key].direction].draw(
                        gameTime,
                        viewport.offset[0] + chars[key].position[0]-5,
                        viewport.offset[1] + chars[key].position[1],
                        ctx,
                        tilesetEnemy , // jsut for the test
                        )
                        

                        if(mapTileData.map[toIndex(chars[key].tileFrom[0],chars[key].tileFrom[1])].isVisible===true){
                            // chars[key].sprites[chars[key].direction].opacity = mapTileData.map[toIndex(chars[key].tileFrom[0],chars[key].tileFrom[1])].visibleOpacity

                            // chars[key].sprites[chars[key].direction].opacity = mapTileData.map[toIndex(chars[key].tileFrom[0],chars[key].tileFrom[1])].visibleOpacity
                        }
                        // chars[key].sprites[chars[key].direction].opacity  =  mapTileData.map[toIndex(chars[key].tileFrom[0],chars[key].tileFrom[1])].visibleOpacity
                        // chars[key].sprites[chars[key].direction].opacity = mapTileData.map[toIndex(chars[key].tileTo[0],chars[key].tileTo[1])].visibleOpacity
                        
                      


                        if(params==="ctlmode"){
                            chars[key].sprites[chars[key].direction].opacity = ctlGhostOpacity.current
                            if(ctlGhostOpacity.current -0.001>0){
                                ctlGhostOpacity.current -= 0.0001
            
                            }
                        }
                }

            }
     

            //NPC 1 DRAW
            chars.npcExplorer.sprites[chars.npcExplorer.direction].opacity  = mapTileData.map[toIndex(chars.npcExplorer.tileFrom[0],chars.npcExplorer.tileFrom[1])].visibleOpacity

            chars.npcExplorer.sprites[chars.npcExplorer.direction].draw(
                gameTime,
                viewport.offset[0] + chars.npcExplorer.position[0],
                viewport.offset[1] + chars.npcExplorer.position[1],
                ctx,
                tilesetNpcB, // jsut for the test
                )
            // MOOD BAR /////////////////////////////////
            ctx.fillStyle = "red";
             
            ctx.beginPath();
            ctx.roundRect(viewport.offset[0] + chars.npcExplorer.position[0]+3,
                viewport.offset[1] + chars.npcExplorer.position[1]-4,
                21, 4, 10);
            ctx.fill()
            ctx.stroke();
             //---
            ctx.strokeStyle  = "black";
            ctx.fillStyle = "green";
             
            ctx.beginPath();
            ctx.roundRect(viewport.offset[0] + chars.npcExplorer.position[0]+3,
                viewport.offset[1] + chars.npcExplorer.position[1]-4,chars.npcExplorer.mood, 4, 10);
            ctx.fill()  
            ctx.stroke();

            //NPC P
            chars.npcP.sprites[chars.npcP.direction].opacity  = mapTileData.map[toIndex(chars.npcP.tileFrom[0],chars.npcP.tileFrom[1])].visibleOpacity

            chars.npcP.sprites[chars.npcP.direction].draw(
                gameTime,
                viewport.offset[0] + chars.npcP.position[0],
                viewport.offset[1] + chars.npcP.position[1],
                ctx,
                tilesetNpcP, // jsut for the test
                )
                     // MOOD BAR /////////////////////////////////
                     ctx.fillStyle = "red";
             
                     ctx.beginPath();
                     ctx.roundRect(viewport.offset[0] + chars.npcP.position[0]+3,
                         viewport.offset[1] + chars.npcP.position[1]-4,
                         21, 4, 10);
                     ctx.fill()
                     ctx.stroke();
                      //---
                     ctx.strokeStyle  = "black";
                     ctx.fillStyle = "green";
                      
                     ctx.beginPath();
                     ctx.roundRect(viewport.offset[0] + chars.npcP.position[0]+3,
                         viewport.offset[1] + chars.npcP.position[1]-4,chars.npcP.mood, 4, 10);
                     ctx.fill()  
                     ctx.stroke();
            
            //NPC 2 DRAW
            chars.npcC.sprites[chars.npcC.direction].opacity  = mapTileData.map[toIndex(chars.npcC.tileFrom[0],chars.npcC.tileFrom[1])].visibleOpacity

            chars.npcC.sprites[chars.npcC.direction].draw(
                gameTime,
                viewport.offset[0] + chars.npcC.position[0],
                viewport.offset[1] + chars.npcC.position[1],
                ctx,
                tilesetNpcC, // jsut for the test
                )
            // MOOD BAR /////////////////////////////////
            ctx.fillStyle = "red";
            
            ctx.beginPath();
            ctx.roundRect(viewport.offset[0] + chars.npcC.position[0]+3,
                viewport.offset[1] + chars.npcC.position[1]-4,
                21, 4, 10);
            ctx.fill()
            ctx.stroke();
            //---
            ctx.strokeStyle  = "black";
            ctx.fillStyle = "green";
            
            ctx.beginPath();
            ctx.roundRect(viewport.offset[0] + chars.npcC.position[0]+3,
                        viewport.offset[1] + chars.npcC.position[1]-4,chars.npcC.mood, 4, 10);
            ctx.fill()
            ctx.stroke();
        

            }

        }  // closing the z loop 

        ctx.textAlign = "right";
        
        // direction arrows
        // ctx.fillStyle = "#ddccaa";
        ctx.fillStyle = "#ddccaa";


        // UI DRAWING AND DIALOGUE BOX
      
        //INFO PLAY 

        ctx.fillStyle = "#86eea6";
        var pts_h = 65
        var pts_w = 174
        ctx.fillRect(window.innerWidth/2-pts_w/2,0,pts_w, pts_h);

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`${chars["player"].coins}`.toString(), window.innerWidth/2,50)

        coin.animated = chars["player"].animateCoin
        coin.draw(gameTime, 
            window.innerWidth/2-60,
            30,
            ctx,
            coinsSet
            )
     
       

        // LEFT SIDE BUTTONS ///////////////////////////////////////////////////////////////////////////////////
       


        //TALK BTN
        // ctx.fillStyle = "#366e0a";
        // ctx.fillRect(uis.talkButton.x,uis.talkButton.y,uis.talkButton.w, uis.talkButton.h);

        // if(chars.player.wannaTalk===true){
        //     ctx.fillStyle = "#f0491c";
        //     ctx.fillRect(uis.talkButton.x,uis.talkButton.y,uis.talkButton.w, uis.talkButton.h);
        // }
        // if(chars["player"].playMode==="ctlmode"){
        //     ctx.fillStyle = "#ce2222";
        //     ctx.font = "20px Arial";
        //     ctx.fillText("A",uis.talkButton.x +uis.talkButton.w / 2 +8,uis.talkButton.y+uis.talkButton.h/2+8)
        // }else{
        //     ctx.drawImage(lockPng, uis.talkButton.x+14 ,uis.talkButton.y+5 ,32, 32)
        // }


        if(chars.player.wannaTalk===true){
            ctx.beginPath();
            ctx.fillStyle = "#696a6f";
            ctx.arc(uis.talkButton.x, uis.talkButton.y , 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.lineWidth = 3
            ctx.strokeStyle = "#242426"
            ctx.stroke(); 
            ctx.fillStyle = "#19c649";
            ctx.font = "20px Arial";
            ctx.fillText("A",uis.talkButton.x +uis.talkButton.w / 2 -8,uis.talkButton.y+uis.talkButton.h/2-8)
        }else{
            ctx.beginPath();
            ctx.fillStyle = "#434346";
            ctx.arc(uis.talkButton.x, uis.talkButton.y , 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.lineWidth = 2
            ctx.strokeStyle = "#242426"
            ctx.stroke(); 
            ctx.fillStyle = "#ce8222";

            if(chars["player"].playMode==="ctlmode"){
                ctx.fillStyle = "#e74c4c";
                ctx.font = "20px Arial";
                ctx.fillText("A",uis.talkButton.x +uis.talkButton.w / 2 -8,uis.talkButton.y+uis.talkButton.h/2-8)
            
            
            }else{


                ctx.drawImage(lockPng, uis.talkButton.x-16 ,uis.talkButton.y-17 ,32, 32)
            }
            

        }



       

        // INVENTORY BTN
        if(keysDown[73]===false){
            ctx.beginPath();
            ctx.fillStyle = "#696a6f";
            ctx.arc(uis.invButton.x, uis.invButton.y , 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.lineWidth = 3
            ctx.strokeStyle = "#242426"
            ctx.stroke(); 
            ctx.fillStyle = "#ce8222";
            ctx.font = "20px Arial";
            ctx.fillText("i",uis.invButton.x +uis.invButton.w / 2 -12  ,uis.invButton.y+uis.invButton.h/2-8)
        }else{
            ctx.beginPath();
            ctx.fillStyle = "#434346";
            ctx.arc(uis.invButton.x, uis.invButton.y , 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.lineWidth = 2
            ctx.strokeStyle = "#242426"
            ctx.stroke(); 
            ctx.fillStyle = "#ce8222";
            ctx.font = "20px Arial";
            ctx.fillText("i",uis.invButton.x +uis.invButton.w / 2-12  ,uis.invButton.y+uis.invButton.h/2-7)

        }
        ctx.lineWidth = 1


      
   
        if(chars["player"].playMode==="viewmode"){
            ctx.drawImage(lockPng,
                (uis.arrow.left.x+uis.arrow.right.x)/2 -16,
                (uis.arrow.up.y+uis.arrow.down.y)/2 -16 ,32, 32)
        }
        
       //DIRECTIONS ARROW BTN
        if(keysDown[38]===false){
            
            // ctx.fillRect(uis.arrow.up.x,uis.arrow.up.y,40, 40);

            ctx.beginPath();
            ctx.fillStyle = "#696a6f";
            ctx.arc(uis.arrow.up.x,uis.arrow.up.y, 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.lineWidth = 3
            ctx.strokeStyle = "#242426"
            ctx.stroke(); 
            
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            // ctx.fillText("△",uis.arrow.up.x+15, uis.arrow.up.y+10)
            ctx.drawImage(arrowUpPng,uis.arrow.up.x-12 ,uis.arrow.up.y-15 ,25, 25)
            

        }else{
            ctx.beginPath();
            ctx.fillStyle = "#434346";
            ctx.arc(uis.arrow.up.x,uis.arrow.up.y, 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.lineWidth = 2
            ctx.strokeStyle = "#242426"
            ctx.stroke(); 

            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.drawImage(arrowUpPng,uis.arrow.up.x-11 ,uis.arrow.up.y-15 ,25, 25)

            
        }
        ctx.lineWidth = 1
        if(keysDown[40]===false){
             ctx.beginPath();
             ctx.fillStyle = "#696a6f";
             ctx.arc(uis.arrow.down.x,uis.arrow.down.y, 20, 0, 2 * Math.PI);
             ctx.fill()
             ctx.lineWidth = 3
             ctx.strokeStyle = "#242426"
             ctx.stroke(); 
             ctx.fillStyle = "black";
             ctx.font = "30px Arial";
             ctx.drawImage(arrowDownPng,uis.arrow.down.x-13 ,uis.arrow.down.y-10 ,25, 25)
             
         }else{
             ctx.beginPath();
             ctx.fillStyle = "#434346";
             ctx.arc(uis.arrow.down.x,uis.arrow.down.y, 20, 0, 2 * Math.PI);
             ctx.fill()
             ctx.lineWidth = 2
             ctx.strokeStyle = "#242426"
             ctx.stroke(); 
             ctx.fillStyle = "black";
             ctx.font = "30px Arial";
             ctx.drawImage(arrowDownPng,uis.arrow.down.x-12 ,uis.arrow.down.y-10 ,25, 25)
         }


         ctx.lineWidth = 1
        if(keysDown[37]===false){
            // ctx.fillRect(uis.arrow.up.x,uis.arrow.up.y,40, 40);

            ctx.beginPath();
            ctx.fillStyle = "#696a6f";
            ctx.arc(uis.arrow.left.x,uis.arrow.left.y, 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.lineWidth = 3
            ctx.strokeStyle = "#242426"
            ctx.stroke(); 
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.drawImage(arrowLeftPng,uis.arrow.left.x-15 ,uis.arrow.left.y-13 ,25, 25)
            
        }else{
            ctx.beginPath();
            ctx.fillStyle = "#434346";
            ctx.arc(uis.arrow.left.x,uis.arrow.left.y, 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.lineWidth = 2
            ctx.strokeStyle = "#242426"
            ctx.stroke(); 
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.drawImage(arrowLeftPng,uis.arrow.left.x-14 ,uis.arrow.left.y-13 ,25, 25)
            
        }
        

        ctx.lineWidth = 1
        if(keysDown[39]===false){


            ctx.beginPath();
            ctx.fillStyle = "#696a6f";
            ctx.arc(uis.arrow.right.x,uis.arrow.right.y, 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.lineWidth = 3
            ctx.strokeStyle = "#242426"
            ctx.stroke(); 
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.drawImage(arrowRightPng,uis.arrow.right.x-10 ,uis.arrow.right.y-13 ,25, 25)
            
        }else{
            ctx.beginPath();
            ctx.fillStyle = "#434346";
            ctx.arc(uis.arrow.right.x,uis.arrow.right.y, 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.lineWidth = 2
            ctx.strokeStyle = "#242426"
            ctx.stroke(); 
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.drawImage(arrowRightPng,uis.arrow.right.x-9 ,uis.arrow.right.y-13 ,25, 25)
            
        }
        
        ctx.lineWidth = 1
        ctx.textAlign = "left";
      

        if(chars["player"].preventNumpad===false){

            // NUMPAD
            if(chars["player"].numPadMode  === "numerical"){
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[1].x, uis.numPad[1].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("1",uis.numPad[1].x +uis.numPad[1].w /4+5  ,uis.numPad[1].y+uis.numPad[1].h/2+8)
          
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[2].x, uis.numPad[2].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("2",uis.numPad[2].x +uis.numPad[2].w /4+5  ,uis.numPad[2].y+uis.numPad[2].h/2+8)
    
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[3].x, uis.numPad[3].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("3",uis.numPad[3].x +uis.numPad[3].w /4 +5 ,uis.numPad[3].y+uis.numPad[3].h/2+8)
    
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[4].x, uis.numPad[4].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("4",uis.numPad[4].x +uis.numPad[4].w /4+5  ,uis.numPad[4].y+uis.numPad[4].h/2+8)
    
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[5].x, uis.numPad[5].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("5",uis.numPad[5].x +uis.numPad[5].w /4+5  ,uis.numPad[5].y+uis.numPad[5].h/2+8)
            
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[6].x, uis.numPad[6].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("6",uis.numPad[6].x +uis.numPad[6].w /4 +5 ,uis.numPad[6].y+uis.numPad[6].h/2+8)
    
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[7].x, uis.numPad[7].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("7",uis.numPad[7].x +uis.numPad[7].w /4+5  ,uis.numPad[7].y+uis.numPad[7].h/2+8)
    
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[8].x, uis.numPad[8].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("8",uis.numPad[8].x +uis.numPad[8].w /4+5  ,uis.numPad[8].y+uis.numPad[8].h/2+8)
            
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[9].x, uis.numPad[9].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("9",uis.numPad[9].x +uis.numPad[9].w /4+5  ,uis.numPad[9].y+uis.numPad[9].h/2+8)
    
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[0].x, uis.numPad[0].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("0",uis.numPad[0].x +uis.numPad[0].w /4+5  ,uis.numPad[0].y+uis.numPad[0].h/2+8)
    
            ctx.fillStyle = "#fb01ff";
            ctx.fillRect(uis.numPad[11].x, uis.numPad[11].y,40, 40);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("ok",uis.numPad[11].x +uis.numPad[11].w /4  ,uis.numPad[11].y+uis.numPad[11].h/2+8)
            }
            //if alpha

            if(chars["player"].numPadMode === "alphabetic"){
                // need the mission ID wrangle letters into 11
                var giveBack = "fraise"
                // console.log(chars["player"].missionsObjList.find(x => x.id === 'cat'))
                var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                        var pad = obj?.pad
                        for(var n=0; n< pad.length+1; n++){
                            // console.log("#", n)
                            // console.log("##", pad[n])
                            // console.log("###", uis.numPad[n].x)
                            ctx.fillStyle = "#fb01ff";
                            ctx.fillRect(uis.numPad[n].x, uis.numPad[n].y,40, 40);
                            ctx.fillStyle = "black";
                            ctx.font = "20px Arial";
                            if(n===11){
                                ctx.fillText("ok",uis.numPad[n].x +uis.numPad[n].w /4  ,uis.numPad[n].y+uis.numPad[n].h/2+8)
                            }else{
                                ctx.fillText(pad[n],uis.numPad[n].x +uis.numPad[n].w /4 +2 ,uis.numPad[n].y+uis.numPad[n].h/2+7)
                            }

                        }  
            }




        }


        // if(numPadMode.current === "alphabetic"){
        //     // need the mission ID wrangle letters into 11
        //     var word = "cat"
            
        //     if(word.length<=11){
        //         let randLettersNeed = 11- word.length
        //         const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        //         let letters = [];
               
        //         for (let i = 0; i < randLettersNeed; i++) {
        //           const randomIndex = Math.floor(Math.random() * alphabet.length);
        //           letters.push(alphabet[randomIndex]);
        //         }
        //         letters.push(word.split(""))
        //         for(var n=0; n<letters.length; n++){

        //             if((xPos>=uis.numPad[n].x && xPos<=uis.numPad[n].x + uis.numPad[n].w) 
        //             && (yPos>=uis.numPad[n].y && yPos<=uis.numPad[n].y + uis.numPad[n].h)){
        //                 if(chars["player"].playMode==="ctlmode"){
        //                     console.log("pressed 11")
                            
        //                     chars[chars["player"].inTouchWith].myActionTree.codeValidation(parseInt(codeEntered))
        //                     chars["player"].dialBox.erase(ctxD)
        //                     wsPressA()
        //                     codeEntered = ""
        //                 }
        //             }

        //             }
        //         }

        //     }


         // iBox???
        if(showIbox.current === true && chars["player"].preventIbox=== false){

            ctx.fillStyle = "#9c9385";
             
            ctx.beginPath();
            ctx.roundRect(30, 80,377, 350, 10);
            ctx.fill()
            ctx.stroke();

            

            if(iBoxPagination.current===0){
                ctx.strokeStyle = "red"
            }else{
                ctx.strokeStyle = "black"
            }
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.roundRect(50, 100,100, 30, [10,10,0,0]);
                ctx.fill()
                ctx.stroke();


            if(iBoxPagination.current===1){
                ctx.strokeStyle = "red"
            }else{
                ctx.strokeStyle = "black"
            }
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.roundRect(150, 100,100, 30, [10,10,0,0]);
                ctx.fill()
                ctx.stroke();

            if(iBoxPagination.current===2){
                ctx.strokeStyle = "red"
            }else{
                ctx.strokeStyle = "black"
            }
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.roundRect(250, 100,100, 30, [10,10,0,0]);
                ctx.fill()
                ctx.stroke();
                ctx.strokeStyle = "black"

            
            
            ctx.fillStyle = "black";
            ctx.font ="11px Arial"
            ctx.fillText("missions",60, 115)
            ctx.fillText("en cours",60, 125)

            ctx.fillStyle = "black";
            ctx.font ="11px Arial"
            ctx.fillText("missions",160, 115)
            ctx.fillText("accomplies",160, 125)

            ctx.fillStyle = "black";
            ctx.font ="11px Arial"
            ctx.fillText("Profil",260, 115)
            ctx.fillText("joueur",260, 125)

            
            // var missions =[{type:"mission", id:"cat", found:false}, {type:"mission", id:"cat", found:true}]

            
                
            if(iBoxPagination.current===0){
                let missions = chars["player"].missionsObjList
                let img_x= 55
                let img_y=150

                for(var ix = 0; ix<missions.length; ix++){
                    if(missions[ix].found === true){
                        ctx.fillStyle = "#bbee86";
                    }else{
                        ctx.fillStyle = "#ee8686";
                    }
                    
                    ctx.beginPath();
                    ctx.roundRect(img_x-2,img_y-2,45, 45, 10);
                    ctx.fill()
                    ctx.stroke();
                    ctx.drawImage(imagesList[missions[ix].id],img_x,img_y,40, 40)
                    img_x= img_x+ 50
                    if(img_x >310){
                        img_x= 55
                        img_y= img_y+50
                    }
                    // var img_y=img_y 
                    
    
                }
            }else if(iBoxPagination.current===1){
                
                let missions = chars["player"].accomplishedMissionsObjList
                let img_x= 55
                let img_y=150

                for(var ix = 0; ix<missions.length; ix++){
                    if(missions[ix].found === true){
                        ctx.fillStyle = "#bbee86";
                    }else{
                        ctx.fillStyle = "#ee8686";
                    }
                    
                    ctx.beginPath();
                    ctx.roundRect(img_x-2,img_y-2,45, 45, 10);
                    ctx.fill()
                    ctx.stroke();
                    ctx.drawImage(imagesList[missions[ix].id],img_x,img_y,40, 40)
                    img_x= img_x+ 50
                    if(img_x >310){
                        img_x= 55
                        img_y= img_y+50
                    }
                    // var img_y=img_y 
                    
    
                }

            }else if(iBoxPagination.current===2){

            }
            
          
        }
    }

  

    const wsDirectionKeysDown=(key:number)=>{
        // console.log('keyy down')
        // privateRoomClient.send(JSON.stringify({
        //     command: "KeyDown",
        //     key: key,
        //     tilesTo: chars["player"].tileTo,
        //     }))
        // keysDown[key]=true
    }
    const wsDirectionKeysUp=(key:number)=>{
        // console.log('key uppp')
        // privateRoomClient.send(JSON.stringify({
        //     command: "KeyUp",
        //     key: key,

        //     }))
        // keysDown[key]=false
    }

    // const wsMovement=()=>{
    //     privateRoomClient.send(JSON.stringify({
    //         command: "stage_5",
    //         position: chars["player"].position,
    //         }))
    // }

    // const wsTilesTo =()=>{
    //     privateRoomClient.send(JSON.stringify({
    //         command: "tilesTo",
    //         tilesTo: chars["player"].tileTo,
    //         }))

    // }

    const handleWs =({ctxD}:{ctxD:CanvasRenderingContext2D})=>{
        // console.log('handle ws ft', room_name)
        privateRoomClient.onopen=()=>{
            privateRoomClient.send(JSON.stringify({
                                command: "reload",
                                tilesTo: [1,1], // ！！！！！！！！！！！ ？？

                                }))
        }

        privateRoomClient.onmessage=(data:any)=>{
            data = JSON.parse(data.data)
            // console.log("msgfor ", data["action_type"])

            if(data["action_type"]==="position"){
                if(chars[data["msg_for"]].playMode==="viewmode"){  

                    switch(data["move"]){
                    case "moveLeft":

                        if(chars[data["msg_for"]].canMoveLeft()){
                            
                            lastKeysUp[data["msg_for"]] = 37
                            chars[data["msg_for"]].moveLeft(data["time"])

                            // console.log("is view on touch ?", chars.player.processMovement(gameTime,lastKeysUp, chars, ctxD, ctxD) )

             
                            // chars[data["msg_for"]].tileTo = data["tileTo"] 
                            // chars[data["msg_for"]].tileFrom = data["tileFrom"]
                            // chars[data["msg_for"]].direction = data["direction"]

                            

                            
                        }
                    break;
                    case "moveRight":
                        
                        
                        if( chars[data["msg_for"]].canMoveRight()){
                            // console.log("is view on touch ?", chars[data["msg_for"]].inTouchWith )
                            lastKeysUp[data["msg_for"]] = 39
                            chars[data["msg_for"]].moveRight(data["time"])

                            // chars[data["msg_for"]].tileTo = data["tileTo"] 
                            // chars[data["msg_for"]].tileFrom = data["tileFrom"]
                            // chars[data["msg_for"]].direction = data["direction"]

                            
                        }
                    break;
                    case "moveUp":
                        
                        if(chars[data["msg_for"]].canMoveUp()){
                            
                            lastKeysUp[data["msg_for"]] = 38
                            chars[data["msg_for"]].moveUp(data["time"])

                            // chars[data["msg_for"]].tileTo = data["tileTo"] 
                            // chars[data["msg_for"]].tileFrom = data["tileFrom"]
                            // chars[data["msg_for"]].direction = data["direction"]


                            
                        }
                    break;
                    case "moveDown":
                        
                        if( chars[data["msg_for"]].canMoveDown()){
                            // console.log("is view on touch ?", chars[data["msg_for"]].inTouchWith )
                            lastKeysUp[data["msg_for"]] = 40
                       
                            chars[data["msg_for"]].moveDown(data["time"])
                            // chars[data["msg_for"]].tileTo = data["tileTo"] 
                            // chars[data["msg_for"]].tileFrom = data["tileFrom"]
                            // chars[data["msg_for"]].direction = data["direction"]


                            
                        }
                    break;
                    case "standingUp":
                            // chars["player"].standingUp(data["time"]) 
                    break;
                    case "standingDown":
                            // chars["player"].standingDown(data["time"]) 
                    break;
                    case "standingRight":
                            // chars["player"].standingRight(data["time"]) 
                    break;
                    case "standingLeft":
                            // chars["player"].standingLeft(data["time"]) 
                    break;
                  
                    }

                }

        }else if(data["action_type"]==="reload"){
            if(params==="viewmode"){

                var keys =  Object.keys(chars)
                for(var i=0; i<keys.length; ++i){
                    // console.log("nammeee",keys[i] )
                    if(chars[keys[i]].isEnemy===true){
                        chars[keys[i]] = new Enemy (tileTypes, toIndex,  mapTileData, 
                                                        true,true, keys[i], "viewmode", 
                                                        privateRoomClient,chars[keys[i]].startPos,
                                                        navigate
                                                        
                                                        )

                    }else{

                        chars[keys[i]] = new Character(tileTypes, toIndex,  mapTileData, 
                                                        keys[i]==="player"?false:true,false, keys[i], "viewmode", 
                                                        privateRoomClient, 
                                                        keys[i]==="player"?startPosPlayer:
                                                        keys[i]==="npcC"?startPosNpcC :
                                                        keys[i]==="npcExplorer"?startPosNpcExplorer:
                                                        keys[i]==="npcP"?startPosNpcP:
                                                        [3,3],
                                                        navigate
                                                         )
                    }
            }
            }
        }else if(data["action_type"]==="triggerTalk"){
            // console.log('trigger talk',chars["player"].startInteraction)
            chars["player"].soundPlayer.interactPlay()
            chars["player"].startInteraction = true

        }else if(data["action_type"]==="pressA"){
            if(params==="viewmode"){
                chars["player"].soundPlayer.interactPlay()
                // console.log('pressA', parseInt(data["codeInput"]))
                // chars["player"].startInteraction = true
                // chars[chars["player"].inTouchWith].myActionTree.accept(chars)
                chars["player"].dialBox.erase(ctxD) //!!!!! was it onlyt ctx ?????

                chars[chars["player"].inTouchWith].myActionTree.codeValidation(isNaN(parseInt(data["codeInput"]))===true?data["codeInput"]:parseInt(data["codeInput"]))
                // chars["player"].interacting(chars)
                
                
            }
        }else if(data["action_type"]==="endInteraction"){
            if(params==="viewmode"){
                // chars["player"].dialBox.erase(ctxD) 
                // console.log('pressA', params)
                // chars["player"].startInteraction = true
                // chars[data["msg_for"]].myActionTree.mx = 0 // 
                chars["player"].endInteraction(chars)

            }
        }else if(data["action_type"]==="pickUp"){
            if(params==="viewmode"){
                chars["player"].pickUp()

            }
        }else if(data["action_type"]==="visibility"){
            setVisibilityState(data["status"])
        }
    }
}




    const wsTriggerTalk=()=>{
        privateRoomClient.send(JSON.stringify({
                    command: "triggerTalk",
                    }))

    }

    const wsPressA=()=>{
        privateRoomClient.send(JSON.stringify({
            command: "pressA",
            codeInput: codeEntered
            }))
    }
    const wsPickUp=()=>{
        privateRoomClient.send(JSON.stringify({
            command: "pickUp",
            }))
    }

    useEffect(()=>{

        // console.log('i fire once');
        
        const canvas= canvasRef.current!;
        const ctx = canvasRef.current?.getContext("2d");
        if(!ctx) {return;}
        
        // const canvasD= canvasDref.current!;
        const ctxD = canvasDref.current?.getContext("2d");
        if(!ctxD) {return;}

        const ctxI = canvasIref.current?.getContext("2d");
        if(!ctxI) {return;}
        
        let animatedFrameId:number;
        
        // if(locker.current===false){
        //     locker.current =true
            handleWs({ctxD})
            
        // }
       

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             EVENTS
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        canvas.addEventListener("touchstart", function(e) {
            
            e.preventDefault()
            let xPos = e.touches[0].clientX;
            let yPos = e.touches[0].clientY

            //left buttons
            //talk btn
            if((xPos>=uis.talkButton.x- uis.talkButton.w && xPos<=uis.talkButton.x + uis.talkButton.w) 
            && (yPos>=uis.talkButton.y - uis.talkButton.w && yPos<=uis.talkButton.y + uis.talkButton.h)){
                if(chars.player.wannaTalk===true &&  chars["player"].preventTalkBtn===false){
                    if(chars["player"].playMode==="ctlmode"){
                        keysDown[84] = true
                        chars["player"].startInteraction = true
                        
                        chars["player"].preventIbox = true

                        chars["player"].preventNumpad = false
                        chars["player"].preventTalkBtn =true
                        chars["player"].preventArrows = true
                        chars["player"].soundPlayer.interactPlay()
                        wsTriggerTalk()
                    }
                    
                }
            }
            // //accept btn
            // iBox btn
            if((xPos>=uis.invButton.x-uis.invButton.w && xPos<=uis.invButton.x + uis.invButton.w) 
            && (yPos>=uis.invButton.y-uis.invButton.w && yPos<=uis.invButton.y + uis.invButton.h)){
                        /// this needs to change to
                        keysDown[73] = true
                        showIbox.current = !showIbox.current
                        // chars["player"].iBoxOpC()
                        // chars["player"].startInteraction = true
            }
            ctx.arc(uis.arrow.up.x,uis.arrow.up.y, 20, 0, 2 * Math.PI);
            // direction arrows //////////////////////////////////////////////////////////////////////////
            if((xPos>=uis.arrow.up.x- uis.arrowSize&& xPos<=uis.arrow.up.x + uis.arrowSize) 
            && (yPos>=uis.arrow.up.y- uis.arrowSize && yPos<=uis.arrow.up.y + uis.arrowSize)){
                if(chars["player"].playMode==="ctlmode" && chars["player"].preventArrows===false && showIbox.current===false){
                    wsDirectionKeysDown(38)
                    keysDown[38] = true
                   

                }else{
                     //this shoould scrool ibox up
                    if(iBoxPagination.current<=1){
                        iBoxPagination.current ++
                    }else{
                        iBoxPagination.current = 0
                    }
                }

            }
            if((xPos>=uis.arrow.down.x -uis.arrowSize && xPos<=uis.arrow.down.x + uis.arrowSize ) 
            && (yPos>=uis.arrow.down.y -uis.arrowSize && yPos<=uis.arrow.down.y + uis.arrowSize)){
                if(chars["player"].playMode==="ctlmode" && chars["player"].preventArrows===false && showIbox.current===false){
                    keysDown[40] = true
                    wsDirectionKeysDown(40)  
                    // wsMovement()
                    // wsTilesTo()           

                }else{
                    //this shoould scrool ibox down
                    if(iBoxPagination.current<=1){
                        iBoxPagination.current ++
                    }else{
                        iBoxPagination.current = 0
                    }
                }
                

            }
            if((xPos>=uis.arrow.left.x -uis.arrowSize && xPos<=uis.arrow.left.x + uis.arrowSize) 
            && (yPos>=uis.arrow.left.y -uis.arrowSize && yPos<=uis.arrow.left.y + uis.arrowSize)){
                if(chars["player"].playMode==="ctlmode"&& chars["player"].preventArrows===false && showIbox.current===false){
                    keysDown[37] = true
                    wsDirectionKeysDown(37)

                }else{
                    if(iBoxPagination.current<=1){
                        iBoxPagination.current ++
                    }else{
                        iBoxPagination.current = 0
                    }
                }
            }
            if((xPos>=uis.arrow.right.x-uis.arrowSize  && xPos<=uis.arrow.right.x + uis.arrowSize) 
            && (yPos>=uis.arrow.right.y -uis.arrowSize && yPos<=uis.arrow.right.y + uis.arrowSize)){
                if(chars["player"].playMode==="ctlmode"&& chars["player"].preventArrows===false && showIbox.current===false){
                    keysDown[39] = true
                    wsDirectionKeysDown(39)

                }else{
                    if(iBoxPagination.current<=1){
                        iBoxPagination.current ++
                    }else{
                        iBoxPagination.current = 0
                    }
                }
            }

            // NUMPAD //// 


                if((xPos>=uis.numPad[1].x && xPos<=uis.numPad[1].x + uis.numPad[1].w) 
                && (yPos>=uis.numPad[1].y && yPos<=uis.numPad[1].y + uis.numPad[1].h)){

                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            codeEntered = codeEntered+"1"
                            // console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[1]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }

                }
                //chage the iff to simply change the inpu
                if((xPos>=uis.numPad[2].x && xPos<=uis.numPad[2].x + uis.numPad[2].w) 
                && (yPos>=uis.numPad[2].y && yPos<=uis.numPad[2].y + uis.numPad[2].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            codeEntered = codeEntered+"2"
                            console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[2]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }
                }
                if((xPos>=uis.numPad[3].x && xPos<=uis.numPad[3].x + uis.numPad[3].w) 
                && (yPos>=uis.numPad[3].y && yPos<=uis.numPad[3].y + uis.numPad[3].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            codeEntered = codeEntered+"3"
                            // console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[3]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }
                }
                if((xPos>=uis.numPad[4].x && xPos<=uis.numPad[4].x + uis.numPad[4].w) 
                && (yPos>=uis.numPad[4].y && yPos<=uis.numPad[4].y + uis.numPad[4].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            codeEntered = codeEntered+"4"
                            // console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[4]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }
                }
                if((xPos>=uis.numPad[5].x && xPos<=uis.numPad[5].x + uis.numPad[5].w) 
                && (yPos>=uis.numPad[5].y && yPos<=uis.numPad[5].y + uis.numPad[5].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            codeEntered = codeEntered+"5"
                            // console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[5]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }
                }
                if((xPos>=uis.numPad[6].x && xPos<=uis.numPad[6].x + uis.numPad[6].w) 
                && (yPos>=uis.numPad[6].y && yPos<=uis.numPad[6].y + uis.numPad[6].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            codeEntered = codeEntered+"6"
                            // console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[6]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }
                }
                if((xPos>=uis.numPad[7].x && xPos<=uis.numPad[7].x + uis.numPad[7].w) 
                && (yPos>=uis.numPad[7].y && yPos<=uis.numPad[7].y + uis.numPad[7].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            codeEntered = codeEntered+"7"
                            // console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[7]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }
                }
                if((xPos>=uis.numPad[8].x && xPos<=uis.numPad[8].x + uis.numPad[8].w) 
                && (yPos>=uis.numPad[8].y && yPos<=uis.numPad[8].y + uis.numPad[8].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            codeEntered = codeEntered+"8"
                            // console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[8]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }
                }
                if((xPos>=uis.numPad[9].x && xPos<=uis.numPad[9].x + uis.numPad[9].w) 
                && (yPos>=uis.numPad[9].y && yPos<=uis.numPad[9].y + uis.numPad[9].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            codeEntered = codeEntered+"9"
                            // console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[9]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }
                }
                if((xPos>=uis.numPad[0].x && xPos<=uis.numPad[0].x + uis.numPad[0].w) 
                && (yPos>=uis.numPad[0].y && yPos<=uis.numPad[0].y + uis.numPad[0].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            codeEntered = codeEntered+"0"
                            // console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[0]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }
                }
                if((xPos>=uis.numPad[10].x && xPos<=uis.numPad[10].x + uis.numPad[10].w) 
                && (yPos>=uis.numPad[10].y && yPos<=uis.numPad[10].y + uis.numPad[10].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        if(chars["player"].numPadMode==="numerical"){
                            // codeEntered = codeEntered+"0"
                            // console.log("codeEntered", codeEntered)
                        }else if(chars["player"].numPadMode==="alphabetic"){
                            var obj = chars["player"].missionsObjList.find(x => x.id === 'fraise')
                            var pad = obj?.pad
                            codeEntered = codeEntered+pad[10]
                            // console.log("codeEnterexxx", codeEntered)
                        } 
                    }
                }
                if((xPos>=uis.numPad[11].x && xPos<=uis.numPad[11].x + uis.numPad[11].w) 
                && (yPos>=uis.numPad[11].y && yPos<=uis.numPad[11].y + uis.numPad[11].h)){
                    if(chars["player"].playMode==="ctlmode"){
                        // console.log("pressed 11")
                        
                        // chars[chars["player"].inTouchWith].myActionTree.codeValidation(parseInt(codeEntered))
                        chars[chars["player"].inTouchWith].myActionTree.codeValidation( isNaN(parseInt(codeEntered)) === true?codeEntered: parseInt(codeEntered))
                        chars["player"].dialBox.erase(ctxD)
                        chars["player"].soundPlayer.interactPlay()
                        wsPressA()
                        codeEntered = ""
                    }
                }


           

                    
        });

        canvas.addEventListener("touchend", function(e) {
            e.preventDefault()
            let xPos = e.changedTouches[0].clientX;
            let yPos = e.changedTouches[0].clientY;

            //left buttons
            //talk

            if((xPos>=uis.talkButton.x - uis.talkButton.w && xPos<=uis.talkButton.x + uis.talkButton.w) 
            && (yPos>=uis.talkButton.y - uis.talkButton.w  && yPos<=uis.talkButton.y + uis.talkButton.h)){
                // if(chars.player.wannaTalk===true){
                    if(chars["player"].playMode==="ctlmode"){
                        keysDown[84] = false
                        
                     


                    }
                    // lastKeysUp.player= 38

                // }
            }
    
            if((xPos>=uis.invButton.x-uis.invButton.w && xPos<=uis.invButton.x + uis.invButton.w) 
            && (yPos>=uis.invButton.y-uis.invButton.w && yPos<=uis.invButton.y + uis.invButton.h)){
                        /// this needs to change to
                        keysDown[73] = false
                        // showIbox.current = !showIbox.current
                        // chars["player"].iBoxOpC()
                        // chars["player"].startInteraction = true
            }
            

            // direction arrows
            if((xPos>=uis.arrow.up.x- uis.arrowSize&& xPos<=uis.arrow.up.x + uis.arrowSize) 
            && (yPos>=uis.arrow.up.y- uis.arrowSize && yPos<=uis.arrow.up.y + uis.arrowSize)){
                if(chars["player"].playMode==="ctlmode" && chars["player"].preventArrows===false){
                    keysDown[38] = false
                    lastKeysUp.player= 38
                    wsDirectionKeysUp(38)

                }
            }
            if((xPos>=uis.arrow.down.x-uis.arrowSize   && uis.arrow.down.x + uis.arrowSize )
             &&(yPos>=uis.arrow.down.y-uis.arrowSize  && yPos<=uis.arrow.down.y +uis.arrowSize)){
                if(chars["player"].playMode==="ctlmode"&& chars["player"].preventArrows===false){
                    keysDown[40] = false
                    lastKeysUp.player  = 40 
                    wsDirectionKeysUp(40)    

                }
            }
            if((xPos>=uis.arrow.left.x -uis.arrowSize && xPos<=uis.arrow.left.x + uis.arrowSize) 
            && (yPos>=uis.arrow.left.y -uis.arrowSize && yPos<=uis.arrow.left.y + uis.arrowSize)){
                if(chars["player"].playMode==="ctlmode"&& chars["player"].preventArrows===false){
                    keysDown[37] = false
                    lastKeysUp.player = 37
                    wsDirectionKeysUp(37)

                }
            }
            if((xPos>=uis.arrow.right.x -uis.arrowSize && xPos<=uis.arrow.right.x + uis.arrowSize) 
            && (yPos>=uis.arrow.right.y-uis.arrowSize && yPos<=uis.arrow.right.y + uis.arrowSize)){
                if(chars["player"].playMode==="ctlmode"&& chars["player"].preventArrows===false){
                    keysDown[39] = false
                    lastKeysUp.player = 39
                    wsDirectionKeysUp(39)

                }
            }
                    
        });
     

        window.addEventListener("keydown", function(e){
            // console.log("keycode", e.keyCode)
            e.preventDefault()
            if(e.keyCode===66){ 
                if(params==="ctlmode"){
                    params="viewmode"
                    chars["player"].playMode = "viewmode"
                }else{
                    params="ctlmode"
                    chars["player"].playMode = "ctlmode"
                }
            }
            if(chars["player"].playMode==="ctlmode" ){
                if(e.keyCode>=37 && e.keyCode<=40 && chars["player"].preventArrows===false){
                    keysDown[e.keyCode]= true
                }
                if(e.keyCode===80){ // p key pick up
                    keysDown[e.keyCode]= true
                    wsPickUp()
                }


            }
            
        })
        
        window.addEventListener("keyup", function(e){
            e.preventDefault()
            if(chars["player"].playMode==="ctlmode" ){
                if(e.keyCode>=37 && e.keyCode<=40 && chars["player"].preventArrows===false){
                    keysDown[e.keyCode]= false;
                    lastKeysUp.player = e.keyCode
                }
                if(e.keyCode==83){ // s key
                    currentSpeed = (currentSpeed >=(gs.gameSpeeds.length-1) ? 0 : currentSpeed +1);
                }
                if(e.keyCode===80){ 
                    keysDown[e.keyCode]= false
                }


            }

        })

        

        viewport.screen = [canvas.width, canvas.height];

    


        catImg = new Image();
        catImg.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        catImg.onload = function(){ 
            catImgMissionLoaded = true
         };
         catImg.src = IMAGES.cat ;

        imagesList["fraise"] = catImg

    
        // SKEL WALK
        tilesetEnemy = new Image();
        tilesetEnemy.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        tilesetEnemy.onload = function(){ 
            tilesetLoadedEnemy= true
        };
    
        tilesetEnemy.src = tilesetURLEnemy;


        
        
        lockPng = new Image();
        lockPng.onerror = function(){
            // ctx = null;
            alert("Failed loading lockPng.");
        };
        lockPng.onload = function(){ lockPngLoaded = true; };
        lockPng.src = lockImage;

        // ARROWNS IMG   ////////////////////////////////////////////////////////////////////////// 
        arrowUpPng = new Image();
        arrowUpPng.onerror = function(){
            // ctx = null;
            alert("Failed loading lockPng.");
        };
        arrowUpPng.onload = function(){ arrowUpPngLoaded = true; };
        arrowUpPng.src = arrowUp;

        arrowDownPng = new Image();
        arrowDownPng.onerror = function(){
            // ctx = null;
            alert("Failed loading lockPng.");
        }
        arrowDownPng.onload = function(){ arrowDownPngLoaded = true; };
        arrowDownPng.src = arrowDown;


        arrowLeftPng = new Image();
        arrowLeftPng.onerror = function(){
            // ctx = null;
            alert("Failed loading lockPng.");
        };
        arrowLeftPng.onload = function(){ arrowLeftPngLoaded = true; };
        arrowLeftPng.src = arrowLeft;

        arrowRightPng = new Image();
        arrowRightPng.onerror = function(){
            // ctx = null;
            alert("Failed loading lockPng.");
        };
        arrowRightPng.onload = function(){ arrowRightPngLoaded = true; };
        arrowRightPng.src = arrowRight;
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       


    
        floorsPicsSet = new Image();
        floorsPicsSet.onerror = function(){
            // ctx = null;
            alert("Failed loading  coinsSet.");
        };
        floorsPicsSet.onload = function(){  floorsPicsSetLoaded = true; };
        floorsPicsSet.src =  floorsPicsSetURL;





        officePicsSet = new Image();
        officePicsSet.onerror = function(){
            // ctx = null;
            alert("Failed loading  coinsSet.");
        };
        officePicsSet.onload = function(){  officePicsSetLoaded  = true; };
        officePicsSet.src =  officePicsSetURL;



        interiorsPicsSet = new Image();
        interiorsPicsSet.onerror = function(){
            // ctx = null;
            alert("Failed loading  coinsSet.");
        };
        interiorsPicsSet.onload = function(){  interiorsPicsSetLoaded  = true; };
        interiorsPicsSet.src =  interiorsPicsSetURL;




        noirSet = new Image();
        noirSet.onerror = function(){
            // ctx = null;
            alert("Failed loading  coinsSet.");
        };
        noirSet.onload = function(){  noirSetLoaded = true; };
        noirSet.src =  noirSetURL;





        coinsSet = new Image();
        coinsSet.onerror = function(){
            // ctx = null;
            alert("Failed loading  coinsSet.");
        };
        coinsSet.onload = function(){  coinsSetLoaded = true; };
        coinsSet.src =  coinsSetURL;



        terrainsSet = new Image();
        terrainsSet.onerror = function(){
            // ctx = null;
            alert("Failed loading terrainsSet .");
        };
        terrainsSet.onload = function(){ terrainsSetLoaded = true; };
        terrainsSet.src = terrainsSetURL;



       
        cityTerrainsSet = new Image();
        cityTerrainsSet.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        cityTerrainsSet.onload = function(){ cityTerrainsSetLoaded = true; };
        cityTerrainsSet.src = cityTerrainsSetURL;



        cityPropsSet = new Image();
        cityPropsSet.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        cityPropsSet.onload = function(){ cityPropsSetLoaded = true; };
        cityPropsSet.src = cityPropsSetURL;

     
        
        condoSet = new Image();
        condoSet.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        condoSet.onload = function(){ condoSetLoaded = true; };
        condoSet.src = condoSetURL;


        gymeSet = new Image();
        gymeSet.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        gymeSet.onload = function(){ gymeSetLoaded = true; };
        gymeSet.src = gymeSetURL;


        campingSet = new Image();
        campingSet.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        campingSet.onload = function(){ campingSetLoaded = true; };
        campingSet.src = campingSetURL;



        tileset = new Image();
        tileset.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        tileset.onload = function(){ tilesetLoaded = true; };
        tileset.src = tilesetURL;

        ///NPC A
        tilesetNpcA = new Image();
        tilesetNpcA.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        tilesetNpcA.onload = function(){ tilesetLoadedNpcA = true; };
        tilesetNpcA.src = tilesetURLNpcA;

        //NPC B
        tilesetNpcB = new Image();
        tilesetNpcB.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        tilesetNpcB.onload = function(){ tilesetLoadedNpcB = true; };
        tilesetNpcB.src = tilesetURLNpcB;

        //NPC C
        tilesetNpcC = new Image();
        tilesetNpcC.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        tilesetNpcC.onload = function(){ tilesetLoadedNpcC = true; };
        tilesetNpcC.src = tilesetURLNpcC;

        //NPC P
        tilesetNpcP = new Image();
        tilesetNpcP.onerror = function(){
            // ctx = null;
            alert("Failed loading tileset.");
        };
        tilesetNpcP.onload = function(){ tilesetLoadedNpcP = true; };
        tilesetNpcP.src = tilesetURLNpcP;


        // #6.1 processing animated tiles files off in #14
        // off coz we now handle loading processing and drawing in a dedicatImged class
        // for(const x in tileTypes){
        //     tileTypes[x]['animated'] = tileTypes[x].sprite.length > 1 ? true : false;
        //     //if the spite is animate / create temporary var t
        //     if(tileTypes[x].animated){
        //         var t = 0;
        //         for(const s in tileTypes[x].sprite){
        //             tileTypes[x].sprite[s]['start'] = t;
        //             t+= tileTypes[x].sprite[s].d;
        //             tileTypes[x].sprite[s]['end'] = t;
        //         }

		// 	tileTypes[x]['spriteDuration'] = t;
		// }
        // }

        //#11 code to genereate the tileMap 
        // we nee to

        // hars["player"].missionsObjList.find(x => x.id === 'cat')

        var baseLayer =gs.layers.find(x=>x.id===1)

        if(baseLayer!==undefined){
            mapTileData.buildMapFromData(baseLayer.data, gs.nTileW, gs.nTileH);
        }
        mapTileData.addRoofs(gs.roofList);


        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        //      TRIGERED EVENTS ON MAP
        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        

 
        

        // je fais nimp là !!on a peut être pas besions de cette objet ainsi dans les tiles
        // 

        mapTileData.map[134].walkable = false

        mapTileData.map[135].walkable = false

        mapTileData.map[134].trigerQuiz = true

        mapTileData.map[135].trigerQuiz = true
        // mapTileData.map[134].walkable = false
        // mapTileData.map[135].walkable = false

        mapTileData.map[((8*gs.nTileW)+6)].hasSecret=true
        mapTileData.map[((8*gs.nTileW)+6)].secretObj = {type:"mission", id:"fraise", found:false}

        mapTileData.map[((4*gs.nTileW)+4)].hasSecret=true
        mapTileData.map[((4*gs.nTileW)+4)].secretObj = {type:"mission", id: "dog", found:false, }
        
        mapTileData.map[((2*gs.nTileW)+2)].eventEnter = function(){ 
            // chars.player.isSurprised = true
        };

        // #13 adding some exemples on the map
        // Stars
        for(var i = 3; i < 6; i++){
            var ps = new PlacedItemStack(1, 1,); 
            ps.placeAt(i+10, 1,mapTileData , toIndex);
        }
        // for(var i = 3; i < 8; i++){
        //     var ps = new PlacedItemStack(1, 1); 
        //     ps.placeAt(3, i, mapTileData , toIndex);
        // }


        //# 12 ::  10 exemple object to show on the map :
        // TREESS and cofres
        // var mo1 = new MapObject(1,mapTileData, toIndex); 
        // mo1.placeAt(2, 4);

        // var mo2 = new MapObject(2,mapTileData, toIndex); 
        // mo2.placeAt(2, 3);
        
        // var mo11 = new MapObject(1,mapTileData, toIndex); 
        // mo11.placeAt(6, 4);
        // var mo12 = new MapObject(2,mapTileData, toIndex); mo12.placeAt(7, 4);
        
        // var mo4 = new MapObject(3,mapTileData, toIndex); mo4.placeAt(4, 5);
        // var mo5 = new MapObject(3,mapTileData, toIndex); mo5.placeAt(4, 8);
        // var mo6 = new MapObject(3,mapTileData, toIndex); mo6.placeAt(4, 11);
        
        // var mo7 = new MapObject(3,mapTileData, toIndex); mo7.placeAt(2, 6);
        // var mo8 = new MapObject(3,mapTileData, toIndex); mo8.placeAt(2, 9);
        // var mo9 = new MapObject(3,mapTileData, toIndex); mo9.placeAt(2, 12);
        // var mo10 = new MapObject(3,mapTileData, toIndex); mo10.placeAt(2, 2);
        
      
        document.querySelector("canvas")


        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') {
                
                // console.log("hidden, pause the game", document.hidden, document.visibilityState)
                privateRoomClient.send(JSON.stringify({
                                command: "visibility",
                                status:"hidden"
                                }))
            } else if(document.visibilityState === 'visible'){

             privateRoomClient.send(JSON.stringify({
                    command: "visibility",
                    status:"visible"
                    }))
            //   console.log("not hidden",  document.hidden, document.visibilityState);
            
            }
          });
        
        // if(visibilityState==="visible"){
            const render=()=>{
                // console.log(".>>>>..............")
                drawGame({ctx},{ctxD},{ctxI})
                animatedFrameId = window.requestAnimationFrame(render)
               
            }
            render()

        // }else{
            return()=>{
                window.cancelAnimationFrame(animatedFrameId)
            }
        // }
        // window.cancelAnimationFrame(animatedFrameId )
         
        // const render=()=>{
        //     console.log(".>>>>..............")
        //     drawGame({ctx},{ctxD},{ctxI})
        //     animatedFrameId = window.requestAnimationFrame(render)
           
        // }

        
        // render()
        
        
        

    },[])

    

    return(
        <>
            <div className="flex h-full justify-center">
                   
                    <canvas
                    id='canvas2'
                    ref={canvasRef}
                    style={{position: "absolute",top:0,left:0, zIndex: 1}}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    />
                    </div>
          
                  


                    <div className=" w-full border-0 border-blue-0" style={{position: "absolute",top:0, left:0, backgroundColor: "transparent", zIndex: 3}}>

                    <div className=" w-full border-2 border-red-0" style={{top:0    , left:0, backgroundColor: "transparent", zIndex:3}}>
                    <VidCom room={privateRoomClient} /> 
                    </div>   
             
                        
                        <div className="flex-col">
                        <canvas
                        id='canvas1'
                        ref={canvasDref}
                        className="ml-auto mr-auto mt-2  "
                        // style={{position: "absolute",top:0, ", left:0, backgroundColor: "transparent", zIndex: 3}}
                        width={400}
                        height={250}
                        />
                    </div>
                
                     <div className=" w-full  border-red-0" style={{position: "absolute",top:90    , left:0, backgroundColor: "transparent", zIndex:3}}>
                        <canvas
                        id='canvas1'
                        ref={canvasIref}
                        className="ml-auto mr-auto mt-2  "
                        // style={{position: "absolute",top:0,  ", left:0, backgroundColor: "transparent", zIndex: 3}}
                        width={400}
                        height={320}
                        />
                     </div>  
                   
            </div>   
        </>   
    )
}



