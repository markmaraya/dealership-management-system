require('dotenv').config();

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
  .connect("mongodb://localhost/units-report", {
    promiseLibrary: require("bluebird"),
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.error(err));

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const salesRouter = require("./routes/sales");
const galleryRouter = require("./routes/gallery");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("A user is connected");
});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", salesRouter);
app.use("/gallery", galleryRouter);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
