
interface Uix{
    arrowSize:number,
    arrow: {
        up:{x:number,y:number},
        down:{x:number,y:number},
        left:{x:number,y:number},
        right:{x:number,y:number}
    
    },
    talkButton:{
        x:number,
        y:number,
        w:number,
        h:number
    },
    acceptButton:{
        x:number,
        y:number,
        w:number,
        h:number
    },
    refuseButton:{
        x:number,
        y:number,
        w:number,
        h:number
    },
    invButton:{
        x:number,
        y:number,
        w:number,
        h:number
    },
    inventoryBox:{
        x:number,
        y:number,
        w:number,
        h:number
    },
    missionsBtn:{
        x:number,
        y:number,
        w:number,
        h:number
    },
    numPad:{
        [key:number]:{
            x:number,
            y:number,
            w:number,
            h:number
        },
       
    }


}

export var uis:Uix = {
    arrowSize:30,
    arrow:{
        up:{x:100,y:720},
        down:{x:100,y:820},
        left:{x:50,y:770},
        right:{x:150,y:770},
    },
    talkButton:{
        x: 60,
        y: 650,
        w:30,
        h:30,
        
    },
    acceptButton:{
        x: 30,
        y: 580,
        w:60,
        h:40,
        
    },
    refuseButton:{
        x: 30,
        y: 510,
        w:60,
        h:40,
        
    },
    invButton:{
        x: 60,
        y: 580,
        w:30,
        h:30,
        
    },
    inventoryBox:{
        x: 30,
        y: 450,
        w:60,
        h:40,
    },
    missionsBtn:{
        x: 30,
        y: 450,
        w:60,
        h:40,
    },

    numPad:{
        1: {
            x: 220,
            y: 650,
            w:40,
            h:40,
        },
        2: {
            x: 280,
            y: 650,
            w:40,
            h:40,
        },
        3: {
            x: 340,
            y: 650,
            w:40,
            h:40,
        },
        4: {
            x: 220,
            y: 710,
            w:40,
            h:40,
        },
        5: {
            x: 280,
            y: 710,
            w:40,
            h:40,
        },
        6: {
            x: 340,
            y: 710,
            w:40,
            h:40,
        },
        7: {
            x: 220,
            y: 770,
            w:40,
            h:40,
        },
        8: {
            x: 280,
            y: 770,
            w:40,
            h:40,
        },
        9: {
            x: 340,
            y: 770,
            w:40,
            h:40,
        },
        0: {
            x: 280,
            y: 830,
            w:40,
            h:40,
        },
        11: { //ok
            x: 220,
            y: 830,
            w:40,
            h:40,
        },
        10: {
            x: 340,
            y: 830,
            w:40,
            h:40,
        },
        
    }


   

}