//PUNTO 13, fijarse si funciona y si se ejcuta en algun momento
import express from "express";
import { EventLocationService } from "../services/event_location-service.js";
import { AuthMiddleware } from "../auth/authMiddleware.js";

const router = express.Router();
const eventLocationService = new EventLocationService();

router.get("/", AuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const allEventLocations = await eventLocationService.getAllEventLocations(userId);
        return res.status(200).json(allEventLocations);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.get("/:id", AuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const eventLocation = await eventLocationService.getEventLocationById(req.params.id, userId);
        if (eventLocation) {
            return res.status(200).json(eventLocation);
        } else {
            return res.status(404).send("Not found");
        }
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.post("/", AuthMiddleware, async (req, res) => {
    const eventLocation = req.body;
    eventLocation.id_creator_user = req.user.id;
    try {
        const createdEventLocation = await eventLocationService.createEventLocation(eventLocation);
        return res.status(201).json(createdEventLocation);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.put("/", AuthMiddleware, async (req, res) => {
    const eventLocation = req.body;
    eventLocation.id_creator_user = req.user.id;
    try {
        const updatedEventLocation = await eventLocationService.updateEventLocation(eventLocation);
        return res.status(200).json(updatedEventLocation);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.delete("/:id", AuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const deletedEventLocation = await eventLocationService.deleteEventLocation(req.params.id, userId);
        if (deletedEventLocation) {
            return res.status(200).json(deletedEventLocation);
        } else {
            return res.status(404).send("Not found");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default router;
