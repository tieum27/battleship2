// JavaScript Model
var model = {
    boardSize: 10,
    numShips: 5,
    shipLength: [5, 4, 3, 3, 2],
    shipsSunk: 0,

	ships: [
    { locations: [0, 0, 0, 0, 0], hits: ["", "", "", "", ""] },
		{ locations: [0, 0, 0, 0], hits: ["", "", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0], hits: ["", ""]}
	],

	fire: function(guess) {

		for(var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// check if a ship location has already been hit
			if ( ship.hits[index] === "hit" ) {
				view.displayMessage("Oops, you already hit that location");
				return true;
			} else if ( index >= 0 ) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if ( this.isSunk(ship) ) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
			$('#guessInput').focus();
		}
		view.displayMiss(guess);
		view.displayMessage("You Missed");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < ship.hits.length; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		$('#guessInput').focus();
		return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
		do {
				locations = this.generateShip(i);
		} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function(index) {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength[index] + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength[index] + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];

		for (var i = 0; i < this.shipLength[index]; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				};
			};
		};
		return false;
	}
};

// View
var view = {
  boardSize: 10,

  displayTable: function() {
    $("#boardGame").append("<table id='boardTable'></table>");
    for (var i = 0; i < this.boardSize; i++) {
      $("#boardTable").append("<tr id="
      + i + " class='boardRow'></tr>");
      for(var j = 0; j < this.boardSize; j++) {
        $("#" + i).append("<td id=" + i + j + " class='boardCell' ></td>");
      } // end for loop to create the columns
    } // end for loop to create the rows
  },

	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

// Controller
var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = guess;
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
				$("td").off("click");
			}
		}
	}
};

// helper function to parse a guess from the user
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
				alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}

// event handlers
function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();
	controller.processGuess(guess);
	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	// in IE9 and earlier, the event object doesn't get passed
	// to the event handler correctly, so we use window.event instead.
	e = e || window.event;
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

function launchBattleship(){
	var choice = document.getElementById("guessChoice");
  var choiceInt = parseInt(choice.value)
	switch (choiceInt) {
    case 1:
      $("#choice").toggle();
      init1();
      break;
    case 2:
      $("#choice").toggle();
      $("#user-input").toggle();
      init2();
      break;
    default:
      alert("Please enter 1 or 2")
  }
};

function init1() {
  view.displayTable();
	// place the ships on the game board
	model.generateShipLocations();
	$("td").on("click",function(){
		console.log("HIT td click");
		// Check to see if the cell has already been targeted if true disable click
		if ($(this).hasClass("miss")) {
			$(this).off("click");
		}
		else {
			// Get the ID of the cell
			id= $(this).attr("id");
			// Split the ID to get the indexes for the boardArray
			var id1 = id.toString().split("")[0];
			var id2 = id.toString().split("")[1];
			var click = id1 + id2
			controller.processGuess(click);
		};
	});
};

function init2() {
  view.displayTable();
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	// place the ships on the game board
	model.generateShipLocations();
}
