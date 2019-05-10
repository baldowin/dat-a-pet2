var db = require("../models");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");
var isOwner = require("../config/middleware/isOwner");
var isAdmin = require("../config/middleware/isOwner");
var path = require("path");
var Sequelize = require("sequelize");
var Op = Sequelize.Op;



////////////////////THIS FILE HAS ISAUTHENTICATED AND ISOWNER REMOVED/////////////////////




module.exports = function (app) {
  ///////////////////////ADMIN ADMIN ADMIN ADMIN ADMIN//////////////////////////////

  //admin routes
  app.get("/api/admin/pets", function (req, res) {
    db.Owner.findAll({
      include: [db.Pet]
    }).then(function (view) {
      res.json(view);
    });
  });

  app.get("/api/admin/owners", function (req, res) {
    db.Owner.findAll({
    }).then(function (view) {
      res.json(view);
    });
  });


  ///////////////////USER USER USER USER USER///////////////////////////////////

  // app.get("/api/users/associatedPets/:email", function (req, res) {
  //   db.Owner.findOne({
  //     where: { UserEmail: req.params.email }
  //   }).then(function (Owner) {
  //     Owner.getPets({through: Agents}).then(function (associatedPets) {
  //       console.log("associatedPets");
  //       console.log(associatedPets);
  //       let whereCondition = [];
  //       associatedPets.forEach(function (petObject) {
  //         whereCondition.push({ "petId": petObject.petId });
  //       })
  //       db.Pet.findAll({
  //         where: { [Op.or]: whereCondition },
  //         include: [{ model: db.Dog }
  //           , {
  //           model: db.Cat
  //         }]
  //       }).then(function (view) {
  //         console.log("view after include dog and cat");
  //         console.log(view);
  //         res.json(view);
  //       });
  //     });
  //   });
  // });

  app.get("/api/users/associatedPets/:email", function (req, res) {
    db.Owner.findOne({
      where: { UserEmail: req.params.email },
      include: [{
        model: db.Pet,
        through: Agents,
        include: [{ model: db.Dog},{model: db.Cat}]
      }]
    }).then(function (view) {
      console.log(view);
      res.json(view);
    });
  });

  // Get all pets of user
  app.get("/api/users/pets/:email", function (req, res) {
    db.Owner.findOne({
      where: { UserEmail: req.params.email },
      include:[{
        model: db.Pet, 
        as: "Pet", 
        include:[{ model: db.Dog}, { model: db.Cat}]
      }]
    }).then(function (view) {
      res.json(view);
    });
  });


  // Get user info
  app.get("/api/users/:id", function (req, res) {
    db.Owner.findOne({
      where: { id: req.params.id }
    }).then(function (view) {
      res.json(view);
    });
  });

  // Get a single pet
  app.get("/api/pets/:id", function (req, res) {
    db.Pet.findOne({
      where: { id: req.params.id }
    }).then(function (view) {
      res.json(view);
    });
  });

  // Creates a Pet and puts it in the database
  app.post("/api/pets", function (req, res) {

    res.json("this needs to be wholly fixed.")
    //   db.Owner.findOne({
    //     where: {
    //       ownerEmail: req.user.email
    //     }
    //   }).then(function (view) {
    //     req.body.ownerOwnerId = view.dataValues.ownerId;
    //     //view.dataValues.ownerId
    //     db.pet.create(req.body).then(function (result) {
    //       result.dataValues.immunizations = "";
    //       function immunizations(result, callback) {
    //         switch (result.dataValues.petType) {
    //           case "dog":
    //             db.dogImmunizations.create({
    //               petPetId: result.dataValues.petId
    //             }).then(function (res) {
    //               result.dataValues.immunizations += JSON.stringify(res.dataValues);
    //               callback(result);
    //             });
    //             break;
    //           case "cat":
    //             db.catImmunizations.create({
    //               petPetId: result.dataValues.petId
    //             }).then(function (res) {
    //               result.dataValues.immunizations += JSON.stringify(res.dataValues);
    //               callback(result);
    //             });
    //             break;
    //         }
    //       }
    //       function endThen() {
    //         res.json("/dashboard");
    //       }
    //       immunizations(result, endThen);
    //     });
    //   });
  });

  // Delete a pet
  app.delete("/api/pets/:id", function (req, res) {
    db.Pet.destroy({ where: { petId: req.params.id } }).then(function (result) {
      res.json(result);
    });
  });


  // Updates a pet
  app.put("/api/pets/:id", function (req, res) {
    db.Pet.update(req.body, {
      where: { petId: req.params.id }
    }).then(function (result) {
      res.json(result);
    });
  });

  ////START OF AUTH APIS//////////////
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json("/dashboard");
  });

  app.get("/login", function (req, res) {
    if (req.user) {
      res.redirect("/dashboard");
    } else {
      // res.render("login");
      res.redirect("/signup");
    }
  });

  // Auth // Signup - new user creation - 
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      owner: true
    }).then(function () {
      db.Owner.create({
        ownerEmail: req.body.email,
        ownerName: req.body.name,
        phone: req.body.phone,
        //authorizedAgents: req.body.agents Future functionality
      }).then(function () {
        // res.json("success");
        res.redirect(307, "/api/login");
      }).catch(function (err) {
        console.log(err);
        res.json(err);
      });
    }).catch(function (err) {
      res.json(err);
    });
  });

  // Auth // Logout
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // app.get("*", (req, res) => {
  //   res.sendFile(path.join(__dirname, "./client/build/index.html"));
  // });
};
