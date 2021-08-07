const Router = require("express").Router;
const controllers = require("./controllers");

const router = Router();
router.post("/cut", controllers.shortening);

router.post("/register", controllers.register);
router.post("/login", controllers.login);

router.post("/checkToken", controllers.checkToken);

module.exports = router;
