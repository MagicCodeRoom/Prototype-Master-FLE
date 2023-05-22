import gs from "../data/GameSpecs";
import TileMap from "./TileMap";
import { objectCollision } from "../data/GameSpecs";
import Inventory from "./Inventory";
import Sprite from "./Sprite";
import DialogueBox from "./DialogueBox";
import ActionTree from "./ActionTree";
import AnswerBox from "./AnswerBox";
import iBox from "./iBox";


import SoundPlayer from "./SoundPlayer";

interface Chars{[key:string]:Character}

interface DelayMove {
    [key: string]: number;
  }
  type TileEvent = (c: Character) => void;

interface Ans {
    ans:{0: string; 1: boolean; 2: () => void }};



export default class Character{
    charsDial: Chars | null
    tileFrom: number[];
    tileTo: number[];
    position: number[];
    positionCorrectionX : number;
    positionCorrectionY : number;
    dimension: number[];
    delayMove: DelayMove;
    timeMove: number;
    direction :number;
    sprites: Record<number, any> = {};
    inventory : Inventory;
    gs:any;
    isNpc: boolean;
    isEnemy: boolean;
    charName: string;
    allowedToMove : boolean;
    tilePast : number[];
    wannaTalk: boolean;
    inTouchWith: string;
    justTalkedTo : string;
    startInteraction: boolean;

    actionTreeReset : boolean;

    ans: any;

    mapTileData:TileMap;
    opaMul :number;




    mood : number;
    isSurprised :boolean
    dialBox  : DialogueBox 

    iBox : iBox
    preventIbox : boolean

    preventNumpad : boolean
    numPadMode : string
    preventTalkBtn :boolean


    
    preventArrows : boolean



    newFoundSecret: string
    missionsObjList: {[key:string]:any}[]
    accomplishedMissionsObjList : {[key:string]:any}[]

    coins : number
    animateCoin : boolean
    coinTaken : boolean


    ctxD :CanvasRenderingContext2D | null
    ctxI :CanvasRenderingContext2D | null
    gameTime : number

    playMode: string

    myActionTree:ActionTree

    txtForBtn: {[key:number]:{}}

    privateRoomClient: any

    startPos: number[]

    showingIbox: boolean;

    req2ToProcessAnser : boolean
    mission2Accept : string


    spriteW: number
    spriteH: number

    lastKey: number


    nextDial: {code:number|string, nextId: number }[]=[]

    reconnect : {npcC:number,npcExplorer:number}
    
    // movements
    placeAt :(x:number, y:number)=> void;
    processMovement :(t: number, lastKeysUp:{[key:string]:number}, chars:{[key:string]:Character}, ctxD:CanvasRenderingContext2D, ctxI:CanvasRenderingContext2D)=> boolean;
    
    canMoveTo : (x:number, y:number)=> boolean;
    
    canMoveUp : ()=>boolean;
    canMoveDown : ()=> boolean;
    canMoveLeft : ()=> boolean;
    canMoveRight : ()=> boolean;
    
    // canMoveDirection:(d:number)=>boolean;

    // moveDirection:(d:number, t:number)=> void;
    
    moveLeft :(t: number)=> void;
    moveRight:(t: number)=> void;
    moveUp	 :(t: number)=> void;
    moveDown :(t: number)=> void;
    standingUp :(t: number)=> void;
    standingDown :(t: number)=> void;
    standingRight :(t: number)=> void;
    standingLeft :(t: number)=> void;
    
    ///actions
    interacting : (chars:{[key:string]:Character})=> void
    endInteraction :(chars:{[key:string]:Character})=> void
    wsInteractionEnder: (chars:{[key:string]:Character})=> void
    pickUp: ()=> boolean;

    //
    moodProcessing : ()=>void

    anserBox:()=>void
    iBoxOpC: ()=>void

    addCoins: (gain:number, chars:{[key:string]:Character})=>void
    soundPlayer: SoundPlayer
    takeCoins:(take:number)=>void
    animCoin:()=>void
    missionAccomplished:(chars:{[key:string]:Character})=> void

    GuidingEvents: (moveEvent:string,move:string, t:number, msg_for:string, tileTo:number[], direction:number)=>void

    // borderChecker:(isPlus:boolean, ol:number, add:number)=>number;

