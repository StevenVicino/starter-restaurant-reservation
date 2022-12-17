/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

const props = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

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

function nanPeople(req, res, next) {
  const { people } = req.body.data;
  // const person = Number(people);
  if (typeof people !== "number" || people < 1) {
    return next({
      status: 400,
      message: `${people} is not a valid number of people`,
    });
  }
  next();
}

async function list(req, res) {
  const { date } = req.query;
  if (date) {
    const data = await reservationsService.list(date);
    return res.json({
      data: data,
    });
  }
  data = await reservationsService.list(new Date());
  res.json({
    data: data,
  });
}

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

async function create(req, res, next) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

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

function read(req, res, next) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

module.exports = {
  list,
  create: [
    hasProperties(props),
    invalidDate,
    invalidTime,
    nanPeople,
    notTuesday,
    futureDate,
    storeOpen,
    create,
  ],
  read: [validReservation, read],
};
