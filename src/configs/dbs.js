const mongoose = require("mongoose")


module.exports = ()=>{
    return mongoose.connect(
      "mongodb+srv://vivek13kr:plxkn1TCnw28bHeH@cluster0.zghkbjc.mongodb.net/test"
    );
}