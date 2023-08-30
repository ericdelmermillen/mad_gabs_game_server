exports.up = function (knex) {
  return knex.schema.createTable
  ('gabs', (table) => {
    table.increments('id').primary();
    table.string('question').notNullable();
    table.string('answer').notNullable();
    table.string('level').notNullable();
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('gabs');
};
