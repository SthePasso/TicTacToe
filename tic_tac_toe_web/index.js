(function init() {
  const P1 = "X";
  const P2 = "O";
  let player;
  let game;
  //var novaPartida= 0;
  var name = "";
  //let venceu = false;

  // const socket = io.connect('http://tic-tac-toe-realtime.herokuapp.com'),
  var socket;
  function createRoomGame(nameOfPlayer){
    socket.emit("createGame", { name });
    player = new Player(name, P1);
  }

  function newTab(){
    //this.novaPartida+=1;
    var itens = $('#abas').get();
    $('#abas').prepend('<li class="nav-item" role="presentation"><button class="button_aba neumorphism-1 font_button" type="button" id="contact-tab" data-toggle="tab" href="#contact2" role="tab" aria-controls="contact" aria-selected="false">Nova Partida</button> </li>');
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
    constructor(roomId) {
      this.roomId = roomId;
      this.board = [];
      this.moves = 0;
    }

    // Cria o "tabuleiro" do jogo lincando listeners aos botões.
    createGameBoard() {
      function tileClickHandler() {
        const row = parseInt(this.id.split("_")[1][0], 10);
        const col = parseInt(this.id.split("_")[1][1], 10);
        if (!player.getCurrentTurn() || !game) {
          alert("Ainda não é a sua vez!");
          return;
        }

        if ($(this).prop("disabled") || !game) {
          alert("Esta posição já foi escolhida!");
          return;
        }

        // Atualiza o "tabuleiro" depois de um turno jogado.
        game.playTurn(this);
        game.updateBoard(player.getPlayerType(), row, col, this.id);

        player.setCurrentTurn(false);
        player.updatePlaysArr(1 << (row * 3 + col));

        game.checkWinner();
      }

      for (let i = 0; i < 3; i++) {
        this.board.push(["", "", ""]);
        for (let j = 0; j < 3; j++) {
          $(`#button_${i}${j}`).on("click", tileClickHandler);
        }
      }
    }

    // Remove o menu inicial da tela, mostra o "tabuleiro" do jogo e dá as boas vindas ao jogador.
    displayBoard(message) {
      $(".menu").css("display", "none");
      $(".Abas").css("display", "block");
      $(".gameBoard").css("display", "block");
      $("#userHello").html(message);
      this.createGameBoard();
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
        alert(tieMessage);
        location.reload();
      }
    }

    checkTie() {
      const currentPlayerPositions = player.getPlaysArr();
      const venceu = false;
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

    // Anuncia o vencedor se o jogador atual ganhou.
    // Envia essa mensagem por broadcast para fazer com que o oponente saiba também.
    announceWinner() {
      const message = `${player.getPlayerName()} venceu!`;
      socket.emit("gameEnded", {
        room: this.getRoomId(),
        message,
      });
      alert(message);
      location.reload();
    }

    // Finaliza o jogo se o outro jogador ganhou.
    endGame(message) {
      alert(message);
      location.reload();
    }
  }

  // Cria um novo jogo e emite o evento newGame.
  $("#btnNewGame").on("click", () => {
    const name = $("#nameNew").val();
    //var roomName = createRoomGame(name);
    newTab();
  });

  // Coloca um jogador em um jogo existente através do roomId e emite o evento joinGame.
  $("#btnJoinGame").on("click", () => {
    const name = $("#nameJoin").val();
    const roomID = $("#room").val();
    if (!name || !roomID) {
      alert("Por favor, escreva seu nome e ID da sala.");
      return;
    }
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
    $(".login").css("display", "none");
    $(".abas").css("display", "block");
    $(".menu").css("display", "block");
    socket = io.connect("http://localhost:5000");
    socket.emit("newPlayer", {
      playerName: this.name,
    });
    // Novo jogo criado pelo jogador atual. Atualiza a interface e cria uma nova variável Game.
    socket.on("newGame", (data) => {
      const message = `Olá, ${data.name}. Por favor peça para o outro jogador digitar o ID da sala: 
      ${data.room}. Esperando pelo outro jogador...`;

      // Create game for player 1
      game = new Game(data.room);
      game.displayBoard(message);
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
      game = new Game(data.room);
      game.displayBoard(message);
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

      game.updateBoard(opponentType, row, col, data.tile);
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
