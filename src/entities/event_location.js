export class EventLocation {
    constructor(id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) {
        this.id = id;
        this.id_location = id_location;
        this.name = name;
        this.full_address = full_address;
        this.max_capacity = max_capacity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.id_creator_user = id_creator_user;
    }

    verifyObject() {
        // Validación para 'max_capacity'
            const parsedValue = parseFloat(this.max_capacity);
            if (isNaN(parsedValue)) {
                return "Error: 'max_capacity' debe ser un número decimal válido.";
            }
            this.max_capacity = parsedValue; // Convertimos el valor a número si es válido
        

        // Validación para 'latitude'
        if (this.latitude !== null && this.latitude !== undefined) {
            const latitudeValue = parseFloat(this.latitude);
            if (isNaN(latitudeValue)) {
                return "Error: 'latitude' debe ser un número decimal válido.";
            }
            this.latitude = latitudeValue; // Convertimos el valor a número si es válido
        }

        // Validación para 'longitude'
        if (this.longitude !== null && this.longitude !== undefined) {
            const longitudeValue = parseFloat(this.longitude);
            if (isNaN(longitudeValue)) {
                return "Error: 'longitude' debe ser un número decimal válido.";
            }
            this.longitude = longitudeValue; // Convertimos el valor a número si es válido
        }

        // Validación para 'id_location'
            if (!Number.isInteger(parseFloat(this.id_location))) {
                return "Error: 'id_location' debe ser un número entero.";
            }
        

        return true;
    }
}
