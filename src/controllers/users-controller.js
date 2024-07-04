import express from "express";
import {UsersService} from "../services/users-service.js";
import { User } from "../entities/user.js";
import { verifyLength } from "../utils/functions.js"; 

const router = express.Router();
const userService = new UsersService();

router.post("/login", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if(!validarFormatoEmail(username)){
        return res.status(400).send({
            success: false,
            message: "El email es invalido.",
            token: ""
        });
    }
    else{
        if(username && password){
            const [success, token, statusCode, mensaje] = await userService.ValidarUsuario(username, password);
            return res.status(statusCode).send({
                success: success,
                message: mensaje,
                token: token
            });
        }
        else{
            return res.status(400).send();
        }
    }
    
});

router.post("/register", async (req,res)=>{
    const user = new User(
        null,
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        req.body.password
    );

    const verificacion = user.verifyObject();
    if(verificacion !== true){
        return res.status(400).send(verificacion);
    }
        
        if(!validarFormatoEmail(user.username)){
            return res.status(400).send("El email es invalido.");
        }
        const mensaje = revisarCampos(user);
        console.log(mensaje);
        if(mensaje !== null){
            return res.status(400).send(mensaje);
        }
        else{
            const respuesta = await userService.ValidarRegistro(user);
            if(respuesta === true){
                return res.status(201).send();
            }
            else{
                return res.status(400).send("ya existe el nombre de usuario");
            }
        }
    
});

const validarFormatoEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

const revisarCampos = (user) => {
    if(!verifyLength(user.first_name) || !verifyLength(user.last_name)){
        return "El nombre y apellido deben tener al menos 3 caracteres";
    }
    else if(!verifyLength(user.password)){
        return "La contraseña debe tener al menos 3 caracteres";
    }
    return null;
}

export default router;