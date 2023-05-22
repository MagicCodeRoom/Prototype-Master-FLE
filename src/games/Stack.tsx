

// calss Stack : tracks items by ID and their quantity on the map
export default class Stack{

    type : number;
    qty : number;

    
    constructor(id:number, qty: number){
        this.type = id;
        this.qty = qty;
        }
}