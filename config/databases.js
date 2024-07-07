const mongoose = require("mongoose");


const ConnectDatabase = () => {
  const connectiondb = mongoose
    .connect(
      'mongodb://127.0.0.1:27017/backendEcommerecAPI'
    )
    .then((data) => {
      console
        .log(`databases connected this url ${data.connection.host}`)
    }).catch((err)=>console.log(err));
};
module.exports = ConnectDatabase;
