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

    verifyObject(isUpdate = false) {
        // Validación para 'max_capacity'
        const parsedMaxCapacity = parseFloat(this.max_capacity);
        if (this.max_capacity !== undefined && (isNaN(parsedMaxCapacity) || this.max_capacity === null)) {
            return "Error: 'max_capacity' debe ser un número decimal válido y no puede ser nulo.";
        }
        if (this.max_capacity !== undefined) {
            this.max_capacity = parsedMaxCapacity; // Convertimos el valor a número si es válido
        }
    
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
        if (!isUpdate && (this.id_location === undefined || this.id_location === null)) {
            return "Error: 'id_location' es un campo obligatorio.";
        }
        if (this.id_location !== undefined && (isNaN(parseFloat(this.id_location)) || !Number.isInteger(parseFloat(this.id_location)))) {
            return "Error: 'id_location' debe ser un número entero válido y no puede ser nulo.";
        }
    
        return true;
    }
    
}
