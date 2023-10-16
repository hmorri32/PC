/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('buffer_geojson', (table) => {
    table.increments('id').primary();
    table.jsonb('data').notNull();
    table
      .integer('geojson_id')
      .unsigned()
      .references('id')
      .inTable('location_geojson')
      .unique()
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('buffer_geojson');
};
