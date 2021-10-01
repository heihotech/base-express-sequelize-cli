// require("dotenv").config();
// const server = require("./api/server");

// const port = process.env.APP_PORT;

// process.on("uncaughtException", (err) => {
//   console.error(`${new Date().toUTCString()} uncaughtException:`, err);
//   process.exit(0);
// });

// process.on("unhandledRejection", (err) => {
//   console.error(`${new Date().toUTCString()} unhandledRejection:`, err);
// });

// server.listen({ port }, () =>
//   console.log(`🚀 Server ready at http://localhost:${port}/api`)
// );

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./database/models");
// prod
db.sequelize.sync();
// dev
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

require("./api/routes/provinsi.routes")(app);
require("./api/routes/kabupaten.routes")(app);
require("./api/routes/kecamatan.routes")(app);
require("./api/routes/desa.routes")(app);
require("./api/routes/alamat.routes")(app);
require("./api/routes/pasien.routes")(app);

// set port, listen for requests
const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
