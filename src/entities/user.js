export class User {
    constructor(id, first_name, last_name, username, password) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.password = password;
    }

    verifyObject(){
        if(this.first_name === undefined || this.first_name === null){
            return "Error: 'first_name' no puede ser null ni estar vacío.";
        }
        if(this.last_name === undefined || this.last_name === null){
            return "Error: 'last_name' no puede ser null ni estar vacío.";
        }
        if(this.username === undefined || this.username === null){
            return "Error: 'username' no puede ser null ni estar vacío.";
        }
        if(this.password === undefined || this.password === null){
            return "Error: 'password' no puede ser null ni estar vacío.";
        }
    }
}