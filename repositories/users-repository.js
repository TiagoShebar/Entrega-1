import pg from 'pg';
import { DBConfig } from "./dbconfig.js";
import { createToken } from "../src/auth/jwt.js";


export class UserRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getUser(username, password) {
        try {
            const query = "SELECT id, username, password FROM users WHERE username = $1 AND password = $2"; 
            const values = [username, password];
            const respuesta = await this.DBClient.query(query, values);
            if(respuesta.rowCount > 0){
                const token = createToken(respuesta.rows);
                console.log(token);
                return [true, token, 200, "Usuario encontrado"];
            }
            else{
                return [false, "", 401, "Usuario o clave inválida."];
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async validateUsername(user){
        try {
            
            var query = "SELECT * FROM users WHERE username = $1";
            var values = [user.username];
            var respuesta = await this.DBClient.query(query, values);
            if(respuesta.rowCount > 0){
                return false;
            }
            else{
                console.log(user);
                query = "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)";
                values = [user.first_name, user.last_name, user.username, user.password];
                respuesta = await this.DBClient.query(query, values);
                return true;
            }
            
        }
        catch(error){
            console.log(error);
        }
    }   
    
    async getUsernameById(id){
        try{
            const query = "SELECT username FROM users WHERE id = $1";
            const values = [id];

            const username = await this.DBClient.query(query,values);

            return username.rows[0];
        }
        catch(error){
            console.log(error);
        }
    }
}