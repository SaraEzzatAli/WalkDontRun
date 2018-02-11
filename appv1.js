const express = require('express') 
const app = express()
var path = require("path");
var spotcrime = require('spotcrime');

// variables that need to be connected to JSON from Alex
var currX;
var currY;
var newX = 31;
var newY = 31;

// somewhere near phoenix, az
var loc = {
  currX: 25, // pls check
  currY: 25
};

var radius = 0.001; // this is miles <-- 1/2 distance between most geometric blocks

var destinationBlockName;
var block = {
	x: 0,
	y: 0,
	name: '',
	value: 0,
	traversed: false,
	destination: false
}; // block object
var list = []; // array of blocks
var grid = []; // array of lists
var maxCrime;
var minSum;
var minSum_index;
var possiblePaths = []; // list of objects that track different paths
						// i.e. [{A:1, B:2, C:3, ...}, {...},...]
var shortestPaths = []; // list (maybe) of objects that have shortest path
var pathList = [];
var sumList = [];

var columns = (newY > currY ? (((newY - currY)/(radius * 2)) + 1) : ((currY - newY)/(radius * 2)) + 1);
var rows = (newX > currX ? ((newX - currX)/(radius * 2)) + 1 : ((currX - newX)/(radius * 2)) + 1);

// initializes the grid with crime data
function initGrid() {
	for (i = 0; i < rows; i++) {
		for (j = 0; j < columns; j++) {
			block.x = currX + radius * i;
			block.y = currY + radius * j;
			block.name = String.fromCharCode(65 + i * rows + j);
			spotcrime.getCrime(loc, radius, function(err, crimes) {
				maxCrime = (maxCrime > crimes.length ? maxCrime : crimes.length);
				block.value = crimes.length;
				// checks if block is destination block
				if (block.x == newX && block.y == newY) {
					block.destination = true;
				} else {
					block.destination = false;
				}
				list.push(block);
			})
			if (i == (rows - 1) && j == (columns - 1)) {
				destinationBlockName = block.name;
			}
			loc.currY += radius * 2;
			block.x = 0;
			block.y = 0;
			block.value = 0;
		}
		grid.push(list);
		list = [];
		loc.currX += radius * 2;
	}
}

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(3000, function(req, res) {
	console.log(rows);
});

//app.listen(3000, () => console.log('Example app listening on port 3000!'))

// ---------------------SAFEST PATH ALGO -------------------------

// create all potential paths from point A to B
function findPaths() {
	for(i = 0; i < rows; i++) {
		for (j = 0; j < columns; j++) {
			if (grid[i][j].destination) return;
			
		}
	}
}

function autosum(list) {
	for (var i in list) {
		sum += list[i];
	}
	return sum;
}

// find the sums of all potential paths
// under assumption that only one shortest path
function sumWorkingPaths() {
	var length = possiblePaths.length;
	for (i = 0; i < length; i++) {
		// possiblePaths[i] = {A:1, B:2, C:3, ...}
		var keysAtI = Object.keys(possiblePaths[i]); // [A, B, C, ...]
		var valuesAtI = Object.values(possiblePaths[i]); // [1, 2, 3, ...]
		if (keysAtI[keysAtI.length - 1] == destinationBlockName) {
			pathList.push(keysAtI);
			sumlist.push(autosum(valuesAtI)); 
		}
	}
}

// find the shortest path(s) 
function findShortestPath() {
	var length = sumList.length;
	for (i = 0; i < length; i++) {
		if (sumList[i] < minSum) {
			minSum = sumList[i];
			minSum_index = i;
		}
	}
	return pathList[minSum_index];
}

// find coordinates of shortest path

// Figure out how to add path to map --> Google API?
// maxCrime/7 