    constructor(tileTypes: any, toIndex:(x:number, y:number)=>number, mapTileData:TileMap,
                isNpc:boolean,isEnemy:boolean, charName:string, playMode:string, privateRoomClient:any, startPos:number[],navigate:any){
        this.charName = charName
        this.playMode = playMode
        this.privateRoomClient = privateRoomClient
        this.charsDial = {}
        this.myActionTree = new ActionTree(charName, this.charsDial)
        this.tileFrom = [1, 1];
        this.tilePast = [0,0]
        this.startPos = startPos
        this.tileTo = startPos

        this.reconnect = {npcC:0,npcExplorer:0}

        this.lastKey = 0
      
        this.position = [27 , 4];
        this.positionCorrectionX = 0
        this.positionCorrectionY = -25
        
        this.dimension = [25, 25];

        this.wannaTalk = false
        this.inTouchWith =""
        this.justTalkedTo =""
        this.startInteraction = false

        this.numPadMode = "numerical"

        this.actionTreeReset = false

        this.nextDial = []

        this.mood=21
        this.isSurprised = false

        this.req2ToProcessAnser = false
        this.mission2Accept =""


        this.dialBox =  new DialogueBox(this.charsDial)
        this.preventIbox = false

        this.preventNumpad = true
        this.preventTalkBtn =false
        this.preventArrows = false



        this.iBox = new iBox()
        this.newFoundSecret = ""
        this.missionsObjList = []
        this.accomplishedMissionsObjList = []


        this.coins = 10
        this.animateCoin = false
        this.coinTaken = false

        this.soundPlayer = new SoundPlayer()
         
        this.showingIbox = true

        this.ans = {}

        this.txtForBtn = {}

        this.ctxD = null
        this.ctxI = null
        this.gameTime = 0

        this.isNpc = isNpc
        this.isEnemy = isEnemy
        // this.delayMove = 200; #8
        this.delayMove	= {};
        // this.delayMove[gs.floorTypes.path]		= 200;
        // this.delayMove[gs.floorTypes.grass]	= 500;
        // this.delayMove[gs.floorTypes.ice]		= 200;
        // this.delayMove[gs.floorTypes.conveyorU]	= 200;
        // this.delayMove[gs.floorTypes.conveyorD]	= 200;
        // this.delayMove[gs.floorTypes.conveyorL]	= 200;
        // this.delayMove[gs.floorTypes.conveyorR]	= 200;
        
        this.timeMove = 0;
        this.direction =  gs.directions.down
        this.allowedToMove = true

        this.sprites = {};
        // cutting the different directions sprites
        this.spriteW = 16
        this.spriteH = 32

        // standing sprites on png start at y 28
        var heightCut = 28
        let sPa = 600 // Standing Seep Animation
        let mSa = 100   // marchin Speed
        var sh = 32
        var sw = 16


        this.sprites[gs.directions.standingLeft] = new Sprite([ {x:this.spriteW*0,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*1,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*2,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*3,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*4,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*5,y:this.spriteH*1,w:sw,h:sh,d:sPa}]);
            
        this.sprites[gs.directions.standingUp] = new Sprite([   {x:this.spriteW*6,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*7,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*8,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*9,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*10,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*11,y:this.spriteH*1,w:sw,h:sh,d:sPa}]);
                
        this.sprites[gs.directions.standingRight] = new Sprite([{x:this.spriteW*12,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*13,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*14,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*15,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*16,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*17,y:this.spriteH*1,w:sw,h:sh,d:sPa}]);
                
        this.sprites[gs.directions.standingDown] = new Sprite([ {x:this.spriteW*18,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*19,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*20,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*21,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*22,y:this.spriteH*1,w:sw,h:sh,d:sPa},
                                                                {x:this.spriteW*23,y:this.spriteH*1,w:sw,h:sh,d:sPa}]);
        // marching sprites
        this.sprites[gs.directions.right]	= new Sprite([ {x:this.spriteW*0,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*1,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*2,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*3,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*4,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*5,y:this.spriteH*2,w:sw,h:sh,d:mSa}]);
       
        this.sprites[gs.directions.up]	    = new Sprite([  {x:this.spriteW*6,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*7,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*8,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*9,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*10,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*11,y:this.spriteH*2,w:sw,h:sh,d:mSa}]);

        this.sprites[gs.directions.left]	= new Sprite([  {x:this.spriteW*12,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*13,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*14,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*15,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*16,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*17,y:this.spriteH*2,w:sw,h:sh,d:mSa}]);
                                                                              
        this.sprites[gs.directions.down]	= new Sprite([  {x:this.spriteW*18,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*19,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*20,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*21,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*22,y:this.spriteH*2,w:sw,h:sh,d:mSa},
                                                            {x:this.spriteW*23,y:this.spriteH*2,w:sw,h:sh,d:mSa}]);

        this.inventory = new Inventory(3);

        this.mapTileData = mapTileData
        this.opaMul = 0.1
        

        
        this.iBoxOpC= function(){
            console.log("missions obj!",this.missionsObjList)
            if(this.ctxI===null){return}

            if(this.showingIbox===true){
                this.iBox.drawIbox(this.ctxI, ["fraise"])
                
                this.showingIbox = false
            }else if(this.showingIbox===false){
                this.iBox.closeIbox()
                
                this.showingIbox = true
            }

        }

        this.animCoin=function(){
            this.animateCoin = false
        }


        this.addCoins=function(gain,chars){
            this.soundPlayer.gainCoinPlay()
            // console.log("coings added")
            this.animateCoin = true
            setTimeout(()=>this.animCoin(), 7800)
            this.coins += gain
            this.missionAccomplished(chars)
            //add ws here 
        }

        this.takeCoins=function(taken){
            this.soundPlayer.looseCoinPlay()
            if(this.coins-taken<0){
                this.animateCoin = true
                setTimeout(()=>this.animCoin(), 7800)
                this.coins = 0
                this.coinTaken = true
                // console.log("coings taken", this.coins)
                //add ws here 

            }else{
                this.animateCoin = true
                setTimeout(()=>this.animCoin(), 7800)
                this.coins -= taken
                this.coinTaken = true
                // console.log("coings taken", this.coins)
                //add ws here 
            }
            
           
        }

        this.missionAccomplished=(chars)=>{
            // take cat obj and transfert to 
            // missionFinished
            console.log("this.accomplished0", JSON.stringify(chars["player"].missionsObjList))
            // var ind is not used for convenience / to repair
            var ind = chars["player"].missionsObjList.findIndex(x => x.from === chars["player"].inTouchWith)
            console.log("this.accomplished1", ind)
            console.log("this.accomplished2", chars["player"].missionsObjList[0])
            chars["player"].accomplishedMissionsObjList.push(chars["player"].missionsObjList[0])
            chars["player"].missionsObjList.splice(ind,1)
            

        }

        const wrangleWord=(word:string)=>{
            // create alphaPad letters 
 word = "fraise"
 let letters:string[] = [];
 if(word.length<=11){
     let randLettersNeed = 11- word.length
     const alphabet = 'abcdefghijklmnopqrstuvwxyz';
     
     
     for (let i = 0; i < randLettersNeed; i++) {
         const randomIndex = Math.floor(Math.random() * alphabet.length);
         letters.push(alphabet[randomIndex]);
     }
     letters = letters.concat(word.split(""))
    //  console.log("concateded", letters)
     let currentIndex = letters.length,  randomIndex;

     // While there remain elements to shuffle.
     while (currentIndex != 0) {
     
         // Pick a remaining element.
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex--;
     
         // And swap it with the current element.
         [letters[currentIndex], letters[randomIndex]] = [
         letters[randomIndex], letters[currentIndex]];
     }
 }
//  console.log("randomized", letters)
 return letters
 }
        

      
        
        this.interacting = function(chars){
             
            if(this.ctxD===null){return}
            chars[this.inTouchWith].allowedToMove = false // !! this.inTouchWith
            
            //calling dial box
            // if(chars[this.inTouchWith].myActionTree !== undefined){
                
            let poke = chars[this.inTouchWith].myActionTree.pokeNpc(this.inTouchWith)  // !! this.inTouchWith

            // console.log("poking", poke)
           
            chars["player"].nextDial = poke.nextDial
            //{npcC:0,npcExplorer:0}

      

            // s
            let txt={};
            if(this.charName==="player"){
                const checkMissions=(missionId:string)=>{
                    for(var msId=0; msId< chars["player"].missionsObjList.length; msId++){
                        if(chars["player"].missionsObjList[msId].id === missionId){
                            return true
                        }
                    }
                    return false
                }

                if(poke.reconnect !== null && chars["player"].inTouchWith.length>1){
                    if(chars["player"].inTouchWith==="npcC"){
                        chars["player"].reconnect.npcC= poke.reconnect 

                    }
                    if(chars["player"].inTouchWith==="npcExplorer"){
                        chars["player"].reconnect.npcExplorer= poke.reconnect 

                    }
                }
                
                

                if(poke.action !== null){
                    console.log("pokingxxx", poke.action)
                    this.mission2Accept = poke.action
                    // this should be done when taking the car yes ?
                    checkMissions(chars["player"].mission2Accept)===true?
                                console.log("this is not a new mission")
                                :chars["player"].missionsObjList.push({type:"mission", id:"fraise",from:charName, found:false, pad:wrangleWord("fraise")});

                    
                }


                if(poke.reward!== null){
                    console.log("adding coings")
                    this.addCoins(poke.reward, chars)
                    poke.reward = null
                }

                if(poke.penalty!== null){
                    console.log("penalty")
                    this.takeCoins(poke.penalty)
                    poke.penalty = null
                   
                }
                if(poke.unlock!== null){
                    console.log("unlock door")
                    var d = gs.layers.find(x => x.name === 'limits')
                    console.log(d?.data[135])
                    console.log(d?.data[134])
                    if(d != undefined){
                        d.data[135] = 0
                        d.data[134] = 0
                        mapTileData.map[134].walkable = true
                        mapTileData.map[135].walkable = true
                    }
                    
                    // gs.layers[8].data[135] =0
                    // gs.layers[8].data[134] =0
                    // mapTileData.map[134].walkable = true
                    // mapTileData.map[135].walkable = true
                   
                   
                }
              

                if(this.playMode==="ctlmode"){
                   
                    txt = poke.npc
                    // console.log("start interaction ?", txt) 
                    this.dialBox.handleTxt(this.gameTime, this.ctxD, txt )
                }else if( this.playMode ==="viewmode"){
                   

                    txt = poke.mpc
                    

                    this.dialBox.handleTxt(this.gameTime, this.ctxD, txt )
                    this.txtForBtn = txt

                }
                
            }
            




        }


           // --------
           // call from button 
        // this.confirms=function(){ //poke
        //     this.myActionTree.callConfirm() //will send me thei mission I choose
        //     var txt = this.myActionTree.callAction()
        //                 // confirm pokes actions tree and returns what ?
        // }
        // this.reject=function(){ //poke
        //     this.myActionTree.callReject(){
        //         var txt = this.myActionTree.callAction()
        // }
        







        this.wsInteractionEnder= function(chars){
            // console.log(" ws  ending  interaction ")
            if(this.playMode==="ctlmode"){
                this.privateRoomClient.send(JSON.stringify({
                    command: "endInteraction",
                    msg_for: chars["player"].inTouchWith
                    }))
            }
            // chars["player"].myActionTree
            
            // console.log("//////?")
            
            // if(this.ctxD===null){return}
            // // "automatically ending any interaction when affar"
            // this.dialBox.endDial(this.ctxD)
            // this.dialBox = new  DialogueBox(chars)
            
            // // console.log(`ending interaction ? ${this.startInteraction}with ${this.inTouchWith}`)
            // if(this.inTouchWith.length!==0){
            //     chars[this.inTouchWith].allowedToMove = true
            // }
            // // this.dialbox()
            // chars["player"].wannaTalk = false
            // // chars["player"].inTouchWith = ""
            // chars["player"].startInteraction = false
            // chars["player"].preventIbox = false
            // this.preventNumpad = true
            // this.preventTalkBtn =false
            // this.preventArrows = false
        }

        this.endInteraction= function(chars){
            if(this.ctxD===null){return}
            chars["player"].startInteraction = false
            // "automatically ending any interaction when affar"
            // this.dialBox.endDial(this.ctxD)
            this.dialBox.erase(this.ctxD)
            this.dialBox = new  DialogueBox(chars)
            // console.log("//////?", this.inTouchWith)
            // console.log(`ending interaction ? ${this.startInteraction}with ${this.inTouchWith}`)
            if(this.inTouchWith.length!=0){
                chars[this.inTouchWith].allowedToMove = true
            }
            // this.dialbox()
            chars["player"].wannaTalk = false
            // chars["player"].inTouchWith = ""
            
            chars["player"].preventIbox = false
            this.preventNumpad = true
            this.preventTalkBtn =false
            this.preventArrows = false
        }

        // this.moodProcessing=function(){
        //     if(this.mood >= 0.5){
        //         this.mood = this.mood - 0.005
        //     }else if(this.mood <= 0.5){
        //         // this.allowedToMove = false
        //     }

        // }

        this.moodProcessing=function(){
            if(this.mood >= 0.5){
                this.mood = this.mood - 0.005
            }else if(this.mood <= 0.5){
                // this.allowedToMove = false
            }

        }

        this.anserBox= function(){
            // console.log("dooo something")
        }


      
        this.placeAt = function( x: number, y: number) {
        this.tileFrom = [x, y];
        this.tileTo = [x,y];
        
        this.position =[((gs.tileSize*x)+ ((gs.tileSize-this.dimension[0])/2))+ this.positionCorrectionX,
                        ((gs.tileSize*y)+ ((gs.tileSize-this.dimension[1])/2))+ this.positionCorrectionY ]
        }



        
   


        this.processMovement = function(t,lastKeysUp, chars, ctxD:CanvasRenderingContext2D, ctxI:CanvasRenderingContext2D):boolean{
            // console.log("playmode", this.playMode)

            // mood goes down with time
            this.ctxD = ctxD
            this.ctxI = ctxI
            this.gameTime = t
            this.moodProcessing()
            if(this.startInteraction===true){
                // console.log("heuyuy")
                this.interacting(chars)
            }
            if(this.actionTreeReset===false){
                this.myActionTree = new ActionTree(this.charName,chars )
                this.actionTreeReset = true
            }

            this.isSurprised = false
            if( mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].hasSecret == true){
                this.isSurprised = true
            }

            if( mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].trigerQuiz == true){

                
                navigate("/quiz")

            }
    
