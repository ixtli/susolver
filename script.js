// Node representation metrics
const squareSize = 32;
const gap = 3;
const border = 8;
const inner_space = 2;

// HTML5 stuff
window.onload = init;
var canvas = null;
var ctx = null;
var mouseX = 0, mouseY = 0;

// App state defaults
// N.B.: I do NOT know this will work if the puzzle isn't square.
const puzzleWidth = 9;
const puzzleHeight = 9;
const regionsWide = 3;
const regionsHigh = 3;
const regionWidth = puzzleWidth / regionsWide;
const regionHeight = puzzleHeight / regionsHigh;
const puzzleLength = puzzleWidth * puzzleHeight;
const numberMax = 9;

var selectionIndex = 0;
var hilightIndex = 0;

const noValue = -1;

var puzzles = [];
var currentPuzzle = null;

function loadPuzzles ()
{
    puzzles["puz-001"] = 
"7 8 1 6 - 2 9 - 5 \
9 - 2 7 1 - - - - \
- - 6 8 - - - 1 2 \
2 - - 3 - - 8 5 1 \
- 7 3 5 - - - - 4 \
- - 8 - - 9 3 6 - \
1 9 - - - 7 - 8 - \
8 6 7 - - 3 4 - 9 \
- - 5 - - - 1 - -";

    puzzles["puz-002"] =
"- - 2 5 4 7 3 6 - \
4 6 5 - - 3 - - 7 \
7 3 - - - 6 8 - 5 \
- - 6 8 1 5 4 7 9 \
- - - 3 6 4 5 - - \
- - 4 - - - - - - \
- 5 7 - - 8 - - - \
- 4 - 6 - 1 - 9 - \
- 9 8 7 - - - 5 -";

    puzzles["puz-010"] =
"4 - - 8 9 3 2 - - \
- 2 - 1 - 4 - 3 - \
- 9 - - 2 6 4 - 5 \
- - 8 - - 9 - 5 4 \
- - - 3 - 1 7 2 8 \
3 7 - - - 5 1 - - \
- 3 9 - - - - 1 7 \
- 8 6 - - - - - - \
- - 1 - - - 9 - 2";

    puzzles["puz-015"] = 
"- - 7 - 6 - - 3 - \
9 - - - - - 1 4 - \
- 6 4 - - 5 - - - \
1 - - - - 8 - - 5 \
- - - 5 7 - 9 1 - \
5 3 9 - 4 - - 6 - \
6 - - - 5 1 - 7 2 \
2 - - - 3 7 6 - 1 \
- - - 6 - - - - -";
    
    puzzles["puz-025"] = 
"- 7 - - - 2 3 - 4 \
- - 9 - 5 3 - - - \
- - 4 - - - - - - \
- - - - - - - - 8 \
- - - 6 - 8 1 9 - \
- - 7 2 - - - 5 - \
- 8 - - 1 - 4 - - \
- 6 - - - - 7 - - \
- 3 2 - - - - - -";
    
    puzzles["puz-026"] =
"- 8 - - - - - - - \
- 4 7 8 - 9 - - 1 \
- - 1 4 5 - - 2 - \
8 1 6 7 - - 5 - - \
9 - - - - 1 - - - \
- - - 5 6 - - - - \
- - - - - 8 - 5 3 \
- - - - - - - 8 - \
- - - 3 1 - - 4 6";
    
    puzzles["puz-048"] =
"- - - 7 - - - - 2 \
- - - - 3 6 - - - \
- - 5 - - - - 3 - \
- - 8 - - 2 5 4 - \
7 - - 4 - 9 - - - \
- - - - - - - - 6 \
- 4 3 - 7 - - 2 - \
- - - - - - 9 - - \
- 7 - 1 5 - - - -";
    
    puzzles["puz-051"] = 
"- - 2 - - 1 4 - - \
7 - - 3 8 - - 2 6 \
- - 6 - - - - - 5 \
- - 9 - - - - - 8 \
1 - - - - 3 9 - - \
8 - - - - 2 - - - \
- - - 2 - - - - - \
5 - - - - - - - 4 \
- - 7 - - 9 6 - -";

    puzzles["puz-062"] = 
"7 - 8 1 4 - - - - \
- 6 5 - - - 4 2 - \
3 4 - 9 - - - - - \
6 - - - - - - 7 5 \
- - - - 9 - - 4 - \
- - 3 - - - - 6 - \
1 9 - 8 - 6 - - 7 \
- - - 4 - - - - - \
5 - - - 3 - - - 4";

    puzzles["puz-076"] = 
"4 - - - 2 3 - - - \
- - - 5 9 6 7 - - \
- 9 - 7 - - - - - \
8 - - - - - - - - \
- - 5 - - - 1 6 - \
- - - - - - - 9 4 \
- 8 - - - - - - - \
9 - - - - 2 - - 3 \
6 - 3 8 5 4 - 1 2";

    puzzles["puz-081"] =
"- 2 - - 3 - - - 4 \
- 1 9 - 2 - - 8 - \
7 - 8 - - - - - - \
2 7 6 - - 4 3 - - \
8 - - - - - - - 6 \
- - - - 8 - - - - \
- - - - 6 - - 9 5 \
- - - 5 - 9 - - - \
- - 3 7 - - - - -";

    puzzles["puz-082"] =
"- 9 4 - 3 6 2 - - \
- 7 - - - - - - 5 \
- 3 - 4 - - - - - \
- - - 8 - 1 5 - - \
- 2 - - 4 - - - - \
7 - - - - - - - 6 \
8 - - - 5 7 9 - - \
- - - - - - 3 - - \
- - - - - 2 - - 7";

    puzzles["puz-090"] =
"- - 5 - - - - - - \
- - 4 8 6 - 9 - - \
- - - 3 - 7 8 - - \
- - - - 4 2 - - 7 \
- - 2 - - - - - - \
1 - - - - 8 6 - - \
- 8 - - 9 - 7 - - \
- - - - 1 5 - - 6 \
6 - - - - - - - 4";

    puzzles["puz-095"] =
"- 2 - - - 1 - - 4 \
5 - - 7 6 - - - - \
- - 7 - - - - - 8 \
1 - 6 - - - - - - \
- 8 - - - 5 - 3 - \
- 7 - - - - 4 9 - \
- - 8 - 3 - 5 - - \
- - - 8 - - 2 - - \
6 - - - 5 - 3 - -";

    puzzles["puz-099"] =
"- 5 - - 7 - - - - \
1 7 8 - - - - - 9 \
- 9 6 - - - - - 3 \
3 - - - - 1 - - 8 \
- - 9 4 3 - 7 - - \
- - - 2 - - 6 - - \
- 3 7 - 2 - - 6 - \
8 - - 3 5 - 4 - - \
- - - - - - - - -";

    puzzles["puz-100"] =
"- 1 9 - - - - - - \
- - 8 - - 3 - 5 - \
- 7 - 6 - - - 8 - \
- - 1 - - 6 8 - 9 \
8 - - - 4 - - - 7 \
9 4 - - - - - 1 - \
- - - - - 2 - - - \
- - - - 8 - 5 6 1 \
- - 3 7 - - - 9 -";

}

