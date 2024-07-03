import express from "express";
import {LocationService} from "../services/location-service.js";
import { AuthMiddleware } from "../auth/AuthMiddleware.js";
import { verifyPaginationResources } from "../utils/functions.js";

const router = express.Router();
const locationService = new LocationService();

router.get("/", async (req, res) => {
    let limit = req.query.limit;
    const page = req.query.page;

    const offset = verifyPaginationResources(limit, page);
    if(isNaN(offset)){
        return res.status(400).send(offset);
    }

    try{
        const allLocations = await locationService.getAllLocations(offset, limit, req.originalUrl);
        return res.status(200).json(allLocations);
    }catch (error) { 
        return res.status(400).send(error);
    }
    
});

router.get("/:id", async (req, res) => {
    try {
        const location = await locationService.getLocationById(req.params.id);
        if(location != null){
            return res.status(200).json(location);
        }
        else{
            return res.status(404).send();
        }
    }
    catch (error) {
        return res.status(400).send(error);
    }
    
});

router.get("/:id/event_location", AuthMiddleware, async (req, res) => {
    let limit = req.query.limit;
    const page = req.query.page;

    const offset = verifyPaginationResources(limit, page);
    if(isNaN(offset)){
        return res.status(400).send(offset);
    }

    try {
        const event_locations = await locationService.getEventLocationsByIdLocation(limit, offset, req.originalUrl, req.params.id);
        if(event_locations != -1){
            return res.status(200).json(event_locations);
        }
        else{
            return res.status(404).send();
        }
    }
    catch (error) {
        return res.status(400).send(error);
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