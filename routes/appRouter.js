const { Router } = require("express");
const appRouter = Router();
const appController = require("../controllers/appController");

appRouter.get("/", appController.getHome);

appRouter.get("/categories", appController.getCategories);
appRouter.post("/categories", appController.createCategory);
appRouter.delete("/categories/:id", appController.deleteCategory);

appRouter.get("/items", appController.getItems);
appRouter.post("/items", appController.createItem);
appRouter.delete("/items/:id", appController.deleteItem);

appRouter.post("/admin", appController.verifyAdmin);


module.exports = appRouter;