function SudokuPuzzle (p, token)
{
    this.puzzle = new Array(puzzleWidth * puzzleHeight);
    
    this.columnDomain = new Array(puzzleWidth);
    this.rowDomain = new Array(puzzleHeight);
    this.regionDomain = new Array(regionsWide * regionsHigh);
    
    return this.init(p, token);
}

SudokuPuzzle.prototype = {
    
    init: function (p, token)
    {
        var puzzle = this.puzzle;
        
        var tmp = p.split(token);
        var val = 0;
        
        if (tmp.length != puzzleLength)
        {
            if (console.log != "undefined")
                console.log("Puzzle description corrupted.");
            
            return false;
        }
        
        // Init puzzle
        for (var i = puzzleLength - 1; i >= 0; i--)
            puzzle[i] = noValue;
        
        // Init column domains
        var obj = this.columnDomain;
        for (var i = obj.length - 1; i >= 0; i--)
        {
            obj[i] = new Array(numberMax);
            val = obj[i];
            for (var j = 8; j >= 0; j--)
                val[j] = j + 1;
        }
        
        // Init row domains
        var obj = this.rowDomain;
        for (var i = obj.length - 1; i >= 0; i--)
        {
            obj[i] = new Array(numberMax);
            val = obj[i];
            for (var j = 8; j >= 0; j--)
                val[j] = j + 1;
        }
        
        // Init region domains
        var obj = this.columnDomain;
        for (var i = obj.length - 1; i >= 0; i--)
        {
            obj[i] = new Array(numberMax);
            val = obj[i];
            for (var j = 8; j >= 0; j--)
                val[j] = j + 1;
        }
        
        for (var i = 0; i < puzzleLength; i++)
        {
            val = parseInt(tmp[i]);
            
            if (isNaN(val) == true)
                puzzle[i] = noValue;
            else
                puzzle[i] = val;
        }
        
        // Explicit garbage collection
        delete tmp;
        
        return true;
    },
    
    placeValue: function (val, x, y)
    {
        
    },
    
    statelessPlaceValue: function (val, x, y, checkState)
    {
        if (this.statelessRowUnique(val, y) > noValue) return noValue;
        if (this.statelessColumnUnique(val, x) > noValue) return noValue;
        
        var region = x % regionWidth;
        region += (y % regionHeight) * regionWidth;
        if (this.statelessRegionUnique(val, region) > noValue) return noValue;
        
        if (checkState == true)
        {
            // Check the state, and throw an error if the state says the value
            // is invalid for any reason.
            if (this.rowUnique(val, y) == false)
            {
                if (console.log != "undefined") console.log("Inconsistency");
                return false;
            }
            
            if (this.columnUnique(val, x) == false)
            {
                if (console.log != "undefined") console.log("Inconsistency");
                return false;
            }
            
            if (this.regionUnique(val, region) == false)
            {
                if (console.log != "undefined") console.log("Inconsistency");
                return false;
            }
        }
        
        this.puzzle[x + y * puzzleWidth] = val;
        updateSquare(x,y);
        
        return true;
    },
    
    rowUnique: function (val, row)
    {
        
        return true;
    },
    
    columnUnique: function (val, column)
    {
        
        return true;
    },
    
    regionUnique: function (val, region)
    {
        
        return true;
    },
    
    statelessRowUnique: function (val, row)
    {
        var puzzle = this.puzzle;
        var max = puzzleWidth * row + puzzleWidth;
        for (var i = puzzleWidth * row; i < max; i++)
            if (puzzle[i] == val) return i;
        return noValue;
    },
    
    statelessColumnUnique: function (val, column)
    {
        var puzzle = this.puzzle;
        for (var i = puzzleHeight - 1; i >= 0; i--)
            if (puzzle[i * puzzleWidth + column] == val)
                return (i * puzzleWidth + column);
            
        return noValue;
    },
    
    statelessRegionUnique: function (val, region)
    {
        var puzzle = this.puzzle;
        
        // Regions are numbered from left to right, top to bottom, 0 - 8
        var xstart = region % regionsWide;
        
        var startIndex = xstart * regionWidth;
        startIndex += ((region - xstart) / regionsHigh)*(puzzleWidth * regionsHigh);
        
        var max = startIndex + regionWidth;
        for (var i = startIndex; i < max; i++)
            if (puzzle[i] == val) return i;
        
        startIndex += puzzleWidth;
        max = startIndex + regionWidth;
        for (var i = startIndex; i < max; i++)
            if (puzzle[i] == val) return i;
        
        startIndex += puzzleWidth;
        max = startIndex + regionWidth;
        for (var i = startIndex; i < max; i++)
            if (puzzle[i] == val) return i;
        
        // Not found
        return noValue;
    },
    
}

