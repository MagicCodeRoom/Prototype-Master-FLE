
import gs from "../data/GameSpecs";
import Stack from "./Stack";



// keeping tracks of groups of stacks
export default class Inventory{
    
    spaces      :number
    stacks	    : Array<Stack>
    addItems    : (id:number, qty:number)=>number



    constructor(s:number){
        this.spaces = s;
        this.stacks = [];

        this.addItems = function(id, qty)
        {
            for(var i = 0; i < this.spaces; i++)
            {
                if(this.stacks.length<=i)
                {
                    var maxHere = (qty > gs.itemTypes[id].maxStack ? gs.itemTypes[id].maxStack : qty);
                    this.stacks.push(new Stack(id, maxHere));
                    
                    qty-= maxHere;
                }
                else if(this.stacks[i].type == id &&
                    this.stacks[i].qty < gs.itemTypes[id].maxStack)
                {
                    var maxHere = (gs.itemTypes[id].maxStack - this.stacks[i].qty);
                    if(maxHere > qty) { maxHere = qty; }
                    
                    this.stacks[i].qty+= maxHere;
                    qty-= maxHere;
                }
                
                if(qty==0) { 
                    return 0; 
                }
            }
            
            return qty;
        };
    }
}