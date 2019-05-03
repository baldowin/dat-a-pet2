var passport = require("./config/passport.js");
var db = require("./models");
var express = require("express");
var session = require("express-session");
var path = require("path");
var app = express();
var PORT = process.env.PORT || 3001;
//tion stuff need to be here

// var isAuthenticated = require("../config/middleware/isAuthenticated");
// var isOwner = require("../config/middleware/isOwner");
// var isAdmin = require("../config/middleware/isAdmin")
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: "jamesCat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

var syncOptions = { force: false };
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

  app.use(express.static("public"));

// Define API routes here
//Project 2- does this route need to be a server route for authentication

app.get("/login", function (req, res) {
  if (req.user) {
    res.redirect("/dashboard");
  } else {
    // res.render("login");
    res.render("/signup");
  }
});

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// app.listen(PORT, () => {
//   console.log(`🌎 ==> API server now on port ${PORT}!`);
// });


// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}else{
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});