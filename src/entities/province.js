export class Province {
    constructor(id, name, full_name, latitude, longitude, display_order) {
        this.id = id;
        this.name = name;
        this.full_name = full_name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.display_order = display_order;
    }

    verifyObject(isUpdate = false) {
        // Validación para 'latitude'
        if (this.latitude !== undefined && this.latitude !== null) {
            const latitudeValue = parseFloat(this.latitude);
            if (isNaN(latitudeValue) || !Number.isInteger(latitudeValue)) {
                return "Error: 'latitude' debe ser un número entero válido.";
            }
            this.latitude = latitudeValue;
        }
    
        // Validación para 'longitude'
        if (this.longitude !== undefined && this.longitude !== null) {
            const longitudeValue = parseFloat(this.longitude);
            if (isNaN(longitudeValue) || !Number.isInteger(longitudeValue)) {
                return "Error: 'longitude' debe ser un número entero válido.";
            }
            this.longitude = longitudeValue;
        }
    
        // Validación para 'display_order'
        if (this.display_order !== undefined && this.display_order !== null) {
            const displayOrderValue = parseFloat(this.display_order);
            if (isNaN(displayOrderValue) || !Number.isInteger(displayOrderValue)) {
                return "Error: 'display_order' debe ser un número entero válido.";
            }
            this.display_order = displayOrderValue;
        }
    
        return true;
    }
    
}