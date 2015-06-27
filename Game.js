var Board = require('./Board');

var Game = {};

Game.createGame = function(player1, player2) {
    var that = {};

    that.turn = 1;
	that.board1 = Board.createBoard();
	that.board2 = Board.createBoard();

	player1.game = that;
	player2.game = that;


	var init = function() {
		console.log('Game.init', player1.id, player2.id);
		bindSockets();

		player1.emit('gameStarted', {
			myBoard: that.board1,
			theirBoard: {
				attackList: that.board2.attackList
			}
		});

		player2.emit('gameStarted', {
			theirBoard: {
				attackList: that.board1.attackList
			},
			myBoard: that.board2
		});

        player1.emit('yourTurn', true);
        player2.emit('yourTurn', false);
	};



	var bindSockets = function() {
		player1.on('attack', onPlayer1Attack);
		player2.on('attack', onPlayer2Attack);
	};

	var onPlayer1Attack = function(position) {
		console.log('Game.onPlayer1Attack', position);
		if (that.turn === 1) {
			attack(player1, player2, that.board2, position);
		}
	};

	var onPlayer2Attack = function(position) {
		console.log('Game.onPlayer2Attack', position);
		if (that.turn === 2) {
			attack(player2, player1, that.board1, position);	
		}
	};

	var attack = function(player, opponent, board, position) {
		console.log('Game.attack', position);

        var result = board.attack(position);

        if (result.isHit) {
        	player.emit('attackResult', position + "1");
        	opponent.emit('defendResult', position + "1");
        } else {
        	player.emit('attackResult', position + "0");
        	opponent.emit('defendResult', position + "0");
        }

        if (result.isSink) {
        	player.emit('sinkShip', result.isSink);	
        }

        if (result.isGameOver) {
        	that.turn = 0;
        	player.emit('gameOver', true);
        	opponent.emit('gameOver', false);
        	destroy();
        } else {
        	that.turn = (that.turn === 1) ? 2 : 1;
        	player.emit('yourTurn', false);
        	opponent.emit('yourTurn', true);
        }

	};

	var destroy = function(socket) {
		player1.removeListener('attack', onPlayer1Attack);
		player2.removeListener('attack', onPlayer2Attack);
	};

	init();
    return that;
};


module.exports = Game;

