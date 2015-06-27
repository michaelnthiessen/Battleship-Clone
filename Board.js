var Board = {};
/*
 * Creates and returns a new Board object
 */
Board.createBoard = function() {
    that = {};

    that.attackList = [];
    var tempBoard = [];

    // List of ships in game
    that.shipList = [{
        type: 'AirCraft Carrier',
        length: 5
    }, {
        type: 'BattleShip',
        length: 4
    }, {
        type: 'Submarine',
        length: 3
    }, {
        type: 'Destroyer',
        length: 3
    }, {
        type: 'Patrol Boat',
        length: 2
    }];

    // Construct our game board
    var init = function() {

        // Construct the temp board
        tempBoard = createMatrix(10, 10, 0);

        // Start placing all of the ships
        for (var i = 0; i < that.shipList.length; i++) {
            var ship = that.shipList[i];

            // Generate position
            var placement = generatePlacement(ship);

            // Keep generating until we find a position
            // that hasn't been taken yet
            while (!isValidPlacement(ship, placement)) {
                placement = generatePlacement(ship);
            }

            // We now have a valid placement, so place the ship
            placeShip(ship, placement);
        }

        // Also send along the tempBoard so the UI can
        // easily place images correctly
        that.matrix = tempBoard;   
    };

    // Update the tempBoard and the shipList data
    var placeShip = function(ship, placement) {

        // Update the tempBoard
        for (var i = 0; i < ship.length; i++) {
            if (placement.orientation === 'h') {
                tempBoard[placement.row][placement.col + i] = 1;
            } else {
                tempBoard[placement.row + i][placement.col] = 1;
            }
        }

        // Finish initializing the ship
        ship.orientation = placement.orientation;
        ship.pos = "" + placement.row + placement.col;
        ship.row = placement.row;
        ship.col = placement.col;
        ship.hitCount = 0;
    };

    var isValidPlacement = function(ship, placement) {
        var isValid = true;

        for (var i = 0; i < ship.length && isValid; i++) {
            if (placement.orientation === 'v') {

                // Check all horizontal positions
                if (tempBoard[placement.row + i][placement.col] === 1) {
                    isValid = false;
                }

            } else {

                // Check all vertical positions
                if (tempBoard[placement.row][placement.col + i] === 1) {
                    isValid = false;
                }

            }
        }

        return isValid;
    }; 

    var createMatrix = function(row, col, val) {
        var arr = [];

        for (var i = 0; i < row; i++) {
            var inner = [];

            for (var j = 0; j < col; j++) {
                inner[j] = val;
            }

            arr[i] = inner;
        }

        return arr;
    };

    var generatePlacement = function(ship) {
        var orientation, row, col;

        // Determine orientation
        if (Math.random() > 0.5) {
            orientation = 'h';
        } else {
            orientation = 'v';
        }

        // Get random coordinates
        row = Math.random();
        col = Math.random();

        // Limit to the game board size
        // based on the ship type
        if (orientation === 'h') {
            row *= 9;
            col *= (9 - ship.length + 1);
        } else {
            row *= (9 - ship.length + 1);
            col *= 9;
        }

        // Convert to integer
        row = Math.floor(row);
        col = Math.floor(col);

        return {
            'orientation': orientation,
            'row': row,
            'col': col
        };
    };

    // Check if valid position first, then check
    // if the position has been attacked yet
    var isValidPosition = function(position) {
        var row = parseInt(position[0], 10);
        var col = parseInt(position[1], 10);

        // Check for out of bounds
        if (row > 9 || row < 0 ||
            col > 9 || col < 0) {
            return false;
        }

        // Check if we've attacked this position before
        for (var i = 0; i < that.attackList.length; i++) {
            var attack = that.attackList[i];

            if (position[0] !== attack[0] &&
                position[1] !== attack[1]) {
                return false;
            }
        }

        return true;
    };

    // Check to see if we have hit any of the 
    // pieces on the board
    var isHit = function(position, result) {

        // Check each ship
        for (var i = 0; i < that.shipList.length; i++) {
            var shipHit = isShipHit(that.shipList[i],
                            result,
                            parseInt(position[0], 10),
                            parseInt(position[1], 10));
            if (shipHit) {
                return true;
            }
        }
    };

    var isShipHit = function(ship, result, row, col) {

        var hit = false;

        if (ship.orientation === 'h') {
            if (row === ship.row &&
                col >= ship.col &&
                col < (ship.col + ship.length)) {

                hit = true;
            }
        } else {
            if (col === ship.col &&
                row >= ship.row &&
                row < (ship.row + ship.length)) {

                hit = true;
            }
        }

        if (hit === true) {
            result.isHit = true;
            ship.hitCount++;

            if (ship.hitCount === ship.length) {
                result.isSink = ship.type;

                isGameOver(result);
            }

            return true;
        }
    };

    var isGameOver = function(result) {

        for (var i = 0; i < that.shipList.length; i++) {
            var ship = that.shipList[i];
            if (ship.length !== ship.hitCount) {
                return;
            }
        }

        result.isGameOver = true;
    };

    that.attack = function(position) {
        var result = {
            isValid: false,
            isHit: false,
            isSink: null,
            isGameOver: false
        };

        if (isValidPosition(position)) {
            result.isValid = true;

            if (isHit(position, result)) {
                result.isHit = true;
            }
        }

        return result;
    };

    init();

    return that;
};



module.exports = Board;