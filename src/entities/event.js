export class Event {
    constructor(id, name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.id_event_category = id_event_category;
        this.id_event_location = id_event_location;
        this.start_date = start_date;
        this.duration_in_minutes = duration_in_minutes;
        this.price = price;
        this.enabled_for_enrollment = enabled_for_enrollment;
        this.max_assistance = max_assistance;  
        this.id_creator_user = id_creator_user;
    }

    verifyObject() {
        // Validación para 'price'

        const parsedPrice = parseFloat(this.price);
        if (isNaN(parsedPrice)) {
            return "Error: 'price' debe ser un número decimal válido.";
        }
        this.price = parsedPrice; // Convertimos el valor a número si es válido

        // Validación para 'duration_in_minutes'
        if (!Number.isInteger(parseFloat(this.duration_in_minutes))) {
            return "Error: 'duration_in_minutes' debe ser un número entero.";
        }

        // Validación para 'max_assistance'
        if (!Number.isInteger(parseFloat(this.max_assistance))) {
            return "Error: 'max_assistance' debe ser un número entero.";
        }

        // Validación para 'id_event_category'
        if (this.id_event_category !== null && this.id_event_category !== undefined && !Number.isInteger(parseFloat(this.id_event_category))) {
            return "Error: 'id_event_category' debe ser un número entero.";
        }

        // Validación para 'id_event_location'
        if (this.id_event_location !== null && this.id_event_location !== undefined && !Number.isInteger(parseFloat(this.id_event_location))) {
            return "Error: 'id_event_location' debe ser un número entero.";
        }

        if(this.enabled_for_enrollment !== null && this.enabled_for_enrollment !== undefined && typeof this.enabled_for_enrollment !== "boolean"){
            return "Error: 'enabled_for_enrollment' debe ser un boolean.";
        }


        return true;
    }
}