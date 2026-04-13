const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");

mongoose
  .connect("mongodb://localhost/units-report", {
    promiseLibrary: require("bluebird"),
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.error(err));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const salesRouter = require("./routes/sales");
var galleryRouter = require("./routes/gallery");

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

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});

module.exports = app;
