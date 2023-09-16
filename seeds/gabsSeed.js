/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  await knex('gabs').del();
  await knex('gabs').insert([
    {
      id: 1,
      question: 'Abe An An Appeal',
      answer: 'a banana peel',
      level: 'easy',
    },
    {
      id: 2,
      question: 'Cough He Anchor Ream',
      answer: 'coffee and cream',
      level: 'easy',
    },
    {
      id: 3,
      question: 'Ache Arf Own',
      answer: 'a car phone',
      level: 'easy',
    },
    {
      id: 4,
      question: 'Stirring Beak He Knee',
      answer: 'string bikini',
      level: 'easy',
    },
    {
      id: 5,
      question: 'Abe Less Sing',
      answer: 'a blessing',
      level: 'easy',
    },
    {
      id: 6,
      question: 'Hiney Duck Hiss',
      answer: 'I need a kiss',
      level: 'easy',
    },
    {
      id: 7,
      question: 'Faye Stew Phase',
      answer: 'face to face',
      level: 'easy',
    },
    {
      id: 8,
      question: 'May Pulls Ear Up',
      answer: 'maple syrup',
      level: 'easy',
    },
    {
      id: 9,
      question: 'Dawn Jury Memeber',
      answer: 'don\'t you remember',
      level: 'easy',
    },
    {
      id: 10,
      question: 'Reel Ace Shun Ship',
      answer: 'relationship',
      level: 'easy',
    },
    {
      id: 11,
      question: 'Coal Esther Haul',
      answer: 'cholesterol',
      level: 'medium',
    },
    {
      id: 12,
      question: 'Sand Tackle Laws',
      answer: 'Santa Claus',
      level: 'medium',
    },
    {
      id: 13,
      question: 'Meek Came How\'s',
      answer: 'Mickey Mouse',
      level: 'medium',
    },
    {
      id: 14,
      question: 'May Kick Wick',
      answer: 'make it quick',
      level: 'medium',
    },
    {
      id: 15,
      question: 'Depot Stall Fizz',
      answer: 'the post office',
      level: 'medium',
    },
    {
      id: 16,
      question: 'Dump Hick Yearn Hose',
      answer: 'don\'t pick your nose',
      level: 'medium',
    },
    {
      id: 17,
      question: 'Eight Roost Oar He',
      answer: 'a true story',
      level: 'medium',
    },
    {
      id: 18,
      question: 'Why Tail Huff Hunt',
      answer: 'white elephant',
      level: 'medium',
    },
    {
      id: 19,
      question: 'Ape Hand Hub Hair',
      answer: 'a panda bear',
      level: 'medium',
    },
    {
      id: 20,
      question: 'Us My Leaf Ace',
      answer: 'a smiley face',
      level: 'medium',
    },
    {
      id: 21,
      question: 'Knoll Heft Earn',
      answer: 'no left turn',
      level: 'hard',
    },
    {
      id: 22,
      question: 'Broth Errands Hissed Her',
      answer: 'brother and sister',
      level: 'hard',
    },
    {
      id: 23,
      question: 'Aim Odours Highs Gull',
      answer: 'a motorcycle',
      level: 'hard',
    },
    {
      id: 24,
      question: 'Age Happen He Scar',
      answer: 'a Japanese car',
      level: 'hard',
    },
    {
      id: 25,
      question: 'Dawned Rink Hand Arrive',
      answer: 'don\'t drink and drive',
      level: 'hard',
    },
    {
      id: 26,
      question: 'Ache Inks High Sped',
      answer: 'a king size bed',
      level: 'hard',
    },
    {
      id: 27,
      question: 'Burr Itch Overt Rubble Otter',
      answer: 'bridge over troubled water',
      level: 'hard',
    },
    {
      id: 28,
      question: 'Eighty Part Mints Tore',
      answer: 'a department store',
      level: 'hard',
    },
    {
      id: 29,
      question: 'Eight Hoist Oar',
      answer: 'a toy store',
      level: 'hard',
    },
    {
      id: 30,
      question: 'House Wheat This Hound',
      answer: 'how sweet the sound',
      level: 'hard',
    },
  ]);
};