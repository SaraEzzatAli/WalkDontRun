const express = require('express') 
const app = express()
var path = require("path");
var bodyParser = require('body-parser');
var spotcrime = require('spotcrime');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
// var spotcrime = require('spotcrime');

app.post('/test', function(req, res) {



    console.log(JSON.stringify(req.body));

    let lat = parseFloat(req.body['lat']);
    let lng = parseFloat(req.body['lng']);

    res.json([
        [lat],
        [lng],
        []
    ]);
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/bootstrap.min.css', function(req, res){
    res.sendFile(path.join(__dirname+'/bootstrap.min.css'));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))


// ----------BACKEND COMPUTATIONS-------------

// somewhere near phoenix, az
var loc = {
  currX: 43.0847863, // pls check
  currY: -77.68137229999999
};

// variables that need to be connected to JSON from Alex
var currX = loc.currX;
var currY = loc.currY;
var newX = 33.39657;
var newY = -112.03422;

var radius = 0.5; // this is miles <-- 1/2 distance between most geometric blocks

var destinationBlockName;
var block = {
	x: 0,
	y: 0,
	name: '',
	value: 0,
	traversed: false,
	destination: false
}; // block object\\\\
var list = []; // array of blocks
var grid = []; // array of lists
var maxCrime = -1;
var minSum = 9007199254740991;
var minSum_index;
var possiblePaths = [{A:1, B:2, C:8, D:5},
					 {E:4, B:27, C:3, D:50},
					 {A:3, b:12, C:4, D:5},
					 {A:1, B:2, e:3, D:9},
					 {A:6, B:45, C:3, r:5},
					 {A:9, t:2, C:5, D:3},
					 {A:1, B:32, q:3, D:5},
					 {p:8, B:2, C:3, D:9},
					 {A:6, B:4, l:7, D:5},
					 {A:4, m:2, C:3, D:8},
					 {A:2, B:2, C:9, w:5},
					 {x:3, B:6, C:3, D:5},
					 {A:3, r:2, C:1, D:6},
					 {A:1, B:7, C:3, D:5},
					 {A:7, B:2, t:2, D:4},
					 {A:10, q:1, C:3, D:5},
					 {q:1, e:2, r:1, w:1} ]; // list of objects that track different paths
						// i.e. [{A:1, B:2, C:3, ...}, {...},...]
var shortestPaths = []; // list (maybe) of objects that have shortest path
var pathList = [];
var sumList = [];

var columns = (newY > currY ? (((newY - currY)/(radius * 2)) + 1) : ((currY - newY)/(radius * 2)) + 1);
var rows = (newX > currX ? ((newX - currX)/(radius * 2)) + 1 : ((currX - newX)/(radius * 2)) + 1);

var num = 33;

function ascii (i, rows, j) {
	num = 33 + i * rows + j;
	if (num > 126) {
		num -= 93;
	}
	if (num < 33) {
		num += 33;
	}
	return num;
}

// initializes the grid with crime data
function initGrid() {
	for (i = 0; i < rows; i++) {
		for (j = 0; j < columns; j++) {
			block.x = currX + 2 * radius * i;
			block.y = currY + 2 * radius * j;
			//console.log(block.x);
			//console.log(block.y);
			block.name = String.fromCharCode(ascii(i, rows, j));
			spotcrime.getCrimes(loc, radius, function(err, crimes) {
				block.value =  crimes.length;
				console.log(block.value);
			});
			//console.log(maxCrime);
			maxCrime = (maxCrime >= block.value ? maxCrime : block.value);
			// checks if block is destination block
			if (block.x == newX && block.y == newY) {
				block.destination = true;
			} else {
				block.destination = false;
			}
			//console.log(block);
			
			if (i == (rows - 1) && j == (columns - 1)) {
				destinationBlockName = block.name;
			}
			list.push(block);
			loc.currY += 2 * radius * j;
		}
		//console.log(list);

		grid.push(list);
		//console.log(grid);
		list = [];
		loc.currX += 2 * radius * i;
	}
}

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(3400, function(req, res) {
	initGrid();
	//console.log(grid);
	//console.log(maxCrime);
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
	var sum = 0;
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
			sumList.push(autosum(valuesAtI)); 
		}
	}
}

// find the shortest path(s) 
function findShortestPath() {
	var length = sumList.length;
	for (i = 0; i < length; i++) {
		//console.log(minSum);
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


