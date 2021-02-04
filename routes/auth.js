const express = require("express");
const session = require("express-session");
const cryptoJS = require("crypto-js");

// Inicializar Express
let router = express.Router();
let Usuario = require(__dirname + "/../models/usuario.js");

router.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

router.use(
  session({
    secret: "1234",
    resave: true,
    saveUninitialized: false,
  })
);

// Vista de login
router.get("/login", (req, res) => {
  res.render("auth_login");
});

// Proceso de login (obtener credenciales y cotejar)
router.post("/login", (req, res) => {
  Usuario.find({
    login: req.body.login,
    password: cryptoJS.SHA256(req.body.password).toString(),
  })
    .then((resultado) => {
      if (resultado.length > 0) {
        req.session.login = resultado;
        res.redirect("/admin");
      } else {
        res.render("auth_login", { error: "Usuario o contraseña incorrectos" });
      }
    })
    .catch((error) => {
      res.render("admin_error", { error: "Usuario o contraseña incorrectos" });
    });
});

// Ruta para logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
