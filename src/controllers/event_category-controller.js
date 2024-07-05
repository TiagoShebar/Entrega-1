import express from "express";
import {EventCategoryService} from "../services/event_category-service.js";
import { EventCategory } from "../entities/event_category.js";
import { AuthMiddleware } from "../auth/AuthMiddleware.js";
import { verifyPaginationResources } from "../utils/functions.js";

const router = express.Router();
const eventCategoryService = new EventCategoryService();

router.get("/", async (req, res) => {
    let limit = req.query.limit;
    const page = req.query.page;

    let offset; 
    [limit, offset]= verifyPaginationResources(limit, page);
    if(isNaN(limit)){
        return res.status(400).send(limit);
    } else if (isNaN(limit)){
        return res.status(400).send(offset);
    }

    try{
        const allEventCategories = await eventCategoryService.getAllEvent_Category(limit, offset, req.originalUrl);
        return res.status(200).json(allEventCategories);
    }catch (e){ 
        return res.status(400).send(e);
    }
    
});

router.get("/:id", async (req, res) => {
    try {
        const event_category = await eventCategoryService.getEvent_CategoryById(req.params.id);
        if(!event_category){
            return res.status(404).send();
        }
        else{
            return res.status(200).json(event_category);
        }
    }
    catch (error){
        return res.status(400).send(error);
    }
});

router.post("/", async (req, res) => {
    const event_category = new EventCategory(
        null,
        req.body.name,
        req.body.display_order
    );


    const verificacion = event_category.verifyObject(false);
    if(verificacion !== true){
        return res.status(400).send(verificacion);
    }

    try {
        const event_categoryCreado = await eventCategoryService.createEventCategory(event_category);
        if(event_categoryCreado === true){
            return res.status(201).send();
        }
        else{
            return res.status(400).send(event_categoryCreado);
        }
        
    }
    catch (error){
        console.log(error);
        return res.status(400).send(error);
    }
});

router.put("/", async (req, res) => {
    const event_category = new EventCategory(
        req.body.id,
        req.body.name,
        req.body.display_order
    );

    const verificacion = event_category.verifyObject(true);
    if(verificacion !== true){
        return res.status(400).send(verificacion);
    }

    if(event_category.id === undefined){
        return res.status(400).send("id no puesto");
    }

    try {
        const result = await eventCategoryService.updateEventCategory(event_category);
        if(result === false){
            return res.status(404).send();
        }
        else if(result === true){
            return res.status(200).send();
        }
        else{
            return res.status(400).send(result);
        }
        
    }
    catch(error){
        return res.status(400).send(error);
    }
    
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try{
        const deleted = await eventCategoryService.deleteEventCategory(id);
        if(!deleted){
            return res.status(404).send();
        }
        return res.status(200).send();
    }
    catch(error){
        return res.status(400).send(error);
    }
});

export default router;

//PUNTO 12
/*
router.get("/", async (req, res) => {
    const limit = req.query.limit ?? null;
    const offset = req.query.offset ?? 1;

    const nextPage = req.originalUrl.replace(/(offset=)\d+/, 'offset=' + (parseInt(offset) + 1));

    try {
        const allEventCategories = await eventCategoryService.getEventCategory(limit, offset, nextPage);
        return res.status(200).json(allEventCategories);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const eventCategory = await eventCategoryService.getEventCategoryById(req.params.id);
        if (eventCategory) {
            return res.status(200).json(eventCategory);
        } else {
            return res.status(404);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post("/", AuthMiddleware, async (req, res) => {
    const eventCategory = new EventCategory(req.body);

    if (!verificarObjeto(eventCategory)) {
        return res.status(400).send("Bad request");
    }

    try {
        const eventCategoryCreado = await eventCategoryService.createEventCategory(eventCategory);
        return res.status(201).json(eventCategoryCreado);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.put("/", AuthMiddleware, async (req, res) => {
    const eventCategory = new EventCategory(req.body);

    if (!verificarObjeto(eventCategory)) {
        return res.status(400).send("Bad request");
    }

    try {
        const eventCategoryActualizado = await eventCategoryService.updateEventCategory(eventCategory);
        return res.status(200).json(eventCategoryActualizado);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.delete("/:id", AuthMiddleware, async (req, res) => {
    try {
        const eventCategoryEliminado = await eventCategoryService.deleteEventCategory(req.params.id);
        if (eventCategoryEliminado) {
            return res.status(200).json(eventCategoryEliminado);
        } else {
            return res.status(404).send("Not found");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default router;

*/