const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const nodemailer = require('nodemailer');

const submitRouter = require('express').Router();

submitRouter.route('/gab')
  .post(async (req, res) => {

    console.log("from 5000")
    console.log(req.query)

    res.status(201)
      .json({
        message: "Thanks for the suggested Gab!"
      })

    let config = {
      service : 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }
    }

    let transporter = nodemailer.createTransport(config);

    let message = {
      from: '"Mad Gabs Game Admin" <madgabsgame@gmail.com>',
      to: "ericdelmermillen@gmail.com",
      subject: "User Suggested Gab",
      text: `Suggested Gab: "${req.body.suggestedGab}"; Answer: "${req.body.gabAnswer}";`,
      html: `<b>Suggested Gab: "${req.body.suggestedGab}"; Answer: "${req.body.gabAnswer}";</b>`,
    };

    transporter.sendMail(message).then((info) => {

      // return res.status(201)
      // .json({
      //   message: "Thanks for the suggested Gab!"
      // })
      
    }).catch(error => {
      return res.status(500).json({ error })
  })
}); 


module.exports = submitRouter;