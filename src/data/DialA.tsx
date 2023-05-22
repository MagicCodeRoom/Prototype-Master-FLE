

interface DialogueLine {[key:string]:{[key:number]:{
    text: string;
    trans: string
    options: {[key:string]:{text: string;nextLine: number}}
        }
    }
}
  
  export const DialA: DialogueLine = {
    npcExplorer:{1: {text: "Tu as vu mon chat ",
                    trans: "你看到了我的喵喵吗🐱",
                    options:{1:{text: "ok",nextLine: 1},2:{text: "non",nextLine: 2}}}},
    npcC:{1: {text: "J'ai faim! Tu peux m'acheter une part de gateau?",
                trans: "我饿了！你可以买给我一份蛋糕吗",
                options:{1:{text: "ok",nextLine: 1},2:{text: "non",nextLine: 2}}}}       
                
    }
        


  