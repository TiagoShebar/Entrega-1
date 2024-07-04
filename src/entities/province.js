export class Province {
    constructor(id, name, full_name, latitude, longitude, display_order) {
        this.id = id;
        this.name = name;
        this.full_name = full_name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.display_order = display_order;
    }

    verifyObject(){
        if(this.latitude !== undefined && this.latitude !== null && !Number.isInteger(parseFloat(this.latitude))){
            return "Error: 'latitude' debe ser un número entero.";
        }
        if(this.longitude !== undefined && this.longitude !== null && !Number.isInteger(parseFloat(this.longitude))){
            return "Error: 'longitude' debe ser un número entero.";
        }
        if(this.display_order !== undefined && this.display_order !== null && !Number.isInteger(parseFloat(this.display_order))){
            return "Error: 'display_order' debe ser un número entero.";
        }

        return true;

    }
}