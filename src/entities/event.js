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

    verifyObject(isUpdate = false) {
        // Validación para 'price'
        const parsedPrice = parseFloat(this.price);
        if (this.price !== undefined && (isNaN(parsedPrice) || this.price === null)) {
            return "Error: 'price' debe ser un número decimal válido y no puede ser nulo.";
        }
        if (this.price !== undefined) {
            this.price = parsedPrice; // Convertimos el valor a número si es válido
        }
        
        if(this.start_date !== undefined && this.start_date !== null){
            const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
            // Verificar si la fecha coincide con el formato
            if (!regex.test(this.start_date)) {
                return "Error: La fecha debe seguir el formato 'YYYY-MM-DDTHH:MM:SS'.";
            }
        }
        

        // Validación para 'duration_in_minutes'
        const parsedDuration = parseFloat(this.duration_in_minutes);
        if (this.duration_in_minutes !== undefined && (!Number.isInteger(parsedDuration) || this.duration_in_minutes === null)) {
            return "Error: 'duration_in_minutes' debe ser un número entero válido y no puede ser nulo.";
        }
    
        // Validación para 'max_assistance'
        const parsedMaxAssistance = parseFloat(this.max_assistance);
        if (this.max_assistance !== undefined && (!Number.isInteger(parsedMaxAssistance) || this.max_assistance === null)) {
            return "Error: 'max_assistance' debe ser un número entero válido y no puede ser nulo.";
        }
    
        // Validación para 'id_event_category'
        if (this.id_event_category !== null && this.id_event_category !== undefined && !Number.isInteger(parseFloat(this.id_event_category))) {
            return "Error: 'id_event_category' debe ser un número entero.";
        }
    
        // Validación para 'id_event_location'
        if (this.id_event_location !== null && this.id_event_location !== undefined && !Number.isInteger(parseFloat(this.id_event_location))) {
            return "Error: 'id_event_location' debe ser un número entero.";
        }
    
        // Validación para 'enabled_for_enrollment'
        if (this.enabled_for_enrollment !== null && this.enabled_for_enrollment !== undefined && typeof this.enabled_for_enrollment !== "boolean") {
            return "Error: 'enabled_for_enrollment' debe ser un boolean.";
        }


    
        // Validación de campos obligatorios solo en inserción
        if (!isUpdate) {
            if (this.price === undefined || this.price === null) {
                return "Error: 'price' es un campo obligatorio.";
            }
            if (this.duration_in_minutes === undefined || this.duration_in_minutes === null) {
                return "Error: 'duration_in_minutes' es un campo obligatorio.";
            }
            if (this.max_assistance === undefined || this.max_assistance === null) {
                return "Error: 'max_assistance' es un campo obligatorio.";
            }
        }
    
        return true;
    }
    
}