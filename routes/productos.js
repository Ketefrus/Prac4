const express = require("express");
const multer = require("multer");

let Producto = require(__dirname + "/../models/producto.js");
let autentication = require(__dirname + "/../utils/auth.js");
let router = express.Router();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
let upload = multer({ storage: storage });

// GET /
router.get("/", autentication, (req, res) => {
  Producto.find()
    .then((resultado) => {
      res.render("admin_productos", { productos: resultado });
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

// GET /productos/nuevo
router.get("/nuevo", autentication, (req, res) => {
  res.render("admin_productos_form");
});

// GET /productos/editar/:id
router.get("/editar/:id", autentication, (req, res) => {
  Producto.findById(req.params.id)
    .then((resultado) => {
      if (resultado) {
        res.render("admin_productos_form", { producto: resultado });
      } else {
        res.render("admin_error", { error: "Producto no encontrado" });
      }
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

// POST /productos
router.post("/", autentication, upload.single("imagen"), (req, res) => {
  let nuevoProducto = new Producto({
    nombre: req.body.nombre,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    imagen: req.file.filename,
  });
  nuevoProducto
    .save()
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

// PUT /productos/:id
router.post("/:id", autentication, upload.single("imagen"), (req, res) => {
  console.log(req.file);
  if (req.file) {
    console.log("he entrao");
    Producto.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          nombre: req.body.nombre,
          precio: req.body.precio,
          descripcion: req.body.descripcion,
          imagen: req.file.filename,
        },
      },
      { new: true }
    )
      .then((resultado) => {
        res.redirect(req.baseUrl);
      })
      .catch((error) => {
        res.render("admin_error");
      });
  } else {
    Producto.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          nombre: req.body.nombre,
          precio: req.body.precio,
          descripcion: req.body.descripcion,
        },
      },
      { new: true }
    )
      .then((resultado) => {
        res.redirect(req.baseUrl);
      })
      .catch((error) => {
        res.render("admin_error");
      });
  }
});

// DELETE /productos/:id
router.delete("/:id", autentication, (req, res) => {
  Producto.findByIdAndRemove(req.params.id)
    .then((resultado) => {
      console.log("borrado");
      res.redirect(req.baseUrl);
      console.log("fallo");
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

module.exports = router;
