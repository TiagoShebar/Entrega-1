import express from "express";
import {ProvincesService} from "../services/provinces-service.js";
import { Province } from "../entities/province.js";
import { AuthMiddleware } from "../auth/authMiddleware.js";
import { verificarObjeto } from "../utils/objetoVerificacion.js";

const router = express.Router();
const provinceService = new ProvincesService();

router.post("/", AuthMiddleware, async (req,res)=>{
    var province = new Province();
    province = {
        name: req.body.name,
        full_name: req.body.full_name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        display_order: req.body.display_order
    }

    if(province.display_order === undefined){
        province.display_order = null;
    }
    
    if(verificarObjeto(province)){
        const [provincia,mensaje] = await provinceService.createProvince(province);
        if(provincia){
            return res.status(201).send();  
        }
        else{
            return res.status(400).send(mensaje);
        }
    }
    return res.status(400).send("Error en los campos");
});


router.put( "/", AuthMiddleware, async (req,res) =>{
    var province = new Province();
    province = {
        id: req.body.id,
        name: req.body.name,
        full_name: req.body.full_name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        display_order: req.body.display_order
    }

    if(province.id === undefined){
        return res.status(400).send();
    }else{
        const [provincia,mensaje] = await provinceService.updateProvince(province);
        if(provincia){
            return res.status(200).send();
        }
        else if(mensaje !== null){
            return res.status(400).send(mensaje);
        }
        else{
            return res.status(404).send();
        }
        
    }
        
});

router.delete( "/:id", AuthMiddleware, async (req,res) =>{
    const deleted = await provinceService.deleteProvince(req.params.id);
    if(deleted > 0){
        return res.status(200).send(deleted);
    }
    else{
        return res.status(404).send();
    }
    
});

router.get("/", async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;

    try{
        const provinces = await provinceService.getAllProvinces(limit, offset, req.originalUrl);
        return res.status(200).json(provinces);
    }catch(error){ 
        return res.json("Un Error");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const province = await provinceService.getProvinceById(req.params.id);
        if(province.length > 0){
            return res.status(200).json(province);
        }else{
            return res.status(404).send();
        }
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.get("/:id/locations", async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;
    try {
        const locations = await provinceService.getLocationsByProvinceId(limit, offset, req.originalUrl, req.params.id);
        if(locations){
            return res.status(200).json(locations);
        }else{
            return res.status(404).send();
        }
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

export default router;