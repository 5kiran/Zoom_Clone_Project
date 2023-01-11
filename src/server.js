import http from "http";
import express, { json } from "express";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/*", (req, res) => {
  res.redirect("/");
});

const handleListen = () => console.log(`Server Start http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected Browser");
  socket.on("close", () => {
    console.log("Close Browser");
  });
  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString("utf8"));
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
    // if else if 대체로 switch 사용
    // if (parsed.type === "new_message") {
    //   sockets.forEach((aSocket) => {
    //     aSocket.send(parsed.payload);
    //   });
    // } else if (parsed.type === "nickname") {
    //   console.log(parsed.payload)
    // }
  });
  socket.send("hello!!");
});

server.listen(3000, handleListen);

// {
//   type : "message",
//   payload : "hello everyone!"
// }
// {
//   type : "nickname",
//   payload : "nico"
// }