function init()
{
    // Get the canvas element to display the game in.
    canvas = document.getElementById('display');
    canvas.width = document.body.offsetWidth;
    canvas.height = window.innerHeight - 10;
    
    // Get graphics contexts for the canvas elements
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillStyle = "black";
    ctx.font = "12pt sans-serif";
    
    configureEventBindings();
    
    loadPuzzles();
    
    resetPuzzle(puzzles["puz-100"], " ", 9, 9);
    
    currentPuzzle.statelessPlaceValue(2,0,0,true);
    currentPuzzle.statelessPlaceValue(3,3,3,true);
}

function resetPuzzle(p, token)
{
    if (currentPuzzle != null)
        delete currentPuzzle;
    
    currentPuzzle = new SudokuPuzzle(p, token);
    
    selectionIndex = 0;
    hilightIndex = 0;
    
    updateMap();
}

function updateMap()
{
    var t0 = new Date();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var ind = -1, len = 0, puzzle = currentPuzzle.puzzle, val = 0;
    for (var y = puzzleHeight - 1; y >= 0; y--)
    {
        for (var x = puzzleWidth - 1; x >= 0; x--)
        {
            ind = x + y * puzzleWidth;
            val = puzzle[ind];
            
            if (ind == hilightIndex)
            {
                ctx.strokeStyle = "red";
            } else if (ind == selectionIndex) {
                ctx.strokeStyle = "blue";
            } else {
                ctx.strokeStyle = "black";
            }
            
            ctx.strokeRect(border + x * (squareSize + gap),
                border + y * (squareSize + gap), squareSize, squareSize);
            
            if (val == noValue) continue;
            
            len = ctx.measureText(val).width;
            ctx.fillText(val,
                border + x * (squareSize + gap) + len + 2,
                border + y * (squareSize + gap) + (squareSize >> 1) + 6);
        }
    }
    var t1 = new Date();
    // console.log("Update map:" + (t1-t0) + "ms");
}

