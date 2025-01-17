const knex = require("../db/connection");

function listByDate(query) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_date": query })
    .orderBy("r.reservation_time");
}

function listByPhone(query) {
  return knex("reservations as r")
    .select("*")
    .where("r.mobile_number", "like", `%${query}%`)
    .orderBy("r.reservation_time");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((update) => update[0]);
}

function newStatus(reservationId, nStatus) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .update({ status: `${nStatus}` }, "*");
}

module.exports = {
  listByDate,
  listByPhone,
  create,
  read,
  update,
  newStatus,
};
