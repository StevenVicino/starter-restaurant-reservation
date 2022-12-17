const knex = require("../db/connection");

function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
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

module.exports = {
  read,
  list,
  create,
  seat,
};
