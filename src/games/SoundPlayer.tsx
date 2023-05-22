
// import coinSound from "../sounds/coin.mp3"


export default class SoundPlayer{

    gainCoin: HTMLAudioElement
    looseCoin :HTMLAudioElement
    gainCoinPlay:()=>void
    looseCoinPlay:()=>void

    pickUp:HTMLAudioElement
    pickUpPlay:()=>void

    singleType:HTMLAudioElement
    singleTypePlay:()=>void


    windowSound:HTMLAudioElement
    windowSoundPlay :()=>void

    interact:HTMLAudioElement
    interactPlay :()=>void
    constructor(){

        this.gainCoin = new Audio(require("../sounds/coin.mp3"))
        this.gainCoinPlay=function(){
            this.gainCoin.play()
        }

        this.looseCoin = new Audio(require("../sounds/coinFall.wav"))
        this.looseCoinPlay=function(){
            this.looseCoin.play()
        }

        this.pickUp= new Audio(require("../sounds/pickUp.wav"))
        this.pickUpPlay=function(){
            this.pickUp.play()
        }

        this.singleType= new Audio(require("../sounds/type.wav"))
        this.singleTypePlay=function(){
            this.singleType.play()
        }

        this.windowSound= new Audio(require("../sounds/window.wav"))
        this.windowSoundPlay=function(){
            this.windowSound.play()
        }

        this.interact = new Audio(require("../sounds/interact.wav"))
        this.interactPlay=function(){
            this.interact.play()
        }


    }
}