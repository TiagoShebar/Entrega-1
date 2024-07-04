export class EventCategory {
    constructor(id, name, display_order) {
        this.id = id;
        this.name = name;
        this.display_order = display_order;
    }

    verifyObject(){
        if(this.display_order !== null && this.display_order !== undefined && !Number.isInteger(parseFloat(this.display_order))){
            return "Error: 'display_order' debe ser un número entero.";
        }

        return true;
    }
}