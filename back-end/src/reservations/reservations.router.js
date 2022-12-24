/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const methodNotAllowed = require("../errors/MethodNotAllowed");
const controller = require("./reservations.controller");

router
  .route("/:reservationId/status")
  .put(controller.newStatus)
  .all(methodNotAllowed);

router
  .route("/:reservationId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
