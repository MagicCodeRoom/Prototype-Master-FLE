import { time } from "console";
import Character from "./Character";

interface Chars{[key:string]:Character}


export default class DialogueBox{
    chars : Chars

    texter : {[key:number]:string}={};
    translation: string;
    translate: boolean
    LockTransReset: boolean
    speechEnded : boolean
    
    typingInterval :number;// in milliseconds
    maxWidth :number; // Max width of text within the dialogue box
    lineHeight :number;// Height of each line of text
    x :number; // X-coordinate of text within the dialogue box
    y:number; // Y-coordinate of text within the dialogue box
    intervalTime :number
    typingIndex :number
    currentLine : string
    lineWidth:number
    lines : string[]
    lineInd: number
    wordInd:number
    wordWCount: number
    totIndexes : number
    boxPacer : number
    boxPacerLock : number

    txtInd:number

    handleTxt:( gameTime:number, ctxD:CanvasRenderingContext2D, txt:{})=> void
    endDial :(ctxD:CanvasRenderingContext2D)=> void
    type:(ctxD:CanvasRenderingContext2D, txt:string)=>void
    erase: (ctxD:CanvasRenderingContext2D)=>void

    // textCutter:(ctxD:CanvasRenderingContext2D)=>void

    constructor(chars:Chars){
        this.chars = chars
        this.texter = {}

        this.txtInd = 0

        this.translation =""
        this.translate = false
        this.LockTransReset = false
        this.speechEnded = false


        this.typingInterval = 0.05; // in milliseconds
        this.intervalTime =0
        this.maxWidth = 300; // Max width of text within the dialogue box
        this.lineHeight = 20; // Height of each line of text
        this.x = 20; // X-coordinate of text within the dialogue box
        this.y = 30; // Y-coordinate of text within the dialogue box

        this.typingIndex = 0
        this.currentLine =""
        this.lineWidth = 0
        this.lines = [""]
        this.lineInd = 0

       


        this.totIndexes = 0
        this.boxPacer = 0
        this.boxPacerLock = 40

        this.wordInd = 0
        this.wordWCount = 0

        this.type=function(ctxD, txt){
            // keep it to the text length
            
            if (this.translate===false && this.totIndexes< txt.length) {
                this.totIndexes ++
                this.lineWidth = ctxD.measureText(this.lines[this.lineInd]).width;
                var wordList = txt.split(" ")
                var wordWidth = ctxD.measureText(wordList[this.wordInd]).width;

                if(this.wordWCount+wordWidth<this.maxWidth){
                    // console.log(">",this.wordWCount+wordWidth)
                    // add to line
                    if(wordList[this.wordInd][this.typingIndex]!=undefined){//check if word still has letter
                        this.lines[this.lineInd] += wordList[this.wordInd][this.typingIndex]
                        this.typingIndex ++
                        
                    }else{
                        //finished tipying a word
                        this.wordInd ++
                        this.wordWCount += wordWidth
                        this.typingIndex = 0
                        this.lines[this.lineInd] += " "
                    }
                    // but i need to change word once the word is type
                }else{
                    // add a line
                    this.wordWCount =0
                    this.lineInd += 1
                    this.lines[this.lineInd]=""
                }
                // box pacing down lock
                if(this.lineHeight*this.lineInd>this.boxPacerLock){
                    this.boxPacer += this.lineHeight
                    this.boxPacerLock += this.lineHeight
                }
              

            }else if(this.txtInd < Object.keys(this.texter).length-1){
                //end of texter
                console.log("end of texter")
                // this.translate = true
                this.txtInd ++
                this.wordWCount =0
                this.lineInd += 1
                this.lines[this.lineInd]=""
                wordList = []
                this.wordInd =0
                this.totIndexes =0
                this.typingIndex =0
                this.wordWCount = 0
                this.LockTransReset = true
            }
            // translate
            // if (this.translate===true && this.totIndexes< this.translation.length) {
            //     this.totIndexes ++
            //     this.lineWidth = ctxD.measureText(this.lines[this.lineInd]).width;
            //     wordList = this.translation.split(" ")
            //     wordWidth = ctxD.measureText(wordList[this.wordInd]).width;

            //     if(this.wordWCount+wordWidth<this.maxWidth){
            //         console.log(">",this.wordWCount+wordWidth)
            //         // add to line
            //         if(wordList[this.wordInd][this.typingIndex]!=undefined){//check if word still has letter
            //             this.lines[this.lineInd] += wordList[this.wordInd][this.typingIndex]
            //             this.typingIndex ++
            //         }else{
            //             //finished tipying a word
            //             this.wordInd ++
            //             this.wordWCount += wordWidth
            //             this.typingIndex = 0
            //             this.lines[this.lineInd] += " "
            //         }
            //         // but i need to change word once the word is type
            //     }else{
            //         // add a line
            //         this.wordWCount =0
            //         this.lineInd += 1
            //         this.lines[this.lineInd]=""
            //     }
            //     // box pacing down lock
            //     if(this.lineHeight*this.lineInd>this.boxPacerLock){
            //         this.boxPacer += this.lineHeight
            //         this.boxPacerLock += this.lineHeight
            //     }

            // }else{
                
            //     this.speechEnded = true

                
            // }
            // if(this.speechEnded ===true){
                
            //     this.chars["player"].anserBox()
                
            // }
        }

        // this.handleAnswers= function(gameTime:number,ctxD:CanvasRenderingContext2D,txt :{}){
        //     // we shoud be able to type two textes or more
        // }

        this.erase= function(ctxD:CanvasRenderingContext2D){
            this.chars = chars
            this.texter = {}
    
            this.txtInd = 0
    
            this.translation =""
            this.translate = false
            this.LockTransReset = false
            this.speechEnded = false
    
    
            this.typingInterval = 0.05; // in milliseconds
            this.intervalTime =0
        
            this.typingIndex = 0
            this.currentLine =""
            this.lineWidth = 0
            this.lines = [""]
            this.lineInd = 0
            this.totIndexes = 0
            this.boxPacer = 0
            this.boxPacerLock = 40
    
            this.wordInd = 0
            this.wordWCount = 0


            console.log("errasing")
            ctxD.fillStyle = "white";
            ctxD.strokeStyle = "pink";

            // ctxD.beginPath();

            // ctxD.roundRect(0, 0, 400, 80+this.boxPacer, 5);
            // ctxD.fill();
            // ctxD.stroke();

            ctxD.clearRect(0, 0,ctxD.canvas.width, ctxD.canvas.height )
            ctxD.lineWidth = 1;
            ctxD.fillStyle = "black";
            ctxD.strokeStyle = "black";

        }

    
        this.handleTxt= function(gameTime:number,ctxD:CanvasRenderingContext2D,txt:{}){
            

            this.texter = txt
           
            // this.translation = 

            if(true){
                // ctxD.lineWidth = 5;
                ctxD.fillStyle = "white";
                ctxD.strokeStyle = "pink";
                ctxD.beginPath();

                ctxD.roundRect(0, 0, 400, 80+this.boxPacer, 5);
                ctxD.fill();
                ctxD.stroke();

                ctxD.lineWidth = 1;
                ctxD.fillStyle = "black";
                ctxD.strokeStyle = "black";
             
                // this.type()
                ctxD.fillStyle ="black"
                ctxD.font = "15px Arial";
                ctxD.direction = "inherit" // ou ltr
            
                // the you can draw each of them
                this.lines.forEach((line,index)=>{
                    ctxD.fillText(this.lines[index],this.x, this.y+this.lineHeight*index);
                    
                })
                
                // Must reset to not affect other drawings
                ctxD.lineWidth = 1;
                ctxD.fillStyle = "black";
                ctxD.strokeStyle = "black";
                gameTime = Date.now()
                if((gameTime/1000)-this.intervalTime>=this.typingInterval){
                    this.intervalTime = gameTime/1000
                    this.type(ctxD, this.texter[this.txtInd])
                
                    // console.log("dialing", gameTime/1000)
                }

            }else{
                this.texter =""
                ctxD.fillStyle ="black"
                ctxD.font = "15px Arial";
                ctxD.direction = "ltr"
                
            }


        }

        this.endDial = function(ctxD:CanvasRenderingContext2D){
            ctxD.clearRect(0, 0,ctxD.canvas.width, ctxD.canvas.height )
        }

    }
   
}