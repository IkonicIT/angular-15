const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const path = require("path");
const port = process.env.PORT || 8083;
app.use(cors());
app.use(express.static(__dirname + "/dist"));
app.get("/*", (req, res) => res.sendFile(path.join(__dirname)));
const server = http.createServer(app);

server.listen(port, () => console.log("running..."));
