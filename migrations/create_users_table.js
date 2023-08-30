exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable();
    table.string('facebook_id');
    table.string('google_id');
    // table.json('facebook_tokens'); 
    // table.json('google_tokens'); 
    table.timestamps(true, true); // Automatically adds created_at and updated_at columns
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
