const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// O servidor está "ouvindo" na porta 5000.
server.listen(process.env.PORT || 5000);

//Variaveis globais

let rooms = 0;
var numUsers = 0;
var listOfUsers = [];

//

app.use(express.static("."));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist")); // redirect JS jQuery
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css")); // redirect CSS bootstrap

app.use(function (req, res, next) {
  console.log("Nova request");
  next();
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/.", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Definições da API Socket
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
    //Quem ta online request
  });

  socket.on("newPlayer", (data) => {
    console.log(data.playerName);
    numUsers += 1;
    listOfUsers.push(data.playerName);
    console.log("Number of users online: " + numUsers);
    console.log("Users online: " + listOfUsers);
    // persitir em um array o login
    // incrementar a variavel de numUsers
  });
  // Cria uma nova sala de jogo e notifica o joqgador que criou o jogo.
  socket.on("createGame", (data) => {
    socket.join(`room-${++rooms}`);
    socket.emit("newGame", { name: data.name, room: `room-${rooms}` });
  });

  // Conecta o Jogador 2 na sala que ele requisitou através do ID. Se a sala estiver cheia, mostra um erro.
  socket.on("joinGame", function (data) {
    var room = io.nsps["/"].adapter.rooms[data.room];
    if (room && room.length === 1) {
      socket.join(data.room);
      socket.broadcast.to(data.room).emit("player1", {});
      socket.emit("player2", { name: data.name, room: data.room });
    } else {
      socket.emit("err", { message: "Desculpe, esta sala esta cheia!" });
    }
  });

  // Lida com o turno que foi jogado por um jogador e notifica o outro.
  socket.on("playTurn", (data) => {
    socket.broadcast.to(data.room).emit("turnPlayed", {
      tile: data.tile,
      room: data.room,
    });
  });

  // Notifica os jogadores sobre quem ganhou.
  socket.on("gameEnded", (data) => {
    socket.broadcast.to(data.room).emit("gameEnd", data);
  });
});