                //as for hasNPC, npc makes tiles around him available for talk
         
            // check that it's not moving anymore
            if(this.tileFrom[0]==this.tileTo[0] && this.tileFrom[1]==this.tileTo[1]){


                if(!this.allowedToMove){

                        // self standing compares interactants index pos
                        var playerIndPos = toIndex(chars["player"].tileFrom[0],chars["player"].tileFrom[1])
                        var thisIndPos =toIndex(this.tileFrom[0],this.tileFrom[1])
                        if(playerIndPos>thisIndPos+1){
                            this.standingDown(t)
                            lastKeysUp["player"]=38
                           
                        }else if(playerIndPos<thisIndPos-1){
                            this.standingUp(t) 
                            lastKeysUp["player"]=40
                        }else if(playerIndPos===thisIndPos+1){
                            this.standingLeft(t)
                            lastKeysUp["player"]=37
                        }else if(playerIndPos===thisIndPos-1){
                            this.standingRight(t)
                            lastKeysUp["player"]=39

                        }

                        return false
                    }
                    
                
                
                mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].hasNPC = true

                this.lastKey = lastKeysUp[this.charName]
                // if(lastKeysUp[this.charName]!== this.lastKey){
                //     this.lastKey =lastKeysUp[this.charName]

                    switch(this.lastKey){
                        
                        case 38:
                            this.standingUp(t) 
                            // if(this.playMode==="ctlmode"){
                            //     this.GuidingEvents("stage_5", "standingUp",t, this.charName)
                            // }
                            break;   
                        case 40:
                            this.standingDown(t)
                            // if(this.playMode==="ctlmode"){
                            //     this.GuidingEvents("stage_5", "standingDown",t, this.charName)
                            // }
                            break;
                        case 37:
                            this.standingRight(t)
                            // if(this.playMode==="ctlmode"){
                            //     this.GuidingEvents("stage_5", "standingRight",t, this.charName)
                            // }
                            break;
                        case 39:
                            this.standingLeft(t)
                            // if(this.playMode==="ctlmode"){
                            //     this.GuidingEvents("stage_5", "standingLeft",t, this.charName)
                            // }
                           
                            break;
                        default:
                            // console.log("--")
                    }
                // }

