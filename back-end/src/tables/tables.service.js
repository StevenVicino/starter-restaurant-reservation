const knex = require("../db/connection");

function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

module.exports = {
  read,
};
