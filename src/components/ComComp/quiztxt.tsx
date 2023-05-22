


export interface txt {
    [key: string]: {
        ch: string,
        fr: string,
        left: string,
        right: string,
    }
    
  }


const quiztxt:txt = {
    "1":{
        ch:"您是如何找到信息交换活动的?",
        fr:"Comment avez-vous trouvé l'activité d'échange d'informations ?",
        left:"intéressante",
        right:"ennuyeuse"
    },
    "2":{
        ch:"你能看懂游戏中的信息吗?",
        fr:"Arriviez-vous à comprendre les informations dans le jeu ?" ,
        left:"oui",
        right:"non"
    },
    "3":{
        ch:"您是否能够传达游戏传输给您的信息？",
        fr:"Arriviez-vous à communiquer les informations qui vous étaient transmises par le jeu ? ",
        left:"oui",
        right:"non"
    },
    "4":{
        ch:"你能理解其他玩家传达给你的信息吗？您是否觉得通过游戏用法语交流很自在？",
        fr:"Arriviez-vous à comprendre les informations qui vous étaient communiquées par l'autre joueur ? Vous êtes-vous sentis à l'aise pour communiquer en français à travers le jeu ?",
        left:"oui",
        right:"non"
    },
    "5":{
        ch:"通过游戏或在课堂上进行交流更自在吗？",
        fr:"Êtes-vous plus à l'aise pour communiquer à travers le jeu ou en classe ? ",
        left:"jeu",
        right:"classe"
    },
    "6":{
        ch:"通过游戏与朋友或在课堂上与老师交流更容易吗？",
        fr:"Est-ce plus facile de communiquer à travers le jeu avec vos amis ou avec le professeur en classe ? ",
        left:"jeu",
        right:"classe"
    },
    "7":{
        ch:"口语表达清楚吗？",
        fr:"La communication orale est-elle claire ?",
        left:"amis",
        right:"classe"
    },
    "8":{
        ch:"你认为你说话的次数比平常多吗？",
        fr:"Pensez-vous avoir pris la parole plus souvent qu'en temps normal ? ",
        left:"oui",
        right:"non"
    },
    "9":{
        ch:"你用中文解决理解题了吗？",
        fr:"Avez-vous utilisé le chinois pour vous aider à résoudre les tâches dans le jeu? ",
        left:"oui",
        right:"non"
    },
    "10":{
        ch:"你用中文是为了让自己被理解吗？",
        fr:"Avez-vous parlé plus chinois ou français durant le jeu ?",
        left:"oui",
        right:"non"
    },
    "11":{
        ch:"你觉得游戏中两个角色的说话时间平衡了吗？",
        fr:"Avez-vous trouvé le temps de parole équilibré entre les deux rôles dans le jeu ? ",
        left:"oui",
        right:"non"
    },
    "12":{
        ch:"您认为有必要进行视频连接吗？",
        fr:"Pensez-vous qu'il soit nécessaire d'avoir une connexion vidéo ? ",
        left:"oui",
        right:"non"
    },
    "13":{
        ch:"在视频中看到你的朋友是否有助于你理解他们在说什么？",
        fr:"Le fait de voir vos amis en vidéo vous aide-t-il à comprendre ce qu'ils disent ? ",
        left:"oui",
        right:"non"
    },
    "14":{
        ch:"你能通过视频看到你朋友的情绪吗？",
        fr:"Pouvez-vous comprendre les émotions de vos amis en les voyant à travers la vidéo ?",
        left:"oui",
        right:"non"
    },
    "15":{
        ch:"你觉得对话有趣吗？",
        fr:"Avez-vous trouvé les dialogues intéressants ? ",
        left:"oui",
        right:"non"
    },
    "16":{
        ch:"你觉得这些问题很有趣还是太严肃了？",
        fr:"Avez-vous trouvé les questions amusantes ou trop sérieuses ? ",
        left:"amusante",
        right:"sérieuse"
    },
    "17":{
        ch:"你觉得对话太长了吗？",
        fr:"Avez-vous trouvé les dialogues trop longs ? ",
        left:"oui",
        right:"non"
    },
    "18":{
        ch:"你觉得在对话中很难做出选择吗？",
        fr:"Avez-vous trouvé difficile de faire des choix dans les dialogues ?",
        left:"oui",
        right:"non"
    },
    "19":{
        ch:"你觉得游戏中的任务有趣吗？",
        fr:"Avez-vous trouvé les quêtes à réaliser dans le jeu intéressantes ? ",
        left:"oui",
        right:"non"
    },
    "20":{
        ch:"你很容易理解游戏的目标吗？",
        fr:"Avez-vous facilement compris l'objectif du jeu ? ",
        left:"oui",
        right:"non"
    },
    "21":{
        ch:"你达到游戏的目的了吗？",
        fr:"Avez-vous atteint l'objectif du jeu ? ",
        left:"oui",
        right:"non"
    },    
    "22":{
        ch:"你觉得通过 level 1 很难吗？",
        fr:"Avez-vous trouvé difficile de passer le niveau 1 ? ",
        left:"oui",
        right:"non"
    },
    "23":{
        ch:"您是否发现很难在地图上找到隐藏的对象？",
        fr:"Avez-vous trouvé difficile de trouver les objets cachés sur la carte ?",
        left:"oui",
        right:"non"
    },
    "24":{
        ch:"你如何看待键盘上的信息验证？",
        fr:"Que pensez-vous de la validation d’information sur clavier?",
        left:"intéressante",
        right:"ennuyeuse"
    },
    "25":{
        ch:"你如何看待看不见的敌人？",
        fr:"Que pensez-vous des enemis invisibles ? ",
        left:"intéressante",
        right:"ennuyeuse"
    },
    "26":{
        ch:"Que pensez-vous des enemis invisibles ? ",
        fr:"Avez-vous été corrigés par les NPC ?",
        left:"oui",
        right:"non"
    },
    "27":{
        ch:"如果你被NPC纠正，你从他们的表情中明白你的错误了吗？",
        fr:"Si vous avez été corrigés par les NPC, avez-vous compris votre erreur grâce à leurs explications ? ",
        left:"oui",
        right:"non"
    },
    "28":{
        ch:"您是否了解游戏的目的是让您发表易于理解的陈述并注意您的伙伴与您交流的内容？",
        fr:"Avez-vous compris que l’objectif du jeu est de vous faire produire des énoncés  compréhensibles et d’être attentifs à ce que votre partenaire vous communique ?",
        left:"oui",
        right:"non"
    },
    "29":{
        ch:"您是否需要老师的帮助才能更好地理解游戏？",
        fr:"Auriez-vous eu besoin de l'aide de l'enseignant pour mieux comprendre le jeu ?",
        left:"oui",
        right:"non"
    },
    "30":{
        ch:"你认为你得到的分数比其他人多吗？",
        fr:"Pensez-vous avoir obtenu plus de points que les autres ? ",
        left:"oui",
        right:"non"
    },
    "31":{
        ch:"你觉得这个游戏好玩吗？",
        fr:"Avez-vous trouvé le jeu amusant ? ",
        left:"oui",
        right:"non"
    },    
    "32":{
        ch:"一开始，您是否对探索隐藏地图感到好奇？",
        fr:"Au tout début, avez-vous éprouvé de la curiosité pour explorer le map caché?? ",
        left:"oui",
        right:"non"
    },
    "33":{
        ch:"一开始，你是不是觉得好奇，想打开雕像之间的通道？",
        fr:"Au tout début, avez-vous éprouvé de la curiosité pour ouvrir le passage entre les statues ?  ",
        left:"oui",
        right:"non"
    },
    "34":{
        ch:"你觉得与 NPC 互动有趣吗？",
        fr:"Avez-vous trouvé l’interaction avec les NPC amusante ? ",
        left:"oui",
        right:"non"
    },
    "35":{
        ch:"你觉得地图导航有趣吗？",
        fr:"Avez-vous trouvé la navigation sur le map amusante ? ",
        left:"oui",
        right:"non"
    },
    "36":{
        ch:"说说你对游戏的印象，你喜欢或不喜欢什么？",
        fr:"Donnez votre impression sur le jeu. Qu'est-ce que vous avez aimé ou que vous n'avez pas aimé ?",
        left:"oui",
        right:"non"
    }
   

}


export default quiztxt;