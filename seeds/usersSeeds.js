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
      email: 'ericdelmermillen@gmail.com',
      accountType: "premium",
      accountCreatedAt: 423763200,
      lastLogin: 423763200,
      totalPoints: 0,
      userName: "genericEric"
    },
    {
      id: 2,
      email: 'amithaMillensuwanta@gmail.com',
      accountType: "free",
      accountCreatedAt: 336384000,
      lastLogin: 423763200,
      totalPoints: 0,
      userName: "genericEric"
    },
    {
      id: 2,
      question: 'Cough He Anchor Ream',
      answer: 'coffee and cream',
      level: 'easy',
    }
  ]);
};