                return false // not moving 
            }

           
            // reset : im an no more on last tile
            mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].hasNPC = false
            mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].npcName = ""
            //%
            // i am on a new tile
            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])].hasNPC = true
            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])].npcName = this.charName

            // check if npc arround me
            // when the NPC commes next to me I also need to react
            var mapRoot = Math.sqrt(mapTileData.map.length)
            let name =""

            type OpaLevels = {
                [key: number]: number
              }
              
            
            var gradLev = 0
            const opaLevels: OpaLevels ={
                2:0.01,
                3:0.01,
                4:0.005,
                5:0.0025,
                6:0.001,
                7:0.0005,
               
            }
            // this.borderChecker=function(isPlus, ol, add){
            //     var posInd = toIndex(this.tileTo[0],this.tileTo[1])
            //     this.borderChecker(true,ol,0)
            //     return 0
            // }
           
            var toPosId =toIndex(this.tileTo[0],this.tileTo[1])
            var fromPosId =toIndex(this.tileFrom[0],this.tileFrom[1])
            var idLatDigit = toIndex(this.tileTo[0],this.tileTo[1])%10
            var verticalId = Math.floor(toIndex(this.tileTo[0],this.tileTo[1])/20)
            // console.log("vertiId", verticalId )
                
               if(this.charName==="player"){

                for(let ol=0; ol!==3; ol++){
                //down
                // center right

                    if( 
                        Math.abs(fromPosId-toPosId)===1  &&  
                      mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])     + (Math.floor((toPosId+ol)/20)!==verticalId? 1:ol)  ] !== undefined
                        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + (Math.floor((toPosId+ol)/20)!==verticalId? 1:ol)  ].visibleOpacity <=0.99){
                        
                        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])   + (Math.floor((toPosId+ol)/20)!==verticalId? 1:ol)  ].isVisible = true
                        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])   + (Math.floor((toPosId+ol)/20)!==verticalId? 1:ol)  ].visibleOpacity +=opaLevels[3]
                    }

                    if( 
                        Math.abs(fromPosId-toPosId)===1  &&  
                        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                    &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                        
                        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[3]
                    }
                    
              // center left
                    // idLatDigit sert à ne pas déborder sur l'autre côté du map   fromPosId
                    // fromPosId limits the logic to moving left, if not , moving down trigers a bit
                    if( 
                        Math.abs(fromPosId-toPosId)===1  &&  
                      mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])     - (Math.floor((toPosId-ol)/20)!==verticalId? idLatDigit:ol)  ] !== undefined
                        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) - (Math.floor((toPosId-ol)/20)!==verticalId? idLatDigit:ol)  ].visibleOpacity <=0.99){
                        
                        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])   - (Math.floor((toPosId-ol)/20)!==verticalId? idLatDigit:ol)  ].isVisible = true
                        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])   - (Math.floor((toPosId-ol)/20)!==verticalId? idLatDigit:ol)  ].visibleOpacity += 0.01
                    }

                    if( 
                        Math.abs(fromPosId-toPosId)===1  &&  
                        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - (Math.floor((toPosId-(ol+3))/20)!==verticalId? idLatDigit:(ol+3)) ] !== undefined
                    &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    - (Math.floor((toPosId-(ol+3))/20)!==verticalId? idLatDigit:(ol+3))].visibleOpacity <=0.99){
                        
                        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - (Math.floor((toPosId-(ol+3))/20)!==verticalId? idLatDigit:(ol+3))].isVisible = true
                        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - (Math.floor((toPosId-(ol+3))/20)!==verticalId? idLatDigit:(ol+3)) ].visibleOpacity +=opaLevels[3]
                    }


                //down side
                for(let xr=0; xr<=3; xr++){
                        // walking right roots
                        if( 
                            Math.abs(fromPosId-toPosId)===1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + mapRoot + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[4]
                        }

                        for(let gradLev=2; gradLev<=3;gradLev++){
                        if( 
                            Math.abs(fromPosId-toPosId)===1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*gradLev + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + mapRoot*gradLev + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*gradLev+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot *gradLev+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[gradLev+3]
                        }
                       
                        if( 
                            Math.abs(fromPosId-toPosId)===1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*4 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + mapRoot*4 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*4+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot *4+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[6]
                        }

                        if( 
                            Math.abs(fromPosId-toPosId)===1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*5 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + mapRoot*5 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*5+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot *5+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[7]
                        }

                        ///////////////////////////
                        // walk down roots right
                        if( 
                            // Math.abs(fromPosId-toPosId)!==1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr + (Math.floor((toPosId+(ol+0))/20)!==verticalId? 1:(ol+0)) ] !== undefined
                            &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot*xr + (Math.floor((toPosId+(ol+0))/20)!==verticalId? 1:(ol+0))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr+ (Math.floor((toPosId+(ol+0))/20)!==verticalId? 1:(ol+0))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr + (Math.floor((toPosId+(ol+0))/20)!==verticalId? 1:(ol+0)) ].visibleOpacity +=opaLevels[4]
                        }
                        if( 
                            // Math.abs(fromPosId-toPosId)!==1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr + (Math.floor((toPosId+(ol+xr))/20)!==verticalId? 1:(ol+xr)) ] !== undefined
                            &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot*xr + (Math.floor((toPosId+(ol+xr))/20)!==verticalId? 1:(ol+xr))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr+ (Math.floor((toPosId+(ol+xr))/20)!==verticalId? 1:(ol+xr))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr + (Math.floor((toPosId+(ol+xr))/20)!==verticalId? 1:(ol+xr)) ].visibleOpacity +=opaLevels[4]
                        }


                        /////////////// left 

                        // walking left roots
                        if( 
                            Math.abs(fromPosId-toPosId)===1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + mapRoot - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[4]
                        }

                        for(let gradLev=2; gradLev<=3;gradLev++){
                        if( 
                            Math.abs(fromPosId-toPosId)===1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*gradLev - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + mapRoot*gradLev - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*gradLev- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot *gradLev- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[gradLev+3]
                        }
                       
                        if( 
                            Math.abs(fromPosId-toPosId)===1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*4 - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + mapRoot*4 - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*4- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot *4- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[6]
                        }

                        if( 
                            Math.abs(fromPosId-toPosId)===1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*5 - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + mapRoot*5 - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*5- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot *5- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[7]
                        }

                        ///////////////////////////
                        // walk down roots left
                        if( 
                            // Math.abs(fromPosId-toPosId)!==1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr - (Math.floor((toPosId-(ol+0))/20)!==verticalId? 1:(ol+0)) ] !== undefined
                            &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot*xr - (Math.floor((toPosId-(ol+0))/20)!==verticalId? 1:(ol+0))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr- (Math.floor((toPosId-(ol+0))/20)!==verticalId? 1:(ol+0))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr - (Math.floor((toPosId-(ol+0))/20)!==verticalId? 1:(ol+0)) ].visibleOpacity +=opaLevels[4]
                        }
                        if( 
                            // Math.abs(fromPosId-toPosId)!==1  &&  
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr - (Math.floor((toPosId-(ol+xr))/20)!==verticalId? 1:(ol+xr)) ] !== undefined
                            &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot*xr - (Math.floor((toPosId-(ol+xr))/20)!==verticalId? 1:(ol+xr))].visibleOpacity <=0.99){
                            
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr- (Math.floor((toPosId-(ol+xr))/20)!==verticalId? 1:(ol+xr))].isVisible = true
                            mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*xr - (Math.floor((toPosId-(ol+xr))/20)!==verticalId? 1:(ol+xr)) ].visibleOpacity +=opaLevels[4]
                        }

                    
                    }
                }
            }







