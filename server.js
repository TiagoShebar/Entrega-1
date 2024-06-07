import express from "express";
import EventsController from './src/controllers/events-controller.js';
import UsersController from './src/controllers/users-controller.js';
import ProvincesController from './src/controllers/provinces-controller.js';
import EventCategoryController from './src/controllers/event_category-controller.js';
import LocationController from './src/controllers/location-controller.js';
import EventLocationController from './src/controllers/event_location-controller.js';

const app = express(); //Init API REST
app.use(express.json());
const port = 3508;

app.use("/api/event", EventsController);
app.use("/api/user", UsersController);
app.use("/api/province", ProvincesController); 
app.use("/api/event-category", EventCategoryController); 
app.use("/api/location", LocationController); 
app.use("/api/event-location", EventLocationController);
//app.use(ErrorMiddleware);
app.listen(port, () => {
    console.log(`Server is runing on port ${port}`);
})