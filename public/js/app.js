var socket = io();

var go_button;
var welcome_screen;
var play_screen;
var myShips;

window.onload = function(){
	go_button = document.getElementById("go-button");
	welcome_screen = document.getElementById("welcome-screen");
	play_screen = document.getElementById("play-screen");
	spot = document.getElementById("opponent-board");

	go_button.addEventListener("click", function(){
		socket.emit("setReady", true);
	});

	spot.addEventListener("click", attackAttempt)
}

function attackAttempt(e){
	column = e.target.id;
	row = e.target.parentElement.id;
	socket.emit("attack", row+column);
}

socket.on("gameStarted", function(game){
	//TODO: Do the basic setup in here
		//Position the ships
	myShips = game.yourBoard.shipList;
	populateBoard(myShips);
	showPlayScreen();
});

socket.on("yourTurn", function(isTurn){
	if (isTurn){
		alert("it's your turn, go find some battleships!");
	}
});

socket.on("attackResult", function(attackStr){
	console.log('attackResult', attackStr);
	row = attackStr.charAt(0);
	column = attackStr.charAt(1);
	hm = attackStr.charAt(2);

	if(hm === "1"){
		addMyHitClass(row, column);
	} else {
		addMyMissClass(row, column)
	}
});

socket.on("defendResult", function(attackStr){
	console.log('defendResult', attackStr);
	row = attackStr.charAt(0);
	column = attackStr.charAt(1);
	hm = attackStr.charAt(2);

	if (hm === "1"){
		addOpponentHitClass(row, column);
	} else {
		addOpponentMissClass(row, column);
	}
});


socket.on('connect', function(message) {
	showWelcomeScreen();
});


function showPlayScreen(){
	welcome_screen.setAttribute("style", "display:none");
	play_screen.removeAttribute("style");
}


function showWelcomeScreen(){
	play_screen.setAttribute("style", "display:none");
	welcome_screen.removeAttribute("style");
}

function populateBoard(shipList){
	for (var i = 0; i < shipList.length; i++){
		row = shipList[i].pos.charAt(0);
		column = shipList[i].pos.charAt(1);

		for (var j = 0; j < shipList[i].length; j++) {
			if (shipList[i].orientation === "v") {

				addBattleshipClass(parseInt(row)+j, column);

			} else {
				addBattleshipClass(row, parseInt(column)+j);

			}		
		}
	}
}

function addBattleshipClass(row, column) {
	row = String(parseInt(row,10)+1);
	column = String(parseInt(column,10)+1);

	document.querySelector(".my-board tr:nth-of-type("+row+") td:nth-of-type("+column+")").setAttribute("class", "has-ship");
}

function addMyHitClass(row, column){
	row = String(parseInt(row,10)+1);
	column = String(parseInt(column,10)+1);

	document.querySelector(".opponent-board tr:nth-of-type("+row+") td:nth-of-type("+column+")").setAttribute("class", "ship-hit");
}

function addMyMissClass(row, column){
	row = String(parseInt(row,10)+1);
	column = String(parseInt(column,10)+1);

	document.querySelector(".opponent-board tr:nth-of-type("+row+") td:nth-of-type("+column+")").setAttribute("class", "ship-miss");
}

function addOpponentMissClass(row, column){
	row = String(parseInt(row,10)+1);
	column = String(parseInt(column,10)+1);

	document.querySelector(".my-board tr:nth-of-type("+row+") td:nth-of-type("+column+")").setAttribute("class", "ship-miss");
}

function addOpponentHitClass(row, column){
	row = String(parseInt(row,10)+1);
	column = String(parseInt(column,10)+1);

	document.querySelector(".my-board tr:nth-of-type("+row+") td:nth-of-type("+column+")").setAttribute("class", "ship-hit");
}




