import { query } from "express";
import { UserRepository } from "../../repositories/users-repository.js";

export class UsersService{
    constructor() {
        this.bd = new UserRepository();
    }

    async ValidarUsuario(username, password){
        const [success, token, statusCode, mensaje] = await this.bd.getUser(username, password);
        return [success, token, statusCode, mensaje];
    }

    async ValidarRegistro(user){
        const resultado = await this.bd.validateUsername(user);
        return resultado;
    }

    async GetUsernameById(id){
        const username = await this.bd.getUsernameById(id);
        return username;
    }
}