const express = require("express");

let Producto = require(__dirname + "/../models/producto.js");
let router = express.Router();

// Renderización de la vista index
router.get("/", (req, res) => {
  res.render("publico_index");
});

// Búsqueda de todos los productos cuyo nombre contenga
// el texto que se pasa por el cuerpo de la petición
router.get("/buscar", (req, res) => {
  Producto.find({ nombre: new RegExp(req.query.buscar, "i") })
    .then((resultado) => {
      if (resultado.length > 0)
        res.render("publico_index", { productos: resultado });
      else
        res.render("publico_index", { error: "No se encontraron productos" });
    })
    .catch((error) => {
      res.render("publico_error");
    });
});

// Detalle del producto
router.get("/producto/:id", (req, res) => {
  Producto.findById(req.params.id)
    .then((resultado) => {
      if (resultado) res.render("publico_producto", { producto: resultado });
      else res.render("publico_error", { error: "Producto no encontrado" });
    })
    .catch((error) => {
      res.render("publico_error");
    });
});

router.get("/comentarios", (req, res) => {
  res.render("admin_comentario_form");
});

// Añadir comentario
router.post("/producto/:id", (req, res) => {
  Producto.findById(req.params.id)
    .then((producto) => {
      producto.comentarios.push({
        nombreUsuario: req.body.nombreUsuario,
        comentario: req.body.comentario,
      });
      producto.save().then((resultado) => {
        res.render("publico_producto", { producto: resultado });
      });
    })
    .catch((error) => {
      res.render("publico_error");
    });
});

router.delete("/producto/:id/:idComentario", (req, res) => {
  Producto.findById(req.params.id)
    .then((product) => {
      product.comentarios = product.comentarios.filter(
        (comentario) => comentario._id != req.params.idComentario
      );
      product.save().then((resultado) => {
        res.render("publico_producto", { producto: resultado });
      });
    })
    .catch((error) => {
      res.render("publico_error");
    });
});

module.exports = router;
