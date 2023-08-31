const knex = require("knex")(require("../knexfile"));
const config = require("../utils/config");
const { getPoints } = require("../utils/utilFunctions")

// for login essentials only

/* 

loginSignOn path:
  --post type: 

  --checks if user email/facebook_id/google_id exists; if not creates the new entry and adds the token to the column

  --if the user email/facebook_id/google_id exists it checks if the token exists and if not adds it to the respecitive column (array) 

  --checks profiles table referencing the userid which would be a foreign id on the profiles table

  --if the userid exists in the profile table and there is a username the response sends the user profile info data needed (username, total_points, rank [generated by sorting the profiles table by total points])

  --if the userid does not exist in the profile table it is created with all columns being populated with default data except for username; response with user profile sent and app checks if no username

  --if no username in response app directs/rendes the createUserName component and POST request is made with new username
  


createUsername path: called at login after social sign in if there is no userName on the user account:
  --POST



userDetails to get user points, rank:
  --



postPoints path on user round win: 
  --/:id/points
  --PUT



userLogout path:
  --POST
  --client redirects to login page after receiving the response
  --tell sso partner to invalidate



*/