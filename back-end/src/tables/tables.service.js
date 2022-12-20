const { where } = require("../db/connection");
const knex = require("../db/connection");

function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

function readByRes(reservation_id) {
  return knex("tables")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function list() {
  return knex("tables").select("*").orderBy("table_name");
}
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function seat(reservation_id, table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .update({ reservation_id: reservation_id, status: "Occupied" });
}

function seatReservation(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .update({ status: "seated" });
}

function finishTable(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .update({ reservation_id: null, status: "free" });
}

function finishReservation(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .update({ status: "finished" });
}

module.exports = {
  read,
  list,
  create,
  seat,
  seatReservation,
  finishTable,
  finishReservation,
  readByRes,
};
