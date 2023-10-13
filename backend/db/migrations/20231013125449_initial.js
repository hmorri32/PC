/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // TimeStamp,Ch4,C2H6,Latitude,Longitude
  return knex.schema.createTable('geolocationData', function (table) {
    table.increments('id').primary();
    table.string('TimeStamp');
    table.float('Latitude');
    table.float('Longitude');
    table.float('Ch4');
    table.float('C2H6');

    table.timestamps(false, false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('geolocationData');
};
