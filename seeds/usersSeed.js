/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  await knex('users').del();
  await knex('users').insert([
    {
      mgUserId: 1,
      userName: null,
      email: "ericdelmermillen@gmail.com",
      password: "$2b$10$fPE73DoIiBjZ3Ens2WdbneKq2ie80olu2Ij0lfni7YfGI9Zmx8jiW",
      googleId: null,
      facebookId: null,
      totalPoints: 0
    }
  ]);
};