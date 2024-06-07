import express from "express";
import {LocationService} from "../services/location-service.js";
import { AuthMiddleware } from "../auth/authMiddleware.js";

const router = express.Router();
const locationService = new LocationService();

router.get("/", async (req, res) => {
    const limit = req.query.limit ?? null;
    const offset = req.query.offset ?? 1;

    const nextPage = req.originalUrl.replace(/(offset=)\d+/, 'offset=' + (parseInt(offset) + 1));
    console.log(nextPage);

    try{
        const allLocations = await locationService.getLocations(offset, limit, nextPage);
        return res.status(200), json(allLocations);
    }catch { 
        return res.status(500).send(error);
    }
    
});

router.get("/:id", async (req, res) => {
    try {
        const location = await LocationService.getLocationById(req.params.id);
        if(location){
            return res.status(200), json(location);
        }
        else{
            return res.status(404);
        }
    }
    catch {
        return res.status(500).send(error);
    }
    
});

router.get("/:id/event_location", async (req, res) => {
    try {
        const location = await LocationService.getLocationById(req.params.id);
        if(location){
            return res.status(200), json(location);
        }
        else{
            return res.status(404);
        }
    }
    catch {
        return res.status(500).send(error);
    }
    
});
//PUNTO 11
/*
router.get("/:id", async (req, res) => {
    try {
        const location = await locationService.getLocationById(req.params.id);
        if (location) {
            return res.status(200).json(location);
        } else {
            return res.status(404).send("Location not found");
        }
    } catch (error) {
        console.error("Error while fetching location:", error);
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/:id/event_location", AuthMiddleware, async (req, res) => {
    try {
        const locationId = req.params.id;
        // Verificar si el usuario autenticado tiene permiso para acceder a los event-locations de esta location

        // Aquí puedes agregar la lógica para verificar la autenticación y los permisos del usuario

        const eventLocations = await locationService.getEventLocationsByLocationId(locationId);
        return res.status(200).json(eventLocations);
    } catch (error) {
        console.error("Error while fetching event locations:", error);
        return res.status(500).send("Internal Server Error");
    }
});

*/


export default router;