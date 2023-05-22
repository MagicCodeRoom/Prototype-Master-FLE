
import cat from "../../images/quests/cat.png"



export default class ImageLoader{
    missionsList: string[]=[]
    createImage:()=>void

    constructor(){
        this.missionsList =["cat"]
        this.createImage=function(){
            var missionImg:any , lockPngLoaded = false
              
            missionImg = new Image();
            missionImg.onerror = function(){
                // ctx = null;
                alert("Failed loading tileset.");
            };
            missionImg.onload = function(){ 
                lockPngLoaded = true
             };
            missionImg.src = import("../../images/quests/fraise.png");

        }



    }
}