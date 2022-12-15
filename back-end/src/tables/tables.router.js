const router = require("express").Router();
const controller = require("./tables.service");

router.route(":/tableId").get(controller.read);

module.exports = router;
