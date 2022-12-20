const tableService = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const hasProperties = require("../errors/hasProperties");

const props = ["table_name", "capacity"];

function validProps(req, res, next) {
  const { table_name, capacity } = req.body.data;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: "table_name must be two characters or more in length",
    });
  }
  if (!Number.isInteger(capacity) || capacity < 1) {
    return next({
      status: 400,
      message: "The capacity must be a number greater than 0",
    });
  }
  next();
}

async function validateData(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "Body must include a data object" });
  }

  next();
}

async function validReservation(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    return next({
      status: 400,
      message: `reservation_id does not exist`,
    });
  }
  const reservation = await reservationService.read(Number(reservation_id));
  if (!reservation) {
    return next({
      status: 404,
      message: `reservation_id ${reservation_id} does not exist`,
    });
  }
  res.locals.reservation = reservation;
  next();
}

async function tableExists(req, res, next) {
  const { tableId } = req.params;
  if (!tableId) {
    return next({
      status: 400,
      message: `table_id does not exist`,
    });
  }
  const table = await tableService.read(tableId);
  if (!table) {
    return next({
      status: 404,
      message: `table_id ${tableId} cannot be found`,
    });
  }

  res.locals.table = table;
  return next();
}

function read(req, res, next) {
  const { table } = res.locals;
  res.json({ data: table });
}

async function list(req, res, next) {
  const data = await tableService.list();
  res.json({ data: data });
}

async function create(req, res, next) {
  const data = await tableService.create(req.body.data);
  res.status(201).json({ data });
}

async function seat(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const { table_id } = res.locals.table;
  await tableService.seatReservation(reservation_id);
  const data = await tableService.seat(reservation_id, table_id);
  res.json({ data: data });
}

async function finish(req, res, next) {
  const { reservation_id } = res.locals.table;
  const { table_id } = res.locals.table;
  await tableService.finishTable(table_id);
  await tableService.finishReservation(reservation_id);
  res.json({ data: { status: "finished" } });
}

function hasCapacity(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;
  if (people > capacity) {
    return next({
      status: 400,
      message: "There are too many people for the capacity of this table",
    });
  }
  next();
}

async function checkStatus(req, res, next) {
  const { status } = res.locals.table;
  const { reservation_id } = req.body.data;
  const seated = await tableService.readByRes(reservation_id);
  console.log(reservation_id);
  if (status === "Occupied") {
    return next({
      status: 400,
      message: "Table status is occupied",
    });
  }
  if (seated) {
    return next({
      status: 400,
      message: "Table is already seated",
    });
  }
  next();
}

function isEmpty(req, res, next) {
  const { status } = res.locals.table;
  if (status == "Occupied") {
    return next();
  }
  next({
    status: 400,
    message: "Table status is not occupied",
  });
}

module.exports = {
  read: [tableExists, read],
  create: [hasProperties(props), validProps, create],
  seat: [
    validateData,
    tableExists,
    validReservation,
    hasCapacity,
    checkStatus,
    seat,
  ],
  list,
  finish: [tableExists, isEmpty, finish],
};
