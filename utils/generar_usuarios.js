const mongoose = require("mongoose");
const Usuario = require(__dirname + "/../models/usuario");
const cryptoJS = require("crypto-js");
mongoose.connect("mongodb://localhost:27017/ProdAsturianosV3");

Usuario.collection.drop();

// let usu1 = new Usuario({
//     login: 'may1',
//     password: '1234'
// });
// usu1.save();

// let usu2 = new Usuario({
//     login: 'nacho',
//     password: '5678'
// });
// usu2.save();

let usu3 = new Usuario({
  login: "frusi",
  password: cryptoJS.SHA256("1111").toString(),
});
usu3.save();
