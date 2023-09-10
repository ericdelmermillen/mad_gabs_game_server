const fs = require('fs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const submitRouter = require('express').Router();

submitRouter.route('/gab')
  .post(async (req, res) => {

    if(!req.body.suggestedGab || !req.body.gabAnswer) {
      return res.status(401).json({
        message: "Missing email or password"
      });
    }

    if(!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    } else {
      
      const token = req.headers.authorization.split(" ")[1];
      
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log("Invalid token!");
          return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        
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
        
        transporter
        .sendMail(message)
        .catch(error => {
          return res.status(500).json({ error })
        });
      });
    }
  });


module.exports = submitRouter;