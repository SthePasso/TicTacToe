const express = require("express");
const path = require("path");
const { type } = require("jquery");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// O servidor está "ouvindo" na porta 5000.
server.listen(process.env.PORT || 5000);

//Variaveis globais

var games = [];
var users = [];
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
  });

  socket.on("newplayer", (data) => {
    console.log("newplayer: " + data.player_name);
    users.push(data.player_name);
    console.log("Users online: " + users);
  });

  socket.on("creategame", (data) => {
    var game = {
      p1: data.player_name,
      p2: undefined,
      id: games.length,
      board: [['', '', ''], ['', '', ''], ['', '', '']],
      moves: 0,
      turn: data.player_name,
      end: false
    }
    games.push(game);
    io.emit("newgame", {
      game: game,
      player_name: data.player_name
    });
  });

  socket.on("joingame", function (data) {
    if (games.length > 0 && games[data.id].p1 !== undefined && games[data.id].p2 !== undefined) {
      io.emit('joingame', {
        game: games[data.id],
        player_name: data.player_name
      });
    } else if (games.length > 0 && games[data.id].p2 == undefined) {
      games[data.id].p2 = data.player_name;
      games[data.id].turn = games[data.id].turn === undefined ? games[data.id].p2 : games[data.id].p1;
      io.emit("player2_ok", {
        player2_name: data.player_name,
        game: games[data.id]
      });
    } else {
      io.emit("err", {
        message: "Desculpe, esta sala esta cheia ou não existe!"
      });
    }
  });

  // Lida com o turno que foi jogado por um jogador e notifica o outro.
  socket.on("move", (data) => {
    data.game.turn = data.game.turn == data.game.p1 ? data.game.p2 : data.game.p1;
    games[data.game.id] = data.game;
    io.emit("move", data);
  });

  // Notifica os jogadores sobre quem ganhou.
  socket.on("gameover", (data) => {
    game = data.game;
    socket.broadcast.emit("gameover", data);  
  });
});
