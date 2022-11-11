const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/file.controller");
//  const app()
let routes = app => {
  router.get("/", homeController.getHome);

 
  router.post("/upload", uploadController.upload);
  router.get("/files", uploadController.getListFiles);
  router.get("/files/:name", uploadController.download);

  return app.use("/", router);
  
};

module.exports = routes;