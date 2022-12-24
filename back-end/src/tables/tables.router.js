const router = require("express").Router();
const methodNotAllowed = require("../errors/MethodNotAllowed");
const controller = require("./tables.controller");

router
  .route("/:tableId/seat")
  .put(controller.seat)
  .delete(controller.finish)
  .all(methodNotAllowed);

router.route("/:tableId").get(controller.read).all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
