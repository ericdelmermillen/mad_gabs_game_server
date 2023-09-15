exports.up = function (knex) {
  return knex.schema.createTable
  ('users', (table) => {
    table.increments('mgUserId').primary();
    table.string('userName').nullable();
    table.string('email').nullable();
    table.string('password').nullable();
    table.string('googleId').nullable();
    table.string('facebookId').nullable();
    table.integer('totalPoints').notNullable();
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};

