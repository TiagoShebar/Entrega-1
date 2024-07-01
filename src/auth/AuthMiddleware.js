import { decryptToken } from "./jwt.js";

export function AuthMiddleware(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send("No tienes autorización");
    }
    else{
        const token = req.headers.authorization.split(' ')[1];
        console.log('Token recibido:', token); // Verifica si el token se está recibiendo correctamente

        try {
            const decryptedToken = decryptToken(token);
            console.log('Token decodificado:', decryptedToken); // Verifica el objeto decodificado

            if (!decryptedToken) {
                return res.status(401).send("Token inválido");
            }

            req.user = decryptedToken;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send("Token ha expirado, por favor inicie sesión nuevamente.");
            } else {
                return res.status(500).send("Error interno del servidor");
            }
        }
    }
}