function updateSquare(x,y)
{
    var ind = x + y * puzzleWidth;
    
    if (ind < 0 || ind >= puzzleLength || x < 0 || x >= puzzleWidth)
        return false;
    
    var val = currentPuzzle.puzzle[ind];
    
    // The +/- 1 here is to compensate for the way antialiasing happens on
    // OS X webkit
    ctx.clearRect(border + x * (squareSize + gap) - 1,
        border + y * (squareSize + gap) - 1,
        squareSize + 2, squareSize + 2);
    
    if (ind == hilightIndex)
    {
        ctx.strokeStyle = "red";
    } else if (ind == selectionIndex) {
        ctx.strokeStyle = "blue";
    } else {
        ctx.strokeStyle = "black";
    }
    
    ctx.strokeRect(border + x * (squareSize + gap),
        border + y * (squareSize + gap), squareSize, squareSize);
    
    if (val == noValue) return true;
    
    var len = ctx.measureText(val).width;
    ctx.fillText(val,
        border + x * (squareSize + gap) + len + 2,
        border + y * (squareSize + gap) + (squareSize >> 1) + 6);
    
    return true;
}

function configureEventBindings()
{
    // Set up click handlers
    window.onmousemove = mouseHandler;
    window.onmousedown = mousedownHandler;
    window.onresize = init;
}

function mousedownHandler(evt)
{
    
    var oldx = selectionIndex % puzzleWidth;
    var oldy = (selectionIndex - oldx) / puzzleHeight;
    
    var ind = mouseX + mouseY * puzzleWidth;
    if (ind < 0 || ind >= puzzleLength) return true;
    
    selectionIndex = ind;
    updateSquare(mouseX, mouseY);
    updateSquare(oldx, oldy);
    
    // Do work
    // console.log("Selected index:" + ind);
    
    return false;
}

function mouseHandler(evt)
{
    var oldx = mouseX;
    var oldy = mouseY;
    
    mouseX = evt.pageX - canvas.offsetLeft;
    mouseY = evt.pageY - canvas.offsetTop;
    
    mouseX = Math.floor((mouseX - border) / (squareSize + gap));
    mouseY = Math.floor((mouseY - border) / (squareSize + gap));
    
    hilightIndex = mouseX + mouseY * puzzleWidth;
    
    updateSquare(oldx, oldy);
    updateSquare(mouseX, mouseY);
    
    return false;
}