//up side
for(let xr=0; xr<=3; xr++){
    // walking right roots
    if( 
        Math.abs(fromPosId-toPosId)===1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
    &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    - mapRoot + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[4]
    }

    for(let gradLev=2; gradLev<=3;gradLev++){
    if( 
        Math.abs(fromPosId-toPosId)===1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*gradLev + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
    &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    - mapRoot*gradLev + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*gradLev+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot *gradLev+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[gradLev+3]
    }
   
    if( 
        Math.abs(fromPosId-toPosId)===1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*4 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
    &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    - mapRoot*4 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*4+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot *4+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[6]
    }

    if( 
        Math.abs(fromPosId-toPosId)===1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*5 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
    &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    - mapRoot*5 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*5+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot *5+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[7]
    }

    ///////////////////////////
    // walk down roots right
    if( 
        // Math.abs(fromPosId-toPosId)!==1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr + (Math.floor((toPosId+(ol+0))/20)!==verticalId? 1:(ol+0)) ] !== undefined
        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot*xr + (Math.floor((toPosId+(ol+0))/20)!==verticalId? 1:(ol+0))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr+ (Math.floor((toPosId+(ol+0))/20)!==verticalId? 1:(ol+0))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr + (Math.floor((toPosId+(ol+0))/20)!==verticalId? 1:(ol+0)) ].visibleOpacity +=opaLevels[4]
    }
    if( 
        // Math.abs(fromPosId-toPosId)!==1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr + (Math.floor((toPosId+(ol+xr))/20)!==verticalId? 1:(ol+xr)) ] !== undefined
        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot*xr + (Math.floor((toPosId+(ol+xr))/20)!==verticalId? 1:(ol+xr))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr+ (Math.floor((toPosId+(ol+xr))/20)!==verticalId? 1:(ol+xr))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr + (Math.floor((toPosId+(ol+xr))/20)!==verticalId? 1:(ol+xr)) ].visibleOpacity +=opaLevels[4]
    }


    /////////////// left 

    // walking left roots
    if( 
        Math.abs(fromPosId-toPosId)===1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
    &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    - mapRoot - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[4]
    }

    for(let gradLev=2; gradLev<=3;gradLev++){
    if( 
        Math.abs(fromPosId-toPosId)===1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*gradLev - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
    &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    - mapRoot*gradLev - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*gradLev- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot *gradLev- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[gradLev+3]
    }
   
    if( 
        Math.abs(fromPosId-toPosId)===1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*4 - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
    &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    - mapRoot*4 - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*4- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot *4- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[6]
    }

    if( 
        Math.abs(fromPosId-toPosId)===1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*5 - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
    &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    - mapRoot*5 - (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*5- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot *5- (Math.floor((toPosId-(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[7]
    }

    ///////////////////////////
    // walk down roots left
    if( 
        // Math.abs(fromPosId-toPosId)!==1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr - (Math.floor((toPosId-(ol+0))/20)!==verticalId? 1:(ol+0)) ] !== undefined
        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot*xr - (Math.floor((toPosId-(ol+0))/20)!==verticalId? 1:(ol+0))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr- (Math.floor((toPosId-(ol+0))/20)!==verticalId? 1:(ol+0))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr - (Math.floor((toPosId-(ol+0))/20)!==verticalId? 1:(ol+0)) ].visibleOpacity +=opaLevels[4]
    }
    if( 
        // Math.abs(fromPosId-toPosId)!==1  &&  
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr - (Math.floor((toPosId-(ol+xr))/20)!==verticalId? 1:(ol+xr)) ] !== undefined
        &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot*xr - (Math.floor((toPosId-(ol+xr))/20)!==verticalId? 1:(ol+xr))].visibleOpacity <=0.99){
        
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr- (Math.floor((toPosId-(ol+xr))/20)!==verticalId? 1:(ol+xr))].isVisible = true
        mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*xr - (Math.floor((toPosId-(ol+xr))/20)!==verticalId? 1:(ol+xr)) ].visibleOpacity +=opaLevels[4]
    }


}
}
}




















                        // if( 
                        //     Math.abs(fromPosId-toPosId)!==1  &&  
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*2+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        //     &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot*2 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*2+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*2 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[5]
                        // }
                        // if( 
                        //     Math.abs(fromPosId-toPosId)!==1  &&  
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*3+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        //     &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot*3 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*3+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*3 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[6]
                        // }

                        // for(let gradLev=2; gradLev<=3;gradLev++){
                        // if( 
                        //     Math.abs(fromPosId-toPosId)===1  &&  
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*gradLev + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        // &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + mapRoot*gradLev + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*gradLev+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot *gradLev+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[gradLev+2]
                        // }

                        

                        // if( 
                        //     Math.abs(fromPosId-toPosId)===1  &&  
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*3 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ] !== undefined
                        // &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])    + mapRoot*3 + (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].visibleOpacity <=0.99){
                            
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*3+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3))].isVisible = true
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot *3+ (Math.floor((toPosId+(ol+3))/20)!==verticalId? 1:(ol+3)) ].visibleOpacity +=opaLevels[5]
                        // }
                    
                      

                        // //grad lev low right
                        // for(let gradLev=3; gradLev<=5;gradLev++){

                        //     if(
                        //      mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev+(Math.floor((toPosId+xr)/20)!==verticalId? 1:xr) ] !== undefined
                        //     && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *gradLev+(Math.floor((toPosId+xr)/20)!==verticalId? 1:xr) ].visibleOpacity <=0.99 ){
                        //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev+(Math.floor((toPosId+xr)/20)!==verticalId? 1:xr) ].isVisible = true
                        //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev+(Math.floor((toPosId+xr)/20)!==verticalId? 1:xr) ].visibleOpacity +=opaLevels[gradLev]
                        //     }
                        // }


                        //left 
                        // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-xr] !== undefined
                        // && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *ol-xr].visibleOpacity <=0.99 ){
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-xr].isVisible = true
                        //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-xr].visibleOpacity =1
                        // }

                        // // grad lev low left
                        // for(let gradLev=3; gradLev<=5;gradLev++){
                        //     if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev-xr] !== undefined
                        //     && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *gradLev-xr].visibleOpacity <=0.99 ){
                        //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev-xr].isVisible = true
                        //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev-xr].visibleOpacity +=opaLevels[gradLev]
                        //     }
                        // }
                    











                    

                    // right down

                    // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot +ol+3 ] !== undefined
                    // &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot +ol+3 ].visibleOpacity <=0.99){
                        
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot +ol +3].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot +ol +3].visibleOpacity +=opaLevels[3]
                    // }


                    // // //gade lev center right
                    // for(let gradLev=2; gradLev<=5;gradLev++){
                    //    if(mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot*gradLev +ol+3 ] !== undefined
                    //      &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot*gradLev +ol+3 ].visibleOpacity <=0.99){
                        
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])   + mapRoot*gradLev +ol +3].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])   + mapRoot*gradLev +ol +3].visibleOpacity +=opaLevels[3]
                    //     }
                    // }

       
                  
                 

                    //left 
                    // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot -ol-3 ] !== undefined
                    // &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot -ol-3 ].visibleOpacity <=0.99){
                        
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot -ol -3].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot -ol -3].visibleOpacity +=opaLevels[3]
                    // }

                    // // grad lev center left
                    // for(let gradLev=2; gradLev<=5;gradLev++){
                    //     if(mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot*gradLev -ol-3 ] !== undefined
                    //         &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  + mapRoot*gradLev -ol-3 ].visibleOpacity <=0.99){
                            
                    //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot*gradLev -ol -3].isVisible = true
                    //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot*gradLev -ol -3].visibleOpacity +=opaLevels[3]
                    //         }
                    // }

                    // for(let xr=0; xr<=2; xr++){
                    //     // right 
                    //     if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+xr] !== undefined
                    //     && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *ol+xr].visibleOpacity <=0.99 ){
                    //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+xr].isVisible = true
                    //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+xr].visibleOpacity =1
                    // }
                    //     //grad lev low right
                        // for(let gradLev=3; gradLev<=5;gradLev++){
                        //     if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev+xr] !== undefined
                        //     && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *gradLev+xr].visibleOpacity <=0.99 ){
                        //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev+xr].isVisible = true
                        //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev+xr].visibleOpacity +=opaLevels[gradLev]
                        //     }
                        // }
                    //     //left 
                    //     if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-xr] !== undefined
                    //     && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *ol-xr].visibleOpacity <=0.99 ){
                    //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-xr].isVisible = true
                    //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-xr].visibleOpacity =1
                    //     }

                    //     // grad lev low left
                    //     for(let gradLev=3; gradLev<=5;gradLev++){
                    //         if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev-xr] !== undefined
                    //         && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *gradLev-xr].visibleOpacity <=0.99 ){
                    //             mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev-xr].isVisible = true
                    //             mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *gradLev-xr].visibleOpacity +=opaLevels[gradLev]
                    //         }
                    //     }


                    // }

                    //up
                 
                    // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot +ol+3 ] !== undefined
                    // &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot +ol+3 ].visibleOpacity <=0.99){
                        
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot +ol +3].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot +ol +3].visibleOpacity +=opaLevels[3]
                    // }
                    // for(let gradLev=2; gradLev<=5;gradLev++){
                    //    if(mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot*gradLev +ol+3 ] !== undefined
                    //      &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*gradLev +ol+3 ].visibleOpacity <=0.99){
                        
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot*gradLev +ol +3].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot*gradLev +ol +3].visibleOpacity +=opaLevels[3]
                    //     }
                    // }
                    // //left 
                  
                    // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot -ol-3 ] !== undefined
                    // &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot -ol-3 ].visibleOpacity <=0.99){
                        
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot -ol -3].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot -ol -3].visibleOpacity +=opaLevels[3]
                    // }
                    // for(let gradLev=2; gradLev<=5;gradLev++){
                    //    if(mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot*gradLev -ol-3 ] !== undefined
                    //      &&mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])  - mapRoot*gradLev -ol-3 ].visibleOpacity <=0.99){
                        
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot*gradLev -ol -3].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot*gradLev -ol -3].visibleOpacity +=opaLevels[3]
                    //     }
                    // }
                    // for(let xr=0; xr<=2; xr++){
                    //     // right 
                    //     if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *ol+xr] !== undefined
                    //     && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) - mapRoot *ol+xr].visibleOpacity <=0.99 ){
                    //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *ol+xr].isVisible = true
                    //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *ol+xr].visibleOpacity =1
                    //     }
                    //     for(let gradLev=3; gradLev<=5;gradLev++){
                    //         if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *gradLev+xr] !== undefined
                    //         && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) - mapRoot *gradLev+xr].visibleOpacity <=0.99 ){
                    //             mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *gradLev+xr].isVisible = true
                    //             mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *gradLev+xr].visibleOpacity +=opaLevels[gradLev]
                    //         }
                    //     }
                    //     //left 
                    //     if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *ol-xr] !== undefined
                    //     && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) - mapRoot *ol-xr].visibleOpacity <=0.99 ){
                    //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *ol-xr].isVisible = true
                    //         mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *ol-xr].visibleOpacity =1
                    //     }
                    //     for(let gradLev=3; gradLev<=5;gradLev++){
                    //         if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *gradLev-xr] !== undefined
                    //         && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) - mapRoot *gradLev-xr].visibleOpacity <=0.99 ){
                    //             mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *gradLev-xr].isVisible = true
                    //             mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])- mapRoot *gradLev-xr].visibleOpacity +=opaLevels[gradLev]
                    //         }
                    //     }


                    // }

                    



                    //rightdown

                    // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+ol+ol+(1*ol)] !== undefined
                    // && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *ol+ol+ol+(1*ol)].visibleOpacity <=0.99 ){
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+ol+ol+(1*ol)].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+ol+ol+(1*ol)].visibleOpacity  +=0.01
                    // }

                    // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+ol+(1*ol)] !== undefined
                    // && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *ol+ol+(1*ol)].visibleOpacity <=0.99 ){
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+ol+(1*ol)].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+ol+(1*ol)].visibleOpacity  +=0.01
                    // }
            

                    // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+(1*ol) ] !== undefined
                    // && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *ol+(1*ol) ].visibleOpacity <=0.99 ){
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol+(1*ol) ].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol +(1*ol)].visibleOpacity  +=0.01
                    // }
                    

                    /// leftdown
                    // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-ol-ol-(1*ol)] !== undefined
                    // && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *ol-ol-ol-(1*ol)].visibleOpacity <=0.99 ){
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-ol-ol-(1*ol)].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-ol-ol-(1*ol)].visibleOpacity  +=0.01
                    // }

                    // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-ol-(1*ol)] !== undefined
                    // && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *ol-ol-(1*ol)].visibleOpacity <=0.99 ){
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-ol-(1*ol)].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-ol-(1*ol)].visibleOpacity  +=0.01
                    // }
                  
                
                    // if( mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-(1*ol) ] !== undefined
                    // && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1]) + mapRoot *ol-(1*ol) ].visibleOpacity <=0.99 ){
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-(1*ol) ].isVisible = true
                    //     mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+ mapRoot *ol-(1*ol) ].visibleOpacity  +=0.01
                    // }
              
                }
            }




            ///////reset wanna talk and related
            // we need to end interaction WITH and not global
            // not only player can break interaction !!
            if(this.wannaTalk===true ||this.charName === chars["player"].inTouchWith){
                //need to know on which tile was triggered wannaTalk to
                if(mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+1].hasNPC===false
                && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])-1].hasNPC===false
                && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+mapRoot].hasNPC===false
                && mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])-mapRoot].hasNPC===false){
                    // console.log("ending any interaction 1")
                    this.inTouchWith = ""
                    this.coinTaken = false
                    chars["player"].wannaTalk = false
               
                    // this is just walking away so there is no interaction ..it's just in touch//next to
                    // chars["player"].endInteraction(chars)
                }
            }

            /// recheck wannaTalk and related for NPC or Player
            // check NPc point of view and player point of view
            if(mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+1].hasNPC===true){
                // has NPC can be NPC or player but we get its anme
                name =mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+1].npcName
                // name is player and is with someone, I souhldn't interupt but if he is alone I can interact)
                //npc pov
                // console.log(`${name} and ${chars["player"].inTouchWith.length}`)
                if(name ==="player" && chars["player"].inTouchWith.length===0){
                    chars["player"].wannaTalk = true
                    chars["player"].inTouchWith = this.charName  
                    if(chars["player"].inTouchWith.slice(0,5) ==="enemy" && chars["player"].coinTaken ===false){
                        chars["player"].coinTaken = true
                        chars["player"].takeCoins(1)
                    }
                }
                //player pov
                if(this.charName==="player" && this.inTouchWith.length===0){
                    chars["player"].wannaTalk = true
                    this.inTouchWith = name

                    if(this.inTouchWith.slice(0,5) ==="enemy" && this.coinTaken ===false){
                        this.coinTaken = true
                        this.takeCoins(1)
                    }
                    
                }else if(this.charName.slice(0,5) ==="enemy" && this.inTouchWith.length>0){
                    this.endInteraction(chars)
                    chars["player"].wannaTalk = true
                    this.inTouchWith = name
                }
            }

            if(mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])-1].hasNPC===true){
                // has NPC can be NPC or player but we get its anme
                name =mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])-1].npcName
                // name is player and is with someone, I souhldn't interupt but if he is alone I can interact)
                //npc pov
                if(name ==="player" && chars["player"].inTouchWith.length===0){
                    chars["player"].wannaTalk = true
                    chars["player"].inTouchWith = this.charName
                    if(chars["player"].inTouchWith.slice(0,5) ==="enemy" && chars["player"].coinTaken ===false){
                        chars["player"].coinTaken = true
                        chars["player"].takeCoins(1)
                    }
                }
                //player pov
                if(this.charName==="player" && this.inTouchWith.length===0){
                    chars["player"].wannaTalk = true
                    this.inTouchWith = name
                    if(this.inTouchWith.slice(0,5) ==="enemy"&& this.coinTaken ===false){
                        this.coinTaken = true
                        this.takeCoins(1)
                    }
                }else if(this.charName==="player" && this.inTouchWith.length>0){
                    this.endInteraction(chars)
                    chars["player"].wannaTalk = true
                    this.inTouchWith = name
                   
                }
            }
            if(mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+mapRoot].hasNPC===true){
                 // has NPC can be NPC or player but we get its anme
                 name =mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])+mapRoot].npcName
                 // name is player and is with someone, I souhldn't interupt but if he is alone I can interact)
                 //npc pov
                if(name ==="player" && chars["player"].inTouchWith.length===0){
                    chars["player"].wannaTalk = true
                     chars["player"].inTouchWith = this.charName  
                     if(chars["player"].inTouchWith.slice(0,5) ==="enemy" && chars["player"].coinTaken ===false){
                        chars["player"].coinTaken = true
                        chars["player"].takeCoins(1)
                    } 
                }
                //player pov
                if(this.charName==="player" && this.inTouchWith.length===0){
                    chars["player"].wannaTalk = true
                    this.inTouchWith = name
                    if(this.inTouchWith.slice(0,5) ==="enemy" && this.coinTaken ===false){
                        this.coinTaken = true
                        this.takeCoins(1)
                    }
                }else if(this.charName==="player" && this.inTouchWith.length>0){
                    this.endInteraction(chars)
                    chars["player"].wannaTalk = true
                    this.inTouchWith = name
                }
            }
            if(mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])-mapRoot].hasNPC===true){
                // has NPC can be NPC or player but we get its anme
                name =mapTileData.map[toIndex(this.tileTo[0],this.tileTo[1])-mapRoot].npcName
                // name is player and is with someone, I souhldn't interupt but if he is alone I can interact)
                //npc pov
                if(name ==="player" && chars["player"].inTouchWith.length===0){
                    chars["player"].wannaTalk = true
                    chars["player"].inTouchWith = this.charName
                    if(chars["player"].inTouchWith.slice(0,5) ==="enemy" && chars["player"].coinTaken ===false){
                        chars["player"].coinTaken = true
                        chars["player"].takeCoins(1)
                    }
                }
                //player pov
                if(this.charName==="player" && this.inTouchWith.length===0){
                    chars["player"].wannaTalk = true
                    this.inTouchWith = name
                    if(this.inTouchWith.slice(0,5) ==="enemy" && this.coinTaken ===false){
                        this.coinTaken = true
                        this.takeCoins(1)
                    }
                }else if(this.charName==="player" && this.inTouchWith.length>0){
                    this.endInteraction(chars)
                    chars["player"].wannaTalk = true
                    this.inTouchWith = name
                }
            }

            
            //we know it's moving now 
            // moveSpeed depends of the tile the Char is on 

            // var moveSpeed = this.delayMove[tileTypes[this.mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].type].floor];
            var moveSpeed = 200

            //moveSpeed replaces old single Delay move
            // check if time moving passed the delay move
            if(t-this.timeMove> moveSpeed){
                // console.log("map",this.mapTileData.map)
                this.placeAt(this.tileTo[0], this.tileTo[1])
              
                //#11
                if(this.mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter!==null){
                    this.mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter(this);
                }

                     
            }
            else{
                //then it meanins it's sill moving
                // check the positions
                this.position[0] = (this.tileFrom[0] * gs.tileSize) + ((gs.tileSize-this.dimension[0])/2);
                this.position[1] = (this.tileFrom[1] * gs.tileSize) + ((gs.tileSize-this.dimension[1])/2);
                // check if moving on x + udpated
                // check if moving on y + update
                //roundup
                // check if moving on x axis
                if(this.tileTo[0] != this.tileFrom[0]){
                    var diff = (gs.tileSize / moveSpeed) * (t-this.timeMove) ; //ex100: moves 0.5 * x 1s/120n-1s/120n+1
                    this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
                }
            // check if moiving on y axis
                if(this.tileTo[1] != this.tileFrom[1]){
                    var diff = (gs.tileSize/ moveSpeed) * (t-this.timeMove);
                    this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
                }
            //After we've updated the position, we'll round the x and y values to the nearest whole number - this helps to smooth the drawing on our Canvas:
                this.position[0] = Math.round(this.position[0])+ this.positionCorrectionX;
                this.position[1] = Math.round(this.position[1])+ this.positionCorrectionY;

             
                
            }
            return true; // yes th  e character is currently moving 
        }

        this.canMoveTo = function(x, y){
            // if out of bound and next floorType not walkable return false
            if(x < 0 || x >= gs.nTileW || y < 0 || y >= gs.nTileH){ return false; }
            // if the tile does not exist in dalay move it means it cannot move on 
            
            if(this.mapTileData.map[toIndex(x,y)].walkable===false){ 
                // console.log("trying to move", )
                return false; 
            }
            // if(typeof this.delayMove[tileTypes[this.mapTileData.map[toIndex(x,y)].type].floor]=='undefined'){ 
            //     return false; 
            // }

                if(mapTileData.map[toIndex(x,y)].object!=null){
                    var o = mapTileData.map[toIndex(x,y)].object;
                    if(o!=null){
                        if(gs.objectTypes[o.type].collision==objectCollision.solid){
                            return false;
                        }
                    }
                }
                
                if(!this.allowedToMove){
                    return false
                }
    
                //if next tile has npc then can't go
                if(mapTileData.map[toIndex(x,y)].hasNPC === true){
                    return false;
                }
                // if next is false, i set to true so it's mine then I can still move
                if(mapTileData.map[toIndex(x,y)].hasNPC === false){
                    mapTileData.map[toIndex(x,y)].hasNPC = true
                    return true;
                }


            return true;
        }

        // checks for the processMovements
        this.canMoveUp		= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]-1); };
        this.canMoveDown 	= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]+1); };
        this.canMoveLeft 	= function() { return this.canMoveTo(this.tileFrom[0]-1, this.tileFrom[1]); };
        this.canMoveRight 	= function() { return this.canMoveTo(this.tileFrom[0]+1, this.tileFrom[1]); };


        //#7 
        // this.canMoveDirection = function(d) {
        //     // used in processMovement
        //     // takes a direction value then check if can move
        //     switch(d)
        //     {
        //         case gs.directions.up:
        //             return this.canMoveUp();
        //         case gs.directions.down:
        //             return this.canMoveDown();
        //         case gs.directions.left:
        //             return this.canMoveLeft();
        //         default:
        //             return this.canMoveRight();
        //     }
        // };

        this.GuidingEvents=(moveEvent:string, move:string, t:number, msg_for:string,tileTo:number[], direction:number)=>{
            // caracter guides the other character
            // console.log('calling guide')
            this.privateRoomClient.send(JSON.stringify({
                command: moveEvent,
                move: move,
                tileTo: tileTo,
                tileFrom: this.tileFrom,
                msg_for: msg_for,
                time: t,
                direction: direction
       

                }))

          }


        this.moveLeft	= function(t) { 
            
            this.tileTo[0]-=1; this.timeMove = t; this.direction = gs.directions.left; 
            if(this.playMode==="ctlmode"){
                // force tileTo, if same no issues, if not , forced
                this.GuidingEvents("stage_5", "moveLeft",t, this.charName, this.tileTo, this.direction)
            
            }
            
        };
        this.moveRight	= function(t) { 
            this.tileTo[0]+=1; this.timeMove = t; this.direction = gs.directions.right; 
            if(this.playMode==="ctlmode"){
                // console.log("this.playMode", this.playMode)
            this.GuidingEvents("stage_5", "moveRight",t,this.charName,this.tileTo, this.direction)
            }
        };
        this.moveUp		= function(t) { 
            this.tileTo[1]-=1; this.timeMove = t; this.direction = gs.directions.up; 
            if(this.playMode==="ctlmode"){
                this.GuidingEvents("stage_5", "moveUp",t, this.charName,this.tileTo, this.direction)

            }
        };
        this.moveDown	= function(t) { 
            this.tileTo[1]+=1; this.timeMove = t; this.direction = gs.directions.down;
            if(this.playMode==="ctlmode"){
                this.GuidingEvents("stage_5", "moveDown",t, this.charName,this.tileTo, this.direction)

            }
        };

        // if not moving, everyone is automatically standing
        this.standingUp	= function(t) {
             this.tileTo[0]+=0; 
             this.timeMove = t; 
             this.direction = gs.directions.standingUp; 
             if(this.playMode==="ctlmode"){

                //  this.GuidingEvents("stage_5", "standingUp",t, this.charName)
             }
            };
        this.standingDown	= function(t) { 
            this.tileTo[0]+=0; 
            this.timeMove = t; 
            this.direction = gs.directions.standingDown; 
            if(this.playMode==="ctlmode"){
                
                // this.GuidingEvents("stage_5", "standingDown",t, this.charName)
            }
        };
        this.standingRight	= function(t) { 
            this.tileTo[0]+=0; 
            this.timeMove = t; 
            this.direction = gs.directions.standingRight; 
            if(this.playMode==="ctlmode"){
                
                // this.GuidingEvents("stage_5", "standingRight",t, this.charName)
            }
        };
        this.standingLeft	= function(t) { 
            this.tileTo[0]+=0; 
            this.timeMove = t; 
            this.direction = gs.directions.standingLeft; 
            if(this.playMode==="ctlmode"){
                
                // this.GuidingEvents("stage_5", "standingLeft",t, this.charName)
            }
        };

        //    //here needs the wsMovement
        //    if(this.charName==="player"){

        //     this.GuidingEvents("stage_5", this.position)
        // }



        //#7.2
        // this.moveDirection = function(d, t) {
        //     switch(d)
        //     {
        //         case gs.directions.up:
        //             return this.moveUp(t);
        //         case gs.directions.down:
        //             return this.moveDown(t);
        //         case gs.directions.left:
        //             return this.moveLeft(t);
        //         default:
        //             return this.moveRight(t);
        //     }
        // };

        // #13 trying to pick items on the floor
        this.pickUp = function(){

            // first check if the char is moving 
            if(this.tileTo[0]!=this.tileFrom[0] ||
                this.tileTo[1]!=this.tileFrom[1]){
                return false;
            }

            // check for secret
            
            if( mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].hasSecret === true){
                // found secret
                
                // at some point I will have to distinguish types of secrets / mission / money / etc
                this.newFoundSecret =  mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].secretObj.id

                console.log("secrets???", this.newFoundSecret)

                for(var msId=0; msId<this.missionsObjList.length; msId++){
                    console.log("-------------------",this.missionsObjList[msId])
                    if(this.missionsObjList[msId].id === this.newFoundSecret){
                        
                        // this.missionsObjList.push(mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].secretObj)
                        this.missionsObjList[msId].found = true
                        this.soundPlayer.pickUpPlay()
                        mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].hasSecret = false
                        mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].secretObj = {}
                        this.isSurprised = false
                        console.log("secrets", this.missionsObjList)
                    }
                }
                // if(!this.missionsObjList.includes(this.newFoundSecret)){


                //     this.missionsObjList.push(this.newFoundSecret)
                //     mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].hasSecret = false
                //     mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].secretObj = {}
                //     this.isSurprised = false
                //     console.log("secrets", this.missionsObjList)

                // }
               
                if(this.showingIbox===true){
                    if(this.ctxI === null){return false}
                    // this.iBox.drawIbox(this.ctxI, ["hey"])    
                }


                // thinking that secret objects can be complex objs tooo
                // open the iBox to show it's in
            }
            
            // item stack
            var is = mapTileData.map[toIndex(this.tileFrom[0],
                        this.tileFrom[1])].itemStack;
            
            if(is!=null){
                let remains = this.inventory.addItems(is.type, is.qty);
        
                if(remains){ 
                    is.qty = remains; 
                }else{
                    mapTileData.map[toIndex(this.tileFrom[0],
                        this.tileFrom[1])].itemStack = null;
                }
            }
            
            return true;
        };

        


    }
}






