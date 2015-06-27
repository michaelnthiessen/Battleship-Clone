var app = angular.module('battleship', []);

app.controller('main-controller', function($scope) {
    var socket = io();

    var playScreen, mainScreen;
    var isMyTurn = false;

    var init = function() {
        $scope.buttonText = "Ready to play!";

        mainScreen = document.querySelector('.main-screen');
        playScreen = document.querySelector('.play-screen');

        socket.on('gameStarted', startGame);
        socket.on('yourTurn', yourTurn);
        socket.on('attackResult', attackResult);
        socket.on('defendResult', defendResult);
        socket.on('gameOver', gameOver);
    };

    var gameOver = function(win) {
        var message = 'Gameover! You ';
        yourTurn(false);

        if (win) {
            message += 'won!';
        } else {
            message += 'lost.';
        }

        alert(message);
    };

    var attackResult = function(result) {
        updateTile(result, '.their-shipyard');
    };

    var defendResult = function(result) {
        updateTile(result, '.my-shipyard');
    };

    var updateTile = function(result, shipyard) {

        // CSS starts at 1, not 0
        var row = parseInt(result[0], 10) + 1;
        var col = parseInt(result[1], 10) + 1;
        var val = result[2];

        // Get the attacked tile
        var tile = getTile(row, col, shipyard);

        // If we miss
        if (val === '0') {
            tile.classList.add('miss');
        }
        // If we hit
        else {
            tile.classList.add('hit');
            tile.classList.remove('ship');
        }
    };

    var getTile = function(row, col, shipyard) {
        var selector = '' +shipyard+ ' > div:nth-of-type('+ row +') > div:nth-of-type('+col+')';
        return document.querySelector(selector);
    };

    var yourTurn = function(isTurn) {
        if (isTurn) {
            playScreen.classList.add('my-turn');
            isMyTurn = true;
            alert('It is your turn!');
        } else {
            isMyTurn = false;
            playScreen.classList.remove('my-turn');
        }
    };

    var getNum = function(num) {
        arr = [];

        for (var i = 0; i < num; i++) {
            arr.push(i);
        }

        return arr;
    }

    var startGame = function(game) {
        $scope.game = game;

        populateShipyard();

        mainScreen.classList.add('hide');
        playScreen.classList.remove('hide');
    };

    var populateShipyard = function() {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                if ($scope.game.myBoard.matrix[i][j] === 1) {
                    getTile(i + 1, j + 1, '.my-shipyard').classList.add('ship');
                }
            }
        }
    }; 

    $scope.attack = function(row, col) {
        if (isMyTurn) {
            socket.emit('attack', '' + row + col);
        }
    };

    $scope.play = function() {
        socket.emit('setReady', true);
        $scope.buttonText = 'Waiting for another player...';
    };

    $scope.getNumTiles = function() {
        return getNum(10);
    };

    $scope.getNumRows = function() {
        return getNum(10);
    };

    init();
});










