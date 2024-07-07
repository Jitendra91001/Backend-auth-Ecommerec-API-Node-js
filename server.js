const app = require("./app");

const dotenv = require("dotenv");

// unhandle the uncautchException;
process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message}`);
  console.log('shutdown server due to unhandled uncaugth exceoption')
});
const ConnectDatabase = require("./config/databases");
const orderRouter = require("./routes/orderRouter");

//connectiondb
ConnectDatabase();


//config
dotenv.config({ path: "config/config.env" });

const server = app.listen(process.env.port, () => {
  console.log(`server is working http://localhost:${process.env.port}`);
});

// unhandler the pormise rejection
process.on("unhandledRejection", (err) => {
  console.log(` Error ${err.message}`);
  console.log("sutdown the server due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
