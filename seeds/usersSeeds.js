/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('gabs').del();
  await knex('gabs').insert([
    {
      id: 1,
      email: 'ericdemoemail@gmail.com',
      accountType: "premium", //
      facebook_id: "eric's facebook id",
      google_id: "eric's google id",
      facebook_tokens: [],
      google_tokens: []
    },
    {
      id: 2,
      email: 'amydemoemail@gmail.com',
      accountType: "premium",
      facebook_id: "amy's facebook id",
      google_id: "amy's google id",
      facebook_tokens: [],
      google_tokens: []
    }
  ]);
};




  // {
  //   id: 1,
  //   email: 'ericdelmermillen@gmail.com',
  //   accountType: "premium",
  //   created_at: 423763200,
  //   lastLogin: 423763200,
  //   totalPoints: 0,
  //   userName: "genericEric"
  // },
  // {
  //   id: 2,
  //   email: 'amithaMillensuwanta@gmail.com',
  //   accountType: "free",
  //   accountCreatedAt: 336384000,
  //   lastLogin: 423763200,
  //   totalPoints: 0,
  //   userName: "genericEric"
  // }