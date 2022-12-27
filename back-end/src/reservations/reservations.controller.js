/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const props = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//Middleware Validation Functions

//Validates the date
function invalidDate(req, res, next) {
  const { reservation_date } = req.body.data;
  if (new Date(reservation_date) == "Invalid Date") {
    return next({
      status: 400,
      message: `The reservation_date is an invalid date`,
    });
  }
  next();
}
//Validates the time
function invalidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  regexp = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
  if (!regexp.test(reservation_time)) {
    return next({
      status: 400,
      message: `The reservation_time is an invalid time`,
    });
  }
  next();
}
//Validates the people are a number greater than zero
function nanPeople(req, res, next) {
  const { people } = req.body.data;
  if (typeof people !== "number" || people < 1) {
    return next({
      status: 400,
      message: `${people} is not a valid number of people`,
    });
  }
  next();
}
//Validates the date is not Tuesday
function notTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const day = new Date(reservation_date).getUTCDay();
  if (day === 2) {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesday",
    });
  }
  next();
}
//Validates the time is between 10:30am and 9:30pm
function storeOpen(req, res, next) {
  const { reservation_time } = req.body.data;
  const hours = reservation_time.substring(0, 2);
  const min = reservation_time.substring(3, 5);
  if (
    hours < 11 ||
    (hours <= 10 && min < 30) ||
    hours > 22 ||
    (hours >= 21 && min > 30)
  ) {
    return next({
      status: 400,
      message:
        "The store is closed.  Please reserve your seat between 10:30am and 9:30pm.",
    });
  }
  next();
}
//Validates the date and time is in the future
function futureDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const date = new Date(`${reservation_date}T${reservation_time}`);
  if (date < new Date()) {
    return next({
      status: 400,
      message: "Reservation must be in the future",
    });
  }
  next();
}
//Validates that the status is booked
function incorrectStatus(req, res, next) {
  const { status } = req.body.data;
  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `Status must not be ${status}`,
    });
  }
  next();
}
//Validates the reservation exists
async function validReservation(req, res, next) {
  const { reservationId } = req.params;

  if (!reservationId) {
    return next({
      status: 404,
      message: `Please enter a reservation Id`,
    });
  }
  const reservation = await reservationsService.read(reservationId);
  if (!reservation) {
    return next({
      status: 404,
      message: `${reservationId} does not exist`,
    });
  }
  res.locals.reservation = reservation;
  next();
}
//Checks if status is finished
function checkStatusBooked(req, res, next) {
  if (req.body.data.status === "unknown") {
    return next({
      status: 400,
      message: `Status unknown, status must equal booked to seat customer`,
    });
  }
  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: `Status finished, status must equal booked to seat customer`,
    });
  }
  next();
}

//  CRUD Functions

async function create(req, res, next) {
  req.body.data.status = "booked";
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) {
    const data = await reservationsService.listByDate(date);
    const result = data.filter((res) => res.status !== "finished");
    return res.json({
      data: result,
    });
  } else if (mobile_number) {
    const data = await reservationsService.listByPhone(mobile_number);
    const result = data.filter((res) => res.status !== "finished");
    return res.json({
      data: result,
    });
  }
  data = await reservationsService.list(new Date());
  const result = data.filter((res) => res.status !== "finished");
  res.json({
    data: result,
  });
}

function read(req, res, next) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

//Updates entire reservation
async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
  };
  const data = await reservationsService.update(updatedReservation);
  res.json({ data: data });
}

//Updates reservation status
async function newStatus(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  let data = await reservationsService.newStatus(reservation_id, status);
  res.json({ data: { status: data[0].status } });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasProperties(props),
    invalidDate,
    invalidTime,
    nanPeople,
    notTuesday,
    futureDate,
    storeOpen,
    incorrectStatus,
    asyncErrorBoundary(create),
  ],
  read: [validReservation, asyncErrorBoundary(read)],
  update: [
    hasProperties(props),
    validReservation,
    invalidDate,
    invalidTime,
    nanPeople,
    notTuesday,
    futureDate,
    storeOpen,
    asyncErrorBoundary(update),
  ],
  newStatus: [
    validReservation,
    checkStatusBooked,
    asyncErrorBoundary(newStatus),
  ],
};
