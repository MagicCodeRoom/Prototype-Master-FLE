import { useEffect } from "react";
import Character from "./Character";
import { numToLetter } from "../components/NumToLetters";
import actiondialsC from "../games/actiondialsNpcC.json";

interface DialObj {
    npc:{},
    mpc:{},
    nextDial:{code:number|string, nextId: number }[]
    action: string,
    unlock: string | null,
    deviator: number,
    reward: number | null,
    penalty: number | null,
    reconnect:number | null

}

enum AcceptStatus {
        neutral,
        accepted,
        refused
      }

interface Chars{[key:string]:Character}

export default class ActionTree {
    // rx:number;
    // mx:number;
    // branch: number
    setOfActions: any
    charName: string
    MpcName : string
    // didAccept: AcceptStatus 
    chars : Chars
    // goToId : number
    pokeNpc: (npcName:string)=> DialObj
    // accept: (player:{[key:string]:Character})=> void
    // refuse:()=> void

    codeValidation: (codeInput:number|string)=>void



    constructor(charName:string, chars:Chars){
        this.charName =charName
        this.chars = chars
        this.MpcName = ""
        var goToId = 0
        var breakId = 88
        var reconnectOnId =0
        var id = 0
        // this is running on both sides oK!!
        this.codeValidation= function(codeInput){
            // console.log("codeInput", codeInput)
            let options = this.chars["player"].nextDial  // [{code: xxxx, next: 40 }, ....]
            
            for(var i = 0; i<options.length; i++ ){
                console.log( options[i].code, "and ", codeInput)
                if (options[i].code == codeInput.toString()){
                    if(options[i].nextId != 88){
                        goToId = options[i].nextId
                        console.log("goto",goToId)
                        // this.chars["player"].interacting(chars)
                        if(codeInput===99){
                            chars["player"].addCoins(10,chars)
                        }
                    }else{

                        if(chars["player"].inTouchWith==="npcC"){
                            goToId = chars["player"].reconnect.npcC
    
                        }
                        if(chars["player"].inTouchWith==="npcExplorer"){
                            goToId = chars["player"].reconnect.npcExplorer
    
                        }
                        

                        chars["player"].endInteraction(chars)
                        // chars["player"].wsInteractionEnder(chars)

                    }

                    // 
                }
            }
            
        }
        
      

        this.pokeNpc=function(npcName:string){
            // console.log("poking", actiondialsC[0])
            // this.didAccept = 0
            // if(goToId === 10){

            //     return 
            // }else{


            return this.setOfActions[npcName][goToId]
            // }
            // this.setOfActions[this.rx][this.mx]
            
        }

        const checkMissions=(missionId:string)=>{
            for(var msId=0; msId< chars["player"].missionsObjList.length; msId++){
                if(chars["player"].missionsObjList[msId].id === missionId){
                    return true
                }
            }
            return false
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
            console.log("concateded", letters)
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
        console.log("randomized", letters)
        return letters
        }

        


        this.setOfActions={
            // échange type "première rencontre"
            "npcP":{
                "0": {
                    "npc": {"0": "Il faut 30 euros pour passer."},
                    "mpc": {
                        "0": "• Je n'ai pas 30 euros 😭😭!",
                        "1": `code:${numToLetter(123)}`,
                        "2": "• voici les 30 euros!",
                        "3": `code:${numToLetter(456)}`
                    },
                    "nextDial": [{"code":"123", "nextId": 88}, {"code":"456", "nextId": 1}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "1": {
                    "npc": {"0": "ok, c'est bon"},
                    "mpc": {
                        "0": "• merci",
                        "1": `code:${numToLetter(123)}`,
                        "2": "• aurevoir",
                        "3": `code:${numToLetter(456)}`
                    },
                    "nextDial": [{"code":"123", "nextId": 88}, {"code":"456", "nextId": 88}],
                    "action": null,
                    "unlock": "P",
                    "deviator": null,
                    "reward": null,
                    "penalty": 30,
                    "reconnect": null
                },


                "88": {
                    "npc": {"0": "Désolé, tu as perdu."},
                    "mpc": {
                        "0": "• ...",
                        "1": "• mais pourquoi ?"
                    },
                    "nextDial": null,
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                }

            },
            "npcExplorer":{
                    "0": {
                        "npc": {"0": "Bonjour."},
                        "mpc": {
                            "0": "• Qui es-tu ?",
                            "1": `code:${numToLetter(123)}`,
                            "2": "• passer directement aux question ",
                            "3": `code:${numToLetter(456)}`
                        },
                        "nextDial": [{"code":"123", "nextId": 1}, {"code":"456", "nextId": 5}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": null,
                        "penalty": null,
                        "reconnect": null
                    },
                    "1": {
                        "npc": {"0": "Je suis le gardien de la porte."},
                        "mpc": {
                            "0": "• Comment puis-je ouvrir la porte ?",
                            "1": `code:${numToLetter(234)}`,
                            "2": "• Dis-moi comment ouvrir cette porte ?",
                            "3": `code:${numToLetter(567)}`
                        },
                        "nextDial": [{"code":"234", "nextId": 2}, {"code":"567", "nextId": 2}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": null,
                        "penalty": null,
                        "reconnect": null
                    },
                    "2": {
                        "npc": {"0": "Tu dois passer le test."},
                        "mpc": {
                            "0": "• Je suis prêt.",
                            "1": `code:${numToLetter(345)}`,
                            "2": "• Un test de quoi ?",
                            "3": `code:${numToLetter(678)}`
                        },
                        "nextDial": [{"code":"345", "nextId": 3}, {"code":"678", "nextId": 3}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": null,
                        "penalty": null,
                        "reconnect": null
                    },
                    "3": {
                        "npc": {"0": "Ce sont des questions auxquelles tu dois répondre."},
                        "mpc": {
                            "0": "• Pas de problème, allons-y !",
                            "1": `code:${numToLetter(456)}`,
                            "2": "• Ok, je t'écoute.",
                            "3": `code:${numToLetter(789)}`
                        },
                        "nextDial": [{"code":"456", "nextId": 4}, {"code":"789", "nextId": 4}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": null,
                        "penalty": null,
                        "reconnect": null
                    },
                    "4": {
                        "npc": {"0": "Quel est le plus grand animal terrestre ?"},
                        "mpc": {
                            "0": "• Le lion",
                            "1": `code:${numToLetter(345)}`,
                            "2": "• L'éléphant",
                            "3": `code:${numToLetter(555)}`
                        },
                        "nextDial": [{"code":"345", "nextId": 88}, {"code":"555", "nextId": 5}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": null,
                        "penalty": null,
                        "reconnect": null
                    },
                    "5": {
                        "npc": {"0": "De quelle couleur est le soleil ?"},
                        "mpc": {
                            "0": "• Jaune",
                            "1": `code:${numToLetter(918)}`,
                            "2": "• Rouge",
                            "3": `code:${numToLetter(946)}`
                        },
                        "nextDial": [{"code":"918", "nextId": 6}, {"code":"946", "nextId": 88}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": 1,
                        "penalty": null,
                        "reconnect": null
                    },
                    "6": {
                        "npc": {"0": "Combien de lettres y a-t-il dans l'alphabet ?"},
                        "mpc": {
                            "0": "• 24",
                            "1": `code:${numToLetter(945)}`,
                            "2": "• 26",
                            "3": `code:${numToLetter(725)}`
                        },
                        "nextDial": [{"code":"725", "nextId": 7}, {"code":"945", "nextId": 88}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": 1,
                        "penalty": null,
                        "reconnect": null
                    },
                    "7": {
                        "npc": {"0": "Quel est l'animal qui symbolise la France ?"},
                        "mpc": {
                            "0": "• Le coq",
                            "1": `code:${numToLetter(908)}`,
                            "2": "• Le lapin",
                            "3": `code:${numToLetter(234)}`
                        },
                        "nextDial": [{"code":"908", "nextId": 8}, {"code":"234", "nextId": 88}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": 1,
                        "penalty": null,
                        "reconnect": null
                    },
                    "8": {
                        "npc": {"0": "Quelle est la capitale de l'Espagne ?"},
                        "mpc": {
                            "0": "• Barcelone",
                            "1": `code:${numToLetter(945)}`,
                            "2": "• Madrid",
                            "3": `code:${numToLetter(323)}`
                        },
                        "nextDial": [{"code":"945", "nextId": 88}, {"code":"323", "nextId": 9}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": 1,
                        "penalty": null,
                        "reconnect": null
                    },
                    "9": {
                        "npc": {"0": "Quel est le plus grand océan du monde ?"},
                        "mpc": {
                            "0": "• L'océan Pacifique",
                            "1": `code:${numToLetter(100)}`,
                            "2": "• L'océan Atlantique",
                            "3": `code:${numToLetter(848)}`
                        },
                        "nextDial": [{"code":"100", "nextId": 10}, {"code":"848", "nextId": 88}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": 3,
                        "penalty": null,
                        "reconnect": null
                    },
                    "10": {
                        "npc": {"0": "De quel animal vient la viande pour faire du bacon ?"},
                        "mpc": {
                            "0": "• Le cochon",
                            "1": `code:${numToLetter(114)}`,
                            "2": "• Le poulet",
                            "3": `code:${numToLetter(767)}`
                        },
                        "nextDial": [{"code":"114", "nextId": 11}, {"code":"767", "nextId": 88}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": 4,
                        "penalty": null,
                        "reconnect": null
                    },
                    "11": {
                        "npc": {"0": "Quel est l'organe qui nous permet de respirer ?"},
                        "mpc": {
                            "0": "• Le cœur",
                            "1": `code:${numToLetter(434)}`,
                            "2": "• Les poumons",
                            "3": `code:${numToLetter(765)}`
                        },
                        "nextDial": [{"code":"434", "nextId": 88}, {"code":"765", "nextId": 12}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": 5,
                        "penalty": null,
                        "reconnect": null
                    },
                    "12": {
                        "npc": {"0": "Combien de pattes a une araignée ?"},
                        "mpc": {
                            "0": "• 8",
                            "1": `code:${numToLetter(265)}`,
                            "2": "• 6",
                            "3": `code:${numToLetter(148)}`
                        },
                        "nextDial": [{"code":"265", "nextId": 13}, {"code":"148", "nextId": 88}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": 10,
                        "penalty": null,
                        "reconnect": null
                    },
                    "13": {
                        "npc": {"0": "Très bien bien! tu as obtenu assez de points pour passer la porte."},
                        "mpc": {
                            "0": "• merci.",
                            "1": `code:${numToLetter(767)}`,
                            "2": "• cool!",
                            "3": `code:${numToLetter(467)}`
                        },
                        "nextDial": [{"code":"767", "nextId": 88}, {"code":"467", "nextId": 88}],
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": 1,
                        "penalty": null,
                        "reconnect": null
                    },
                    "88": {
                        "npc": {"0": "Désolé, tu as perdu."},
                        "mpc": {
                            "0": "• ...",
                            "1": "• mais pourquoi ?"
                        },
                        "nextDial": null,
                        "action": null,
                        "unlock": null,
                        "deviator": null,
                        "reward": null,
                        "penalty": null,
                        "reconnect": null
                    }
                },
                    



            "npcC": {

                "0": {
                    "npc": {"0":"Ah tu es là!",},
                    "mpc": {
                        "0": "• On se connait ?",
                        "1": `code: ${numToLetter(237)}`,
                        "2": "• Oui, je suis de retour!",
                        "3": `code: ${numToLetter(573)}`
                    },
                    "nextDial": [{"code":"237", "nextId": 6}, {"code":"573", "nextId": 1}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "1": {
                    "npc": {"0":"J'ai besoin de ton aide."},
                    "mpc": {
                        "0": "• Désolé, je suis occupé.",
                        "1": `code: ${numToLetter(918)}`,
                        "2": "• En quoi puis-je t'aider.",
                        "3": `code: ${numToLetter(125)}`
                    },
                    "nextDial": [{"code":"918", "nextId": 88}, {"code":"125", "nextId": 2}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "2": {
                    "npc": {"0": "Je veux préparer un gâteau aux fraises."},
                    "mpc": {
                        "0": "• J'adore les fraises!",
                        "1": `code: ${numToLetter(401)}`,
                        "2": "• Je préfère les gâteaux au chocolat!",
                        "3": `code: ${numToLetter(670)}`
                    },
                    "nextDial": [{"code": "401", "nextId": 3}, {"code": "670", "nextId": 3}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "3": {
                    "npc": {"0": "...mais je n'ai pas de fraises!"},
                    "mpc": {
                        "0": "• Je peux t'aider à en trouver!",
                        "1": `code: ${numToLetter(324)}`,
                        "2": "• Dommage pour toi!",
                        "3": `code: ${numToLetter(835)}`
                    },
                    "nextDial": [{"code": "324", "nextId": 4}, {"code": "835", "nextId": 88}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "4": {
                    "npc": {"0": "C'est gentil ! Merci!"},
                    "mpc": {
                        "0": "• Mais de rien.",
                        "1": `code: ${numToLetter(172)}`,
                        "2": "• Où je peux en trouver?",
                        "3": `code: ${numToLetter(509)}`
                    },
                    "nextDial": [{"code": "172", "nextId": 5}, {"code": "509", "nextId": 5}],
                    "action": "fraise",
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "5": {
                    "npc": {"0": "Tu trouveras des fraises dans le jardin."},
                    "mpc": {
                        "0": "• Ok, j'y vais!",
                        "1": `code: ${numToLetter(348)}`,
                        "2": "• Très bien, à plus!",
                        "3": `code: ${numToLetter(726)}`
                    },
                    "nextDial": [{"code": "348", "nextId":"88"}, {"code": "726", "nextId": 88}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": 14
                },
                "6": {
                    "npc": {"0": "Tu es le nouveau!"},
                    "mpc": {
                        "0": "• Oui, je suis nouveau içi!",
                        "1": `code: ${numToLetter(460)}`,
                        "2": "• C'est vrai!",
                        "3": `code: ${numToLetter(159)}`
                    },
                    "nextDial": [{"code": "460", "nextId": 7}, {"code": "159", "nextId": 7}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "7": {
                    "npc": {"0": "J'ai entendu parler de toi."},
                    "mpc": {
                        "0": "• ah bon?",
                        "1": `code: ${numToLetter(268)}`,
                        "2": "• Qu'as tu entendu ?",
                        "3": `code: ${numToLetter(537)}`
                    },
                    "nextDial": [{"code": "268", "nextId": 8}, {"code": "537", "nextId": 8}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "8": {
                    "npc": {"0": "On m'a dit que tu aidais les gens!"},
                    "mpc": {
                        "0": "• Oui, c'est vrai!",
                        "1": `code: ${numToLetter(294)}`,
                        "2": "• Parfois oui!",
                        "3": `code: ${numToLetter(671)}`
                    },
                    "nextDial": [{"code": "294", "nextId": 9}, {"code": "671", "nextId": 9}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "9": {
                    "npc": {"0": "Ça tombe bien!"},
                    "mpc": {
                        "0": "• Pourquoi ?",
                        "1": `code: ${numToLetter(493)}`,
                        "2": "• ...",
                        "3": `code: ${numToLetter(758)}`
                    },
                    "nextDial": [{"code": "493", "nextId": 1}, {"code": "758", "nextId": 1}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "10": {
                    "npc": {"0": "Oh pas de soucis! La prochaine fois!"},
                    "mpc": {
                        "0": "• Très bien! À plus!",
                        "1": `code: ${numToLetter(346)}`,
                        "2": "• Au revoir!",
                        "3": `code: ${numToLetter(812)}`
                    },
                    "nextDial": [{"code": "346", "nextId": 11}, {"code": "812", "nextId": 11}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "11": {
                    "npc": {"0": "Oh non! Je n'ai pas d'œuf non plus!"},
                    "mpc": {
                        "0": "• Tu en veux combien ?",
                        "1": `code: ${numToLetter(421)}`,
                        "2": "• T'aurais pu me le dire avant!",
                        "3": `code: ${numToLetter(907)}`
                    },
                    "nextDial": [{"code": "421", "nextId": 12}, {"code": "907", "nextId": 12        }],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "12": {
                    "npc": {"0": "10 ça ira."},
                    "mpc": {
                        "0": "• Ok, j'y vais.",
                        "1": `code: ${numToLetter(135)}`,
                        "2": "• Je vais essayer d'en trouver.",
                        "3": `code: ${numToLetter(684)}`
                    },
                    "nextDial": [{"code": "135", "nextId": 88}, {"code": "684", "nextId": 88}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect":14
                },
                "13": {
                    "npc": {"0": "Désolé, j'ai oublié."},
                    "mpc": {
                        "0": "• Ok, je vais t'en chercher.",
                        "1": `code: ${numToLetter(250)}`,
                        "2": "• Tu en veux combien ?",
                        "3": `code: ${numToLetter(529)}`
                    },
                    "nextDial": [{"code": "250", "nextId": 14}, {"code": "529", "nextId": 15}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "14": {
                    "npc": {"0": "hey ~ Tu as trouvé les fraises?"},
                    "mpc": {
                        "0": "• Oui, c'était facile!",
                        "1": `code: ${numToLetter(376)}`,
                        "2": "• Non, pas encore",
                        "3": `code: ${numToLetter(813)}`
                    },
                    "nextDial": [{"code": "376", "nextId": 16}, {"code": "813", "nextId": 15}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },
                "15": {
                    "npc": {"0": "Pas de problème, quand tu les trouveras tu peux venir me voir."},
                    "mpc": {
                        "0": "• ok..bye",
                        "1": `code: ${numToLetter(491)}`,
                        "2": "• Pas de soucis!",
                        "3": `code: ${numToLetter(766)}`
                    },
                    "nextDial": [{"code": "491", "nextId": 88}, {"code": "766", "nextId": 88}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": 14
                },
                "16": {
                    "npc": {"0": "oh parfait! Merci! T'es très gentil!"},
                    "mpc": {
                        "0": "• C'est rien, tu m'as l'air sympa aussi!",
                        "1": `code: ${numToLetter(213)}`,
                        "2": "• Avez-vous besoin de quelque chose d'autre?",
                        "3": `code: ${numToLetter(587)}`
                    },
                    "nextDial": [{"code": "213", "nextId": 17}, {"code": "587", "nextId": 18}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": 10,
                    "penalty": null,
                    "reconnect": null
                },
                "17": {
                    "npc": {"0": "Allez, Je te laisse un petit cadeau ! Bye"},
                    "mpc": {
                        "0": "• Ciao!",
                        "1": `code: ${numToLetter(213)}`,
                        "2": "• À plus!",
                        "3": `code: ${numToLetter(587)}`
                    },
                    "nextDial": [{"code": "213", "nextId": 88}, {"code": "587", "nextId": 88}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": 15,
                    "penalty": null,
                    "reconnect": null
                },
                "18": {
                    "npc": {"0": "On se connait, tu es mon ami,  pourquoi tu me dis 'vous'🙁 ? "
                },
                    "mpc": {
                        "0": "• Oh je suis désolé, je vais faire plus attention la prochaine fois. Tu as besoin de quelque chose d'autre ?",
                        "1": `code: ${numToLetter(432)}`,
                        "2": "• Oh oui!! tu tu tu !!..tu veux quelque chose d'autre?",
                        "3": `code: ${numToLetter(538)}`
                    },
                    "nextDial": [{"code": "432", "nextId": 19}, {"code": "538", "nextId": 19}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty":1,
                    "reconnect": null
                },
                "19": {
                    "npc": {"0": "Oui, tu n'aurais pas vu un chat blanc dans le coin ? "
                },
                    "mpc": {
                        "0": "• Un cat blanc?",
                        "1": `code: ${numToLetter(411)}`,
                        "2": "• Un quoi blanc ?",
                        "3": `code: ${numToLetter(597)}`
                    },
                    "nextDial": [{"code": "411", "nextId": 20}, {"code": "597", "nextId": 21}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty":null,
                    "reconnect": null
                },
                "20": {
                    "npc": {"0": "Non, un CHAT blanc ! "
                },
                    "mpc": {
                        "0": "• Ohh..non, mais je peux t'aider à le trouver aussi!",
                        "1": `code: ${numToLetter(412)}`,
                        "2": "• Non, désolé...",
                        "3": `code: ${numToLetter(558)}`
                    },
                    "nextDial": [{"code": "412", "nextId": 22}, {"code": "558", "nextId": 23}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty":2,
                    "reconnect": null
                },
                "21": {
                    "npc": {"0": "Un CHAT blanc! "
                },
                    "mpc": {
                        "0": "• Ohh..non, mais je peux t'aider à le trouver aussi!",
                        "1": `code: ${numToLetter(472)}`,
                        "2": "• Non, désolé...",
                        "3": `code: ${numToLetter(588)}`
                    },
                    "nextDial": [{"code": "472", "nextId": 22}, {"code": "588", "nextId": 23}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty":null,
                    "reconnect": null
                },
                "22": {
                    "npc": {"0": "Trop bien!! Il s'appelle miaomi"
                },
                    "mpc": {
                        "0": "• Ok, je vais le cherche alors",
                        "1": `code: ${numToLetter(632)}`,
                        "2": "• je vais voir si je le trouve",
                        "3": `code: ${numToLetter(908)}`
                    },
                    "nextDial": [{"code": "632", "nextId": 22}, {"code": "908", "nextId": 23}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty":null,
                    "reconnect": null
                },
                "23": {
                    "npc": {"0": "ok, pas grave! À plus alors!🙂 "
                },
                    "mpc": {
                        "0": "• À plus, bye",
                        "1": `code: ${numToLetter(132)}`,
                        "2": "• Ciao!",
                        "3": `code: ${numToLetter(180)}`
                    },
                    "nextDial": [{"code": "132", "nextId": 88}, {"code": "180", "nextId": 88}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty":null,
                    "reconnect": null
                },
                "24": {
                    "npc": {"0": "Ok ! bonne chance! "
                },
                    "mpc": {
                        "0": "• Merci! À plus!",
                        "1": `code: ${numToLetter(422)}`,
                        "2": "• ;)",
                        "3": `code: ${numToLetter(580)}`
                    },
                    "nextDial": [{"code": "422", "nextId": 88}, {"code": "580", "nextId": 88}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty":null,
                    "reconnect": null
                },

                "88": {
                    "npc": {"0": "..."},
                    "mpc": {
                        "0": "• ..",
                        "1": `code: ${numToLetter(134)}`,
                        "2": "• ..",
                        "3": `code: ${numToLetter(956)}`
                    },
                    "nextDial": [{"code": "134", "nextId": 100}, {"code": "956", "nextId": 100}],
                    "action": null,
                    "unlock": null,
                    "deviator": null,
                    "reward": null,
                    "penalty": null,
                    "reconnect": null
                },




            }
            
            
            
        
    }
}
}
        
            










       
            // 10:{  npc:function(){
            //     // console.log("????", chars)
                        
            //             let code1 =  7
            //             let code2 =  535
            //             chars["player"].nextDial =[
            //             {code:7, nextId:2}, 
            //             {code:7, nextId:2}
            //         ]
            //     // console.log("chars[player].nextDial??", chars["player"].nextDial)
            //             return {0:`Salut je m'appel ${charName} !`,
            //                     1:`你好， 我是 ${charName} !`}},

            //         mpc:function(){
            //             let code1 =  7
            //             let code2 =  535
            //             // console.log("where is the err", chars["player"])
            //             chars["player"].nextDial =[
            //             {code:7, nextId:2}, 
            //             {code:7, nextId:2}]

            //             return {0:`A: Coucou! tu es mignon!! `,
            //                     1:`(code: ${numToLetter(code1)} ) ` ,
            //                     2:`B: Saaalut! `,
            //                     3:`(code: ${numToLetter(code2)} )`  }}, 
            //     },

            // // échange type "première rencontre mauvaise humeur"
            // 1:{ npc:function(){
            //             chars["player"].nextDial =[
            //                 {code:7, nextId:2}, 
            //                 {code:7, nextId:2}]
            //             return {0:`....!! tu es qui? ${charName} !`,
            //                     1:`你好， 我是 ${charName} !`}},
            //         mpc:function(){ 
            //             // chars["player"].req2ToProcessAnser = true // on peut faire la demande de process sans forcément être une mission//
            //             // il faut prendre en compte process Anser si 
            //             chars["player"].nextDial =[
            //                 {code:7, nextId:2}, 
            //                 {code:7, nextId:2}]

            //             return {0:"B: ca va pas ?", // A =positiv attitude
            //                     1:"A:Ok bye"}}, // B is refuse // ici on peut dire que c'est refuser la compersations
            //                     // donc au pochain tout il sera 88 .
            //                     // donc toud les tours de paroles doivent avoir procces anser
            //                     // if it's A, send to postive 
            //                     // if it's B, send to negative
            //         },
            // //
            // 2:{ npc:function(){
            //             chars["player"].mission2Accept = "cat"
            //             // why create the dial memory ?
            //             chars["player"].nextDial= [  
            //                 {code: 7, nextId: 3 }, 
            //                 {code: 7, nextId: 3 }] 
            //             return {0: "peux tu m'aider à trouver mon chat?",
            //                     1:`你可以帮我找我的🐱吗!`}},
            //     mpc: function(){
            //         // this part can prep for recevieing ans from SS
            //             // chars["player"].req2ToProcessAnser = true
            //             chars["player"].mission2Accept = "cat"
            //             // why create the dial memory ?
            //             chars["player"].nextDial= [  
            //                 {code: 7, nextId: 3 }, 
            //                 {code: 7, nextId: 3 }] 
            //             return { 
            //                 0:"A:ok je veux bien", // là on doit faire la différence quand il accept ou non / consequence
            //                 1:"B:désolé je ne peux pas",}
            //         }},// accepts and cats is processed
            
            // 3:{ npc:function(){
            //             checkMissions(chars["player"].mission2Accept)===true?
            //             console.log("this is not a new mission")
            //             :chars["player"].missionsObjList.push({type:"mission", id:"cat",from:charName, found:false, pad:wrangleWord("cat")});

            //             reconnectOnId = 10
            //             chars["player"].nextDial= [  
            //                 {code: 7, nextId: 88 }, 
            //                 {code: 7, nextId: 88 }] //
            //             return {0: "Merci, c'est gentil! J'ajoute 'chercher mon chat à tes missions",
            //                     1:`...`}},
            //     mpc:function(){         
            //         checkMissions(chars["player"].mission2Accept)===true?
            //         console.log("this is not a new mission")
            //         :chars["player"].missionsObjList.push({type:"mission", id:"cat",from:charName, found:false, pad:wrangleWord("cat")});

            //         reconnectOnId = 10
            //         chars["player"].nextDial= [  
            //             {code: 7, nextId: 88 }, 
            //             {code: 7, nextId: 88 }] //
            //         return { 
            //             0:"A:ça marche! Allez j'y vais ! bye!", // là on doit faire la différence quand il accept ou non / consequence
            //             1:"B:Ok bye",}
            // }},// accepts and cats is processed       

            // // test pour reconnectionAt
            // 13:{ npc:function(){
            //         // chars["player"].missionsObjList.push(chars["player"].mission2Accept )
            //         chars["player"].numPadMode ="alphabetic"
            //         chars["player"].nextDial= [  
            //             {code: "cat", nextId: 11 }, 
            //             {code: "cat", nextId: 11 }] //
            //         return {0: "Tu as retrouvé mon chat?",
            //                 1:`...`}},
            //         mpc:function(){
            //             chars["player"].numPadMode ="alphabetic"
            //             chars["player"].nextDial= [  
            //                 {code: "cat", nextId: 11 }, 
            //                 {code: "cat", nextId: 11 }] //
            //             return { 
            //                 0:"oui", // là on doit faire la différence quand il accept ou non / consequence
            //                 1:"non",}
            //     }},// accepts and cats is processed    
            //     11:{ npc:function(){
            //         // chars["player"].missionsObjList.push(chars["player"].mission2Accept )
            //         chars["player"].numPadMode ="numerical"

            //         chars["player"].nextDial= [  
            //             {code: 99, nextId: 12 }, 
            //             {code: 12, nextId: 12 }]  //
            //         return {0: "trop bien merci!! voila une récompense",
            //                 1:`...`}},
            //         mpc:function(){
            //             chars["player"].numPadMode ="numerical"
                  
            //             chars["player"].nextDial= [  
            //                 {code: 99, nextId: 12 }, 
            //                 {code: 12, nextId: 12 }]  //
            //             return { 
            //                 0:"pas besoins merci", // là on doit faire la différence quand il accept ou non / consequence
            //                 1:"cool trop bien",}
            //     }},// accepts and cats is processed    
            //     12:{ npc:function(){
            //         // chars["player"].missionsObjList.push(chars["player"].mission2Accept )

            //         chars["player"].numPadMode ="numerical"
            //         chars["player"].nextDial= [  
            //             {code: 1, nextId: 88 }, 
            //             {code: 1, nextId: 88 }] //
            //         return {0: "trop bien merci!! voila une récompense",
            //                 1:`...`}},
            //         mpc:function(){

            //             chars["player"].numPadMode ="numerical"
            //             chars["player"].nextDial= [  
            //                 {code: 1, nextId: 88 }, 
            //                 {code: 1, nextId: 88 }] 
            //             return { 
            //                 0:"pas besoins merci", // là on doit faire la différence quand il accept ou non / consequence
            //                 1:"cool trop bien",}
            //     }},// accepts and cats is processed   



                
            // 88:{ npc:function(){
                    
            //         // chars["player"].endInteraction(chars)
            //         // chars["player"].wsInteractionEnder(chars)
            //     return {0: ""}},
            //     mpc:function(){

            //         // chars["player"].endInteraction(chars)
            //         return { 0:""}
            // }}, 





    //     }


    //     }
    // }}
        //première rencontre

        // 0:{ 0:{ npc:{0:`Salut je m'appel ${this.charName} !`,
        //             1:`你好， 我是 ${this.charName} !`},
        //         mpc:{ 0:"A: Coucou! tu es mignon",
        //             1:"B: Saaalut !"}},
        //         },
        // ou lieu de se concentrer trop sur le mot, la phrase, je me concentre sur l'échange. l'échange prend en comp
        // une plus grande dimmension (environneemnt?), mais on peut aussi séquencer les échanges
        // et si on peut les séquencer , on peut composer une interaction plus ou moins longue selon les beoins
        // il faut donc trouver un pattern, pour cela il faut coder l'objet jusqu'a que j'en percoive la structure
// l'échange peut être marqué par la mood : bonne ou mauvais (pour commencer)
        // échange s'engage
        // peut être que GPT pourr trouver comment optimiser les séquences d'échanges
        
            // 0:{ 0:{ npc:function(){
            //             return {0:`Salut je m'appel ${charName} !`,
            //                     1:`你好， 我是 ${charName} !`}},
            //         mpc:function(){
            //             return {0:"A: Coucou! tu es mignon",
            //                     1:"B: Saaalut !" }}, 
            //     }},
            // 1:{ 0:{ npc:function(){
            //     return {0:`....!! tu es qui? ${charName} !`,
            //             1:`你好， 我是 ${charName} !`}},
            // mpc:function(){ 
            //     chars["player"].req2ToProcessAnser = true // on peut faire la demande de process sans forcément être une mission//
            //     // il faut prendre en compte process Anser si 
            //     chars["player"].nextDial = [  {code: 4984, nextId: 21 }, 
            //                                   {code: 9384, nextId: 88 }]

            //     return {0:"B: ca va pas ?", // A =positiv attitude
            //             1:"A:Ok bye"}}, // B is refuse // ici on peut dire que c'est refuser la compersations
            //             // donc au pochain tout il sera 88 .
            //             // donc toud les tours de paroles doivent avoir procces anser
            //             // if it's A, send to postive 
            //             // if it's B, send to negative
            // }},
        
         //call once and get both top box and bottom box content
         // on essaue de distingue A/ B / serait contrôlé par le code//c'est comme on avait dit ya quelque jours
         // constoler a partir de la?
         // interaction, la plus petite unité interactive, un échange
         // différents types d'échanges

         //échange demande d'aide avec type d'acceptation ou de refus

        //     2:{ 0:{ npc:{ function(){
        //                     return {0: "peux tu m'aider à trouver mon chat?",
        //                             1:`你可以帮我找我的🐱吗!`}}},
        //             mpc:{ function(){
        //                 // this part can prep for recevieing ans from SS
        //                     chars["player"].req2ToProcessAnser = true
        //                     chars["player"].mission2Accept = "cat"
        //                     // why create the dial memory ?
        //                     chars["player"].nextDial= [  {code: 4984, nextId: 10 }, 
        //                         {code: 9384, nextId: 20 }] //
        //                     return { 
        //                         0:"A:ok je veux bien", // là on doit faire la différence quand il accept ou non / consequence
        //                         1:"B:désolé je ne peux pas",}
        //                 }}}},
        //                 // accepts and cats is processed
        // // échange type réponse postive à la demande d'aide
        //     10:{ npc :{ function(){
        //                 return { 0:"Merci c'est gentil! à bietot!"}},
        //         mpc:{function(){
        //                 chars["player"].nextDial=  [  {code: 4984, nextId: 23 } ] // sends to cut with carzy id
        //                 return {0:"À bientôt!", 1:"ciao!!"}}, // empty string is the cut
        //     }}},
        // // échange type réponse négative à la demande d'aid
        //     20:{ npc :{ function(){
        //                 return { 0:"non mais c'est pas gentil!"}},
        //         mpc:{function(){
        //                 chars["player"].nextDial= [{code: 9384, nextId: 88 }] // baba comme byebye
        //                 return {0:"À bientôt!",
        //                     1:"pffff",}}}, // empty string is the cut
        //     }},
         // échange type réponse négative à la demande d'aid
        //  21:{ npc :{ function(){
        //             return { 0:"non mais c'est pas gentil!"}},
        //       mpc:{function(){
        //             chars["player"].nextDial= [{code: 9384, nextId: 88 }]  // baba comme byebye
        //             return {0:"À bientôt!",
        //                 1:"pffff",}}}}}, // empty string is the cut
        
        // 30:{ npc :{ function(){
        //         return { 0:"hey te revoila! Tu as trouvé mon/ ma [.....]?"}},
        //     mpc:{function(){
        //                 chars["player"].nextDial= [{code: 4984, nextId: 40 }, 
        //                                            {code: 9384, nextId: 41 }]//40 need to process exchange cat vs money
        //                 // type of echange npc give thanks money related to mood
        //                 // sell objects founds etc..
        //                 // how to process exchange ?
        //                 // chars["player"]. processEchange() !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //                 // seems that it's better NPC has illimited money/points to give
        //                 // echange process done ..next ?
        //                 // postivie outcome
        //                 /// tu veux une info ? Une autre mission ? 88?
        //                 chars["player"].nextDial= [
        //                     {code: 1000, nextId: 40 }, //info?
        //                     {code: 1034, nextId: 41 }, // mission ?
        //                     {code: 4565, nextId: 42 } // bye bye
        //                     // maintenant au lieu de ceck Accept ou pas on check le code
        //                     ]  
        //                     //multi
        //                 // donc je avec A et B je n'ai pas assez de boutons
        //                 // au lieu de A  B on a des chiffres et ViewMode doit transmettre le code 
        //                 // le code à entrer pour procéder exemple 104
        //                 // à chaque erreur enlever des points ?
        //                 // comment entrer ces codes et les procéder
        //                 // dans dial box > next is : [ x x x x] 
        //                 // ss entre le code et le code renvoi a la clé de l'échange type
        //                 // le code ..il est stocké comment ?

        //                 // needs to send number to read to viewMode
        //                 return {"cent":"Oui!!! le voilà", // needs to send number to read to viewMode
        //                     "trois-cent":"non pas encore",}}}, // empty string is the cut
        //                     // ss lis les mots l'autre input , processed et la boucle se referme
        //                     // next : c'est construire la base de donnée d'échanges type et d'essayer de trouver une certaine
        //                     // une certaine logique de suite de séquences
        //                     // je pense d'abord et je dois ensuite traduire ces pensées en code // en procesus logique , en suite logique
        //                     // en suite décrite, en suite claire d'événements

        //     }},
        // 40:{ npc :{ function(){
        //     return { 0:"hey te revoila! Tu as trouvé mon/ ma [.....]?"}},
        //         mpc:{function(){
        //                 chars["player"].nextDial= [{code: 4984, nextId: 77 }, 
        //                 {code: 9384, nextId:77 }] // baba comme byebye
        //                 return {0:"Oui!!! le voilà",
        //                     1:"non pas encore",}}}, // empty string is the cut
        //     }},
        // 31:{ npc :{ function(){
        //         return { 0:"non mais c'est pas gentil!"}}},
        //     mpc:{function(){
        //         chars["player"].nextDial= [{code: 9384, nextId: 88 }]  // baba comme byebye
        //         return {0:"À bientôt!",
        //             1:"pffff",}}}, // empty string is the cut
        //     },
        // échange se finit
                // 88: {cut:{function(){
                //     // close the dial wind from player
                //         chars["player"].endInteraction(chars)
                //     // conversation is closed here, but next encouter ne ? 
                //     // next is what ?
                //     // dépend si on a une mission avec lui OU non
                //         if("my new accepted mission == char proposed?"){
                //             chars["player"].nextDial=[{code: 4984, nextId: 30}] //échange type "hey te revoilà"
                //         }else{
                //             chars["player"].nextDial =[{code: 4984, nextId: 31 }]//échange type "cette fois ci tu veux une mission??
                //         }
                //         return {0:"", 1:""}},
                    

                //     }   
                // }
        
        

                
                
                 
        
                

        //prochaines rencontres
                // 2:{ 0:{ npc :{  missionName:"cat",
                //                 txt:"te revoila! tu as trouvé mon chat?"},
                //         mpc:{   a:"oui",
                //                 confirmA: this.callConfirm(true) 
                //                 nextA: this.callNext(1) // next time we call for ation we will be placed in the right place
                //                 b:"non pas encore"}
                //                 confirmB: this.callConfirm(false)
                //                 nextB: this.callNext(2)}},

                //     1:{ npc :{  missionName:"cat",
                //                 txt:"Merci, voila une récompense"},
                //         mpc:{   a:"cool, merci!",
                //                 confirmA: this.callConfirm(true) 
                //                 nextA: this.callNext(1) // next time we call for ation we will be placed in the right place
                //                 b:"non, merci"}
                //                 confirmB: this.callConfirm(false)
                //                 nextB: this.callNext(2)}},

                //     2:{ npc :{  missionName:"cat",
                //                 txt:"Il faut vite le retrouvrer"},
                //         mpc:{   a:"Ok",
                //                 confirmA: this.callConfirm(true) 
                //                 nextA: this.callNext(1) // next time we call for ation we will be placed in the right place
                //                 b:"cherchez-le aussi!"}
                //                 confirmB: this.callConfirm(false)
                //                 nextB: this.callNext(2)}},
                    


            //         ans:{
            //                 1:{
            //                     ok:"",
            //                     merci:"",
            //                     state: false,
            //                     next: ()=>this.nextBranch(1)},
            //                 2:{
            //                     notOk:"",
            //                     blame:"",
            //                     state:false,
            //                     next:()=>this.nextBranch(1)},
            //                 }},

            //     1:{bbx: ()=> this.bbx()===true? ()=> this.endUpConversation("cool, bye") :()=>  this.endUpConversation("bye!!")}
            // },

            // rencontres:{ // Rencontre X
            //     0:{nh:"",ans:{ 
            //         0:`Hey ${ this.MpcName}, tu est de retour!`,
            //         1: false,
            //         2: ()=>this.nextBranch(1),}},

            //     1:{mood: ()=> this.lastMissionDone()===true? ()=> this.nextBranch(1):()=> this.nextBranch(2)},
            

            //     // good last missions accepter
            //     2:{qm:"m+?",ans:{ //quest done
            //         1:{
            //             ok:"",
            //             merci:"",
            //             state: false,
            //             next: ()=>this.nextBranch(1)}, // oui donne moi des points
            //         2:{
            //             notOk:"", 
            //             blame:"",
            //             state:false,
            //             next:()=>this.nextBranch(3)} // non , simple demande d'information
            //         }},
                    
        //         3:{pts:"",ans:{ ///oui ,gives he poins
        //             1:{
        //                 ok:"",
        //                 merci:"",
        //                 state: false,
        //                 next: ()=>this.nextBranch(2)}}}, // done les points + demande information
        //         // las mission not accepted: ask if wants missions this time 
        //         4:{qm:"m+?",ans:{ //quest done
        //             1:{
        //                 ok:"",
        //                 merci:"",
        //                 state: false,
        //                 next:  ()=>this.acceptLastMission()}, // send back to R1 for mission
        //             2:{
        //                 notOk:"", 
        //                 blame:"",
        //                 state:false,
        //                 next:()=>this.nextBranch(1)} // non , simple demande d'information
        //             }},

        //         5:{info:"m",ans:{ // ask if need informations
        //             1:{txt:"",
        //                 merci:"",
        //                 state: false,
        //                 next:()=> this.nextBranch(1)}}},
                
        //         6:{bbx: ()=> this.bbx()===true? ()=> this.endUpConversation("cool, bye") :()=>  this.endUpConversation("bye!!")}
            
        // }