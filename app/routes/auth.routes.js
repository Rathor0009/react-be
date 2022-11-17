const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const jwt = require("jsonwebtoken");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.patch("/api/auth/update",controller.update)
  app.get("/api/auth/getuser",authJwt.verifyToken, controller.getuser);
};
