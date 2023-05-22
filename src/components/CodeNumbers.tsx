



export default class CodeNumbers {

    code1:number
    code2:number
    returnCodeObj:()=>void
    resetCodes:()=>void


    constructor(){
        this.code1 = 0
        this.code2 = 0
    
    this.resetCodes = function(){
        this.code1 = 0
        this.code2 = 0
    }
    this.returnCodeObj=function(){
        this.code1 = Math.floor(Math.random()*1000)
        this.code2 = Math.floor(Math.random()*1000)

    }


    }
}