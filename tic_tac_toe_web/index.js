(function init() {
  const socket = io();
  var player_name;
  var game;
  var gameId;
  var invitation;

  function printMat() {
    console.log("imprimi mat");
    var board = game.board;
    for (var i = 0 ; i < game.board.length; i++) {
      console.log(board[i]);
    }
  }

  function updateBoard(game) {
    var board = game.board;
    var table = $('table').children().children();
    for (var i = 0 ; i < game.board.length; i++) {
      var linha = table[i].children;
      for (var j = 0; j < game.board[i].length; j++) {
        var coluna = linha[j].children.item(0);
        coluna.innerHTML = board[i][j];
      }
    }
  }

  function invite(player_oponents){
    var itens = $('#abas').get();
    $('#abas').prepend(
      '<li class="nav-item dropdown" role="presentation" id="inviteOponent" >'+
        '<button class="button_aba neumorphism-1 font_button nav-link dropdown-toggle" type="button"  data-toggle="dropdown" role="tab" aria-controls="contact" aria-selected="false">Convite</button>'+
        '<div class="dropdown-menu" id="oponents">'+
        '</div>'+
      '</li>'
    )
    for(var i=0; i<player_oponents.length; i++){
      invitation = player_oponents[i];
      $('#oponents').prepend(
        '<button class="dropdown-item convite" id="oponet'+i+'">'+invitation+'</button>'
      )
      $("#oponet"+i).on("click", (e) => {
        //alert("convite enviado")
        socket.emit("invitation", {
          player_oponent: player_name,
          player_invite: invitation,
          game: game,
        });
      })
    }
  }

  function newTab(id){
    var itens = $('#abas').get();
    $('#abas').prepend(
      '<li class="nav-item" role="presentation">'+
        '<button class="button_aba neumorphism-1 font_button" type="button" id="contact-tab_'+id+'" data-toggle="tab" href="#game'+id+'" role="tab" aria-controls="contact" aria-selected="false">' + 
          +id+
        '</button>'+ 
      '</li>');
    var itens = $('#myTabContent').get();
    $('#myTabContent').prepend(
      '<div class="tab-pane fade show active" id="game'+id+'" role="tabpanel" aria-labelledby="home-tab">'+
        '<div>'+
          '<p id="userHello">'+
            '<b id="turn"></b>'+
          '</p>'+
          '<p style="margin: 0; padding: 0">'+
            '<b id="turn"></b>'+
          '</p>'+
          '<table class="center"><!--Tabuleiro de Jogo da Velha-->'+
            '<tr>'+
              '<td>'+
                '<button class="tile" id="button_00"></button>'+
              '</td>'+
              '<td>'+
                '<button class="tile" id="button_01"></button>'+
              '</td>'+
              '<td>'+
                '<button class="tile" id="button_02"></button>'+
              '</td>'+
            '</tr>'+
            '<tr>'+
              '<td>'+
                '<button class="tile" type="button" id="button_10"></button>'+
              '</td>'+
              '<td>'+
                '<button class="tile" type="button" id="button_11"></button>'+
              '</td>'+
              '<td>'+
                '<button class="tile" type="button" id="button_12"></button>'+
              '</td>'+
            '</tr>'+
            '<tr>'+
              '<td>'+
                '<button class="tile" type="button" id="button_20"></button>'+
              '</td>'+
              '<td>'+
                '<button class="tile" type="button" id="button_21"></button>'+
              '</td>'+
              '<td>'+
                '<button class="tile" type="button" id="button_22"></button>'+
              '</td>'+
            '</tr>'+
          '</table>'+
        '</div>'+
      '</div>')
    $(".tile").on("click", (e) => {
      if (game.turn !== player_name || game.end ) {
        console.log("return");
        return;
      }
      var row = parseInt(e.currentTarget.id.split("_")[1][0], 10);
      var col = parseInt(e.currentTarget.id.split("_")[1][1], 10);
      e.currentTarget.innerHTML = game.board[row][col] = game.p1 === player_name ? 'X' : 'O';
      game.moves++;
      socket.emit("move", {
        player_name: player_name,
        game: game,
      });
    });
  }
  
  function wins(type) {
    for (var i = 0; i < game.board.length; i++) {
      if (game.board[i][0] == type && game.board[i][1] == type && game.board[i][2] == type) {
        return true;
      }
    }
    for (var i = 0; i < game.board.length; i++) {
      if (game.board[0][i] == type && game.board[1][i] == type && game.board[2][i] == type) {
        return true;
      }
    }
    if (game.board[0][0] == type && game.board[1][1] == type && game.board[2][2] == type) {
      return true;
    }
    if (game.board[0][2] == type && game.board[1][1] == type && game.board[2][0] == type) {
      return true;
    }
    return false;
  }

  function displayBoard(message) {
    $("#userHello").html(message);
    updateBoard(game);
  }

  function goToMenu(message, id){
    if(confirm(message)){
      $('#menu-tab').tab('show');
      if(document.getElementById("contact-tab_"+id) !== null){
        document.getElementById("contact-tab_"+id).remove();
      }
      if(document.getElementById("game"+id) !== null){
        document.getElementById("game"+id).remove();
      }
    } else{
      goToMenu(message, id);
    }
  }
    
  function checkWinner() {
    if (wins('X')) {
      announceWinner(game.p1);
      return;
    }
    if (wins('O')) {
      announceWinner(game.p2);
      return;
    }

    var tieMessage = "Deu empate!";
    if (game.moves == 9) {
      game.end = true;
      console.log("Message 3");
      socket.emit("gameover", {
        game: game,
        message: tieMessage,
      });
    }
  }

  function announceWinner(player) {
    game.end = true;
    var message = player + ' venceu!';
    updateBoard(game);
    console.log("Message 4");
    socket.emit("gameover", {
      game: game,
      message: message,
    });
  }

  $("#btnNewUser").on("click", () => {
    this.name = $("#inputNameUser").val();
    if (!this.name) {
      alert("Por favor, escreva seu nome.");
      return;
    }
    $("#usuario").append(this.name);
    $("#tela-login").addClass("d-none");
    $("#tela-game-pai").removeClass("d-none");
    player_name = this.name;
    socket.emit("newplayer", {
      player_name: this.name,
    });
  });

  $("#btnNewGame").on("click", () => {
    socket.emit('creategame', {player_name: player_name});
  });

  $("#btnJoinGame").on("click", () => {
    var name = this.name;
    gameId = parseInt($("#room").val());
    if (!name || gameId === undefined) {
      alert("Por favor, escreva seu nome e ID da sala.");
      return;
    }
    socket.emit("joingame", {
      player_name: name,
      id: gameId
    });
  });

  $('.button_aba').on('click', (e) => {
    if (e.currentTarget.id === 'menu-tab') return;
    gameId = parseInt(e.currentTarget.id.split('_'));
    socket.emit("joingame", {
      player_name: name,
      id: gameId
    });
  });

  socket.on("newgame", (data) => {
    if (data.player_name === player_name) {
      console.log("Oponents: ", data.player_oponents);
      game = data.game;
      gameId = data.game.id;
      newTab(game.id);
      invite(data.player_oponents);
      var message = `Olá, ${player_name}. Peça para outro jogador digitar o ID da sala: ${game.id}.`;
      displayBoard(message);
    }
  });

  socket.on('joingame', (data) => {
    if (data.game.id === gameId && player_name === data.player_name) {
      game = data.game;
      $('#contact-tab_' + gameId).tab('show');
      displayBoard(message);
    }
  });

  socket.on("player2_ok", (data) => {
    if (data.game.id === gameId) {
      game = data.game;
      if (data.game.p1 === player_name) {
        $("#inviteOponent").remove();
        var message = `Olá, ${player_name}`;
        $("#userHello").html(message);
      } else {
        newTab(game.id);
        var message = `Olá, ${player_name}`;
        displayBoard(message);
      }
    }
  });

  socket.on("move", (data) => {
    if (data.game.id === game.id) {
      game = data.game;
      updateBoard(data.game);
      checkWinner();
    }
  });

  socket.on("gameover", (data) => {
    if (data.game.id === gameId) {
      game = data.game;
      console.log("Message 1");
      //alert(data.message);
      goToMenu(data.message, data.game.id);
    }
  });

  socket.on("invitation", (data) => {
    if(data.player_invite == player_name){
      if(confirm(data.player_oponent+" te convidou para jogar. Aceitar partida?")){
        gameId = data.game.id
        socket.emit("joingame", {
          player_name: player_name,
          id: gameId
        });
      } 
    }
  });

  socket.on("err", (data) => {
    console.log("err");
    alert(data.message);
  });
})();