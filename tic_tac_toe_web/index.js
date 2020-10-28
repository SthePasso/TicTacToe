(function init() {
  const P1 = "X";
  const P2 = "O";
  let player;
  let gameUnitariun;
  //let game;
  //var player = [];
  var game = [];
  //var novaPartida= 0;
  var name = "";
  //let venceu = false;

  // const socket = io.connect('http://tic-tac-toe-realtime.herokuapp.com'),
  var socket;
  function createRoomGame(nameOfPlayer){
    socket.emit("createGame", { name });
    player = new Player(name, P1);
  }

  function newTab(roomName){
    //this.novaPartida+=1;
    var itens = $('#abas').get();
    $('#abas').prepend('<li class="nav-item" role="presentation"><button class="button_aba neumorphism-1 font_button" type="button" id="contact-tab'+roomName+'" data-toggle="tab" href="#game'+roomName+'" role="tab" aria-controls="contact" aria-selected="false">'+roomName+'</button> </li>');
    var itens = $('#myTabContent').get();
    $('#myTabContent').prepend('<div class="tab-pane fade show active" id="game'+roomName+'" role="tabpanel" aria-labelledby="home-tab"><div><p id="userHello"><b id="turn"></b></p><p style="margin: 0; padding: 0"><b id="turn"></b></p><table class="center"><!--Tabuleiro de Jogo da Velha--><tr><td><button class="tile" id="button_00"></button></td><td><button class="tile" id="button_01"></button></td><td><button class="tile" id="button_02"></button></td></tr><tr><td><button class="tile" type="button" id="button_10"></button></td><td><button class="tile" type="button" id="button_11"></button></td><td><button class="tile" type="button" id="button_12"></button></td></tr><tr><td><button class="tile" type="button" id="button_20"></button></td><td><button class="tile" type="button" id="button_21"></button></td><td><button class="tile" type="button" id="button_22"></button></td></tr></table></div></div>')
    console.log("Criando"+roomName);
    //ver uma forma do id ser dinamico tanto aqui quando a div de referencia
  }
  
  class Player {
    constructor(name, type) {
      this.name = name;
      this.type = type;
      this.currentTurn = true;
      this.playsArr = 0;
    }

    static get wins() {
      return [7, 56, 448, 73, 146, 292, 273, 84];
    }

    // Seta o bit da jogada feita pelo jogador.
    // tileValue é o Bitmask utilizado para setar a jogada feita.
    updatePlaysArr(tileValue) {
      this.playsArr += tileValue;
    }

    getPlaysArr() {
      return this.playsArr;
    }

    // Seta o currentTurn para o jogador da vez e modifica a interface pra mostrar o mesmo.
    setCurrentTurn(turn) {
      this.currentTurn = turn;
      const message = turn ? "Sua vez" : "Aguardando oponente";
      $("#turn").text(message);
    }

    getPlayerName() {
      return this.name;
    }

    getPlayerType() {
      return this.type;
    }

    getCurrentTurn() {
      return this.currentTurn;
    }
  }

  // metodo contrutor da sala na qual o jogo está rodando no servidor.
  class Game {
    roomId;
    board;
    moves;
    constructor(roomId) {
      this.roomId = roomId;
      this.board = [];
      this.moves = 0;
    }

  // Cria o "tabuleiro" do jogo lincando listeners aos botões.
    
  
    createGameBoard(roomId) {
      this.roomId = roomId;
      for (let i = 0; i < 3; i++) {
        this.board.push(["", "", ""]);
        for (let j = 0; j < 3; j++) {
          $(`#button_${i}${j}`).on("click", function() {
            //Verificar qual o room
            var i = 0;// = Number(roomId.replace('room-',''));//, j = 0;
            console.log("this.roomId: "+this.getRoomId);
            while(game[i].roomId != roomId || (i > game.length)) {
              i = i+1;
            }if(i > game.length) { return -1;}//??
            console.log("compara2: "+roomId+" com "+game[i].roomId);
      
      
            const row = parseInt(this.id.split("_")[1][0], 10);
            const col = parseInt(this.id.split("_")[1][1], 10);
            if (!player.getCurrentTurn() || !game[i]) {
              alert("Ainda não é a sua vez!");
              return;
            }
            if ($(this).prop("disabled") || !game[i]) {
              alert("Esta posição já foi escolhida!");
              return;
            }
      
            // Atualiza o "tabuleiro" depois de um turno jogado.
            game[i].playTurn(this);
            game[i].updateBoard(player.getPlayerType(), row, col, this.id);
      
            player.setCurrentTurn(false);
            player.updatePlaysArr(1 << (row * 3 + col));
      
            game[i].checkWinner();
          });
        }
      }
    }

    // Remove o menu inicial da tela, mostra o "tabuleiro" do jogo e dá as boas vindas ao jogador.
    displayBoard(message, roomId) {
      //$(".menu").css("display", "none");
      //$(".Abas").css("display", "block");
      //$(".gameBoard").css("display", "block");
      $("#userHello").html(message);
      this.createGameBoard(roomId);
    }

    /**
      Atualiza a interface do "tabuleiro"

      parametro1 {string} "type" -  jogador X ou O
      parametro2 {int} "row" - linha aonde foi jogado
      parametro3 {int} "col" - coluna aonde foi jogado
      parametro4 {string} "tile" -  Id do botão que foi clicado

    */
    updateBoard(type, row, col, tile) {
      $(`#${tile}`).text(type).prop("disabled", true);
      this.board[row][col] = type;
      this.moves++;
    }

    getRoomId() {
      return this.roomId;
    }

    // Envia uma atualização para que o oponente atualize a interface dos botões de sua tela.
    playTurn(tile) {
      const clickedTile = $(tile).attr("id");

      // Emite uma atualização de evento para o outro jogador falado que o jogador atual já jogou seu turno.
      socket.emit("playTurn", {
        tile: clickedTile,
        room: this.getRoomId(),
      });
    }

    /**
        Lógica para determinar o vencedor:

     * Para que se determine o estado de "vitória", cada botão é definido, da esquerda
     * para a direita e de cima para baixo, com sucessivas potências de 2.  Cada célula
     * representa um bit individual em uma string de 9 bits, e os quadrados
     * de um jogador a qualquer momento podem ser representados como um
     * único valor de 9 bits. Um vencedor pode ser determinado
     * checando quando os atuais 9 bits tiverem o valor de qualquer um
     * das oito possíveis combinações  de "linhas de três".
     *
     *     273                 84
     *        \               /
     *          1 |   2 |   4  = 7
     *       -----+-----+-----
     *          8 |  16 |  32  = 56
     *       -----+-----+-----
     *         64 | 128 | 256  = 448
     *       =================
     *         73   146   292
     *
     *  Esses numeros estão no array Player.wins e para o jogador atual
     *  e essa infrmação é guardada em playsArr.
     */
    goToMenu(message){
      if(confirm(message)){
        $('#menu-tab').tab('show');
      } else{
        this.goToMenu(message);
      }
    }
    
    checkWinner() {
      const currentPlayerPositions = player.getPlaysArr();

      Player.wins.forEach((winningPosition) => {
        if ((winningPosition & currentPlayerPositions) === winningPosition) {
          game.announceWinner();
        }
      });

      const tieMessage = "Deu empate!";
      if (this.checkTie()) {
        socket.emit("gameEnded", {
          room: this.getRoomId(),
          message: tieMessage,
        });
        //confirm(tieMessage);
        this.goToMenu(tieMessage);
      }
    }

    checkTie() {
      const currentPlayerPositions = player.getPlaysArr();
      var venceu = false;
      Player.wins.forEach((winningPosition) => {
        if ((winningPosition & currentPlayerPositions) === winningPosition) {
          venceu = true;
        }
      });
      if ((this.moves >= 9) & !venceu) {
        return true;
      } else {
        return false;
      }
    }

    checkRoom(roomId){
      var i = 0;//, j = 0;
      while(game[i].roomId != roomId || (i > game.length)) {
        i = i+1;
      }
      return i;
    }

    // Anuncia o vencedor se o jogador atual ganhou.
    // Envia essa mensagem por broadcast para fazer com que o oponente saiba também.
    announceWinner() {
      const message = `${player.getPlayerName()} venceu!`;
      socket.emit("gameEnded", {
        room: this.getRoomId(),
        message,
      });
      //alert(message);
      this.goToMenu(message);
    }

    // Finaliza o jogo se o outro jogador ganhou.
    endGame(message) {
      //alert(message);
      this.goToMenu(message);
    }
  }

  // Cria um novo jogo e emite o evento newGame.
  $("#btnNewGame").on("click", () => {
    const name = this.name;//$("#nameNew").val();
    //console.log(name);
    //var roomName = createRoomGame(name);
    socket.emit('createGame', { name });
    player = new Player(name, P1);
    //newTab(roomName);
  });

  // Coloca um jogador em um jogo existente através do roomId e emite o evento joinGame.
  $("#btnJoinGame").on("click", () => {
    const name = this.name;//$("#nameJoin").val();
    const roomID = $("#room").val();
    if (!name || !roomID) {
      alert("Por favor, escreva seu nome e ID da sala.");
      return;
    }
    newTab(roomID);
    socket.emit("joinGame", { name, room: roomID });
    player = new Player(name, P2);
  });

  //Hidden login
  $("#btnNewUser").on("click", () => {
    //#id, .class
    this.name = $("#inputNameUser").val();
    if (!this.name) {
      alert("Por favor, escreva seu nome.");
      return;
    }
    $("#usuario").append(this.name);
    //$(".login").css("display", "none");
    //$(".abas").css("display", "block");
    //$(".menu").css("display", "block");
    $("#tela-login").addClass("d-none");
    $("#tela-game-pai").removeClass("d-none");
    socket = io.connect("http://localhost:5000");
    socket.emit("newPlayer", {
      playerName: this.name,
    });

    // Novo jogo criado pelo jogador atual. Atualiza a interface e cria uma nova variável Game.
    socket.on("newGame", (data) => {
      newTab(data.room);
      const message = `Olá, ${data.name}. Peça para o outro jogador digitar o ID da sala: 
      ${data.room}.`;
      // Create game for player 1
      gameUnitariun = new Game(data.room);
      game.push(gameUnitariun);
      //console.log( game[game.length-1]);
      console.log("newgame: "+data.room);
      game[game.length-1].displayBoard(message, data.room);
    });

    /**
    Se um jogador cria o jogo ele será P1(X) e tem o primeiro turno.
    Este evento é recebido quando o oponente se conecta à sala existente.
  */
    socket.on("player1", (data) => {
      const message = `Olá, ${player.getPlayerName()}`;
      $("#userHello").html(message);
      player.setCurrentTurn(true);
    });

    /**
    Quando o oponente se conecta à sala existente, ele se torna o P2(O). 
    Este evento é recebido quando P2 se conecta à sala com sucesso. 
  */
    socket.on("player2", (data) => {
      const message = `Olá, ${data.name}`;

      // Create game for player 2
      gameUnitariun = new Game(data.room);
      //let i = data.room.replace('room-','');
      console.log("player2: "+data.room);
      gameUnitariun.displayBoard(message, data.room);
      player.setCurrentTurn(false);
    });

    /**
    Quando o oponente joga seu turno, atualiza a interface. 
    Permite-se que o jogador atual jogue. 
   */
    socket.on("turnPlayed", (data) => {
      const row = data.tile.split("_")[1][0];
      const col = data.tile.split("_")[1][1];
      const opponentType = player.getPlayerType() === P1 ? P2 : P1;
      //let i = data.room.replace('room-','');
      //console.log(i);
      gameUnitariun.updateBoard(opponentType, row, col, data.tile);
      player.setCurrentTurn(true);
    });

    // Se o outro jogador vencer, este evento é recebido. Notifica que o jogo terminou.
    socket.on("gameEnd", (data) => {
      game.endGame(data.message);
      socket.leave(data.room);
    });

    /**
    Encerra o jogo caso ocorrao evento de erro. 
	 */
    socket.on("err", (data) => {
      game.endGame(data.message);
    });
  });
})();
