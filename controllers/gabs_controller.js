const knex = require("knex")(require("../knexfile"));
const config = require("../utils/config");


const getRandom = (req, res) => {
  
  knex("gabs")
  .select("*")
  .where({ level: req.headers.level })
  // .where({ level: req.body.level })
    .then((gabs) => {
      if (gabs.length === 0) {
        return res
        .status(404)
        .json(`No ${req.body.level} gabs found`);
      }

      const randomIndex = Math.floor(Math.random() * gabs.length);

      const gabData = gabs[randomIndex];

      res.status(200).json(gabData);
    })
    .catch(() => {
      res.status(500).send("Server Error getting gabs data.");
    });
};

module.exports = getRandom;