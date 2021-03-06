var db = require("../models");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");
var isOwner = require("../config/middleware/isOwner");
var isAdmin = require("../config/middleware/isAdmin");
var path = require("path");
var Sequelize = require("sequelize");
var Op = Sequelize.Op;




module.exports = function (app) {
  ///////////////////////ADMIN ADMIN ADMIN ADMIN ADMIN//////////////////////////////

  //admin route - find all owners and list pets
  //updated for newschema
  app.get("/admin/api/pets", isAdmin, function (req, res) {
    db.Owner.findAll({
      include: [{
        model: db.Pet,
        as: "Pet", include: [{ model: db.Dog, attribute: ["petName"] }, { model: db.Cat, attribute: ["petName"] }]
      }]
    }).then(function (view) {
      res.json(view);
    });
  });

  //admin route- find all owners ONLY
  //updated for newschema
  app.get("/admin/api/owners", isAdmin, function (req, res) {
    db.Owner.findAll({
    }).then(function (view) {
      res.json(view);
    });
  });

  //admin route- find all pet data for single Owner
  //updated for newschema
  app.get("/admin/api/pets/:email", isAdmin, function (req, res) {
    db.Owner.findOne({
      where: { UserEmail: req.params.email },
      include: [{
        model: db.Pet,
        as: "Pet",
        include: [{ model: db.Dog }, { model: db.Cat }]
      }]
    }).then(function (view) {
      res.json(view);
    });
  });

  //admin route- find all Associatedpet data for single Owner
  //updated for newschema
  app.get("admin/api/associatedPets/:email", isAdmin, function (req, res) {
    db.Owner.findOne({
      where: { UserEmail: req.params.email },
      include: [{
        model: db.Pet,
        through: Agents,
        include: [{ model: db.Dog }, { model: db.Cat }]
      }]
    }).then(function (view) {
      res.json(view);
    });
  });

  ///////////////////USER USER USER USER USER///////////////////////////////////

  //get all associated pets for a user
  //updated for newschema
  app.get("/api/users/associatedPets/", isAuthenticated, function (req, res) {
    db.Owner.findOne({
      where: { UserEmail: req.user.email },
      include: [{
        model: db.Pet,
        through: Agents,
        include: [{ model: db.Dog }, { model: db.Cat }]
      }]
    }).then(function (view) {
      res.json(view);
    });
  });

  // Get all pets of user
  //updated for newschema

  //////THIS NO LONGER WORKS FOR ADMIN- IT LOOKS ONLY FOR LOGIN USER////////////////
  app.get("/api/users/pets", isAuthenticated, function (req, res) {
    db.Owner.findOne({
      where: { UserEmail: req.user.email },
      include: [{
        model: db.Pet,
        as: "Pet",
        include: [{ model: db.Dog }, { model: db.Cat }]
      }]
    }).then(function (view) {
      res.json(view);
    }).catch(function (error) {
      res.json(error);
    });
  });


  // Get user info
  app.get("/api/users/:email", isAuthenticated, function (req, res) {
    db.Owner.findOne({
      where: { UserEmail: req.user.email }
    }).then(function (view) {
      res.json(view);
    });
  });

  // Get a single pet
  //updated for newschema
  app.get("/api/pets/:id", isAuthenticated, function (req, res) {
    db.Pet.findOne({
      where: { id: req.params.id },
      include: [{ model: db.Dog }, { model: db.Cat }]
    }).then(function (view) {
      res.json(view);
    });
  });

  app.post("/api/createAssociation", isAuthenticated, function (req, res) {
      
      db.Owner.findOne({
      where: {
        UserEmail: req.body.associatesEmail
      }
    }).then(function (Owner) {
      let associatedId= Owner.dataValues.ownerId;

      db.Owner.findOne({
        where: { UserEmail: req.user.email }
      }).then(function (view) {
        db.Pet.findAll({
          where: { OwnerOwnerId: view.dataValues.ownerId }
        }).then(function (view) {
          view.forEach(function (pet) {
            pet.addOwner(ownerOwnerId= associatedId);
            res.json("/dashboard");
          })
        }).catch(function (error) {
        })
      })


    })
  })

  // Creates a Pet and puts it in the database
  app.post("/api/pets", isAuthenticated, function (req, res) {

    db.Owner.findOne({
      where: {
        UserEmail: req.user.email
      }
    }).then(function (view) {
      req.body.PetOwnerId = view.dataValues.ownerId;
      req.body.OwnerOwnerId = view.dataValues.ownerId;
      //view.dataValues.ownerId
      db.Pet.create(req.body).then(function (result) {
        req.body.PetPetId = result.dataValues.petId;
        switch (req.body.petType) {
          case "Dog":
            db.Dog.create(
              req.body
            ).then(function () {
              res.json("/dashboard");
            });
            break;
          case "Cat":
            db.Cat.create(req.body
            ).then(function () {
              res.json("/dashboard");
            });
            break;
        }
      });
    });
  });

  // Delete a pet
  // updated for newschema
  app.delete("/api/pets/:id", isAuthenticated, function (req, res) {
    db.Pet.destroy({ where: { petId: req.params.id } }).then(function (result) {
      res.json(result);
    });
  });


  // Updates a pet
  // updated for newschema
  app.put("/api/pets/:id", function (req, res) {

    db.Pet.FindOne({
      where: { id: req.params.id }
    }).then(function (result) {
      if (result.pet.petType === "Dog") {
        db.Dog.update(req.body, {
          where: { PetPetId: req.params.id }
        }).then(function (result) {
          res.json(result);
        });
      } else {
        db.Cat.update(req.body, {
          where: { PetPetId: req.params.id }
        }).then(function (result) {
          res.json(result);
        });
      }
    })
  });


  ////START OF AUTH APIS//////////////
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json("/dashboard");//this should be something else
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
        UserEmail: req.body.email,
        ownerName: req.body.ownerName,
        phone: req.body.phone,
      }).then(function () {
        // res.json("success");
        res.redirect(307, "/api/login");
      }).catch(function (err) {
        res.json(err);
      });


    }).catch(function (err) {
      res.json(err);
    });
  });

  // Auth // Logout
  app.get('/logout', isAuthenticated, function (req, res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
};
