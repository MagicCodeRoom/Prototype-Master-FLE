


import cat from "../images/quests/cat.png"

export default class iBox{

    tester:string
    ctxI: CanvasRenderingContext2D | null
    missions : string[]=[] ;
    drawIbox:(ctxI:CanvasRenderingContext2D, missions:string[])=>void

    closeIbox:()=> void
    constructor(){


        this.tester = "bluewhitered"
        this.ctxI = null
        this.missions = [""]

        this.drawIbox=function(ctxI:CanvasRenderingContext2D, missions:string[]=[]){
            this.ctxI = ctxI
            this.missions = missions
            ctxI.fillStyle = "white";
            ctxI.strokeStyle = "pink";
            ctxI.beginPath();

            ctxI.roundRect(0, 0, 400, 400, 5);
            ctxI.fill();
            ctxI.stroke();

            ctxI.lineWidth = 1;
            ctxI.fillStyle = "black";
            ctxI.strokeStyle = "black";
            ctxI.font ="30px Arial"
            ctxI.fillText(this.missions[0], 10, 10)



            var missionImg:any , lockPngLoaded = false

            missionImg = new Image();
            missionImg.onerror = function(){
                // ctx = null;
                alert("Failed loading tileset.");
            };
            missionImg.onload = function(){ 
                lockPngLoaded = true
             };
            missionImg.src = cat;
            // for(var i=0; i<this.missions.length){

            ctxI.drawImage(missionImg,50 ,50 ,40, 40)

            // }




            
        }

        this.closeIbox = function(){
            console.log("closing box??ne")
            this.ctxI?.clearRect(0, 0, 400, 400)
            this.ctxI = null

        }

        // draw on ctxI

    return 
    }
}