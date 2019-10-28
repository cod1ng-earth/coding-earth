require("dotenv").config();
const config = require("platformsh-config").config();
const express = require("express");
const cors = require("cors");

const logger = require("./lib/logger");
const Actions = require("./actions/index");
const search = require("./routes/search");

const app = express();
app.use(logger.middleware);
app.use(cors());
app.use(express.json());

const PORT = config.isValidPlatform() ? config.port : process.env.PORT || 3000;

app.get("/", search);

app.listen(PORT, () =>
  logger.app.info(`rabbithole app listening on port ${PORT}!`)
);
