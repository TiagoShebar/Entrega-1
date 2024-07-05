export class EventCategory {
    constructor(id, name, display_order) {
        this.id = id;
        this.name = name;
        this.display_order = display_order;
    }

    verifyObject(isUpdate = false) {
        // Validación para 'display_order'
        if (this.display_order !== null && this.display_order !== undefined) {
            const displayOrderValue = parseFloat(this.display_order);
            if (isNaN(displayOrderValue) || !Number.isInteger(displayOrderValue)) {
                return "Error: 'display_order' debe ser un número entero válido.";
            }
            this.display_order = displayOrderValue;
        }
    
        return true;
    }
}