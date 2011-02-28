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
var puzzleWidth = 10;
var puzzleHeight = 10;

var puzzle = null;
var puzzleLength = 0;
var selectionIndex = 0;
var hilightIndex = 0;

var noValue = "-";

var puzzle1 =
"7 8 1 6 - 2 9 - 5 \
9 - 2 7 1 - - - - \
- - 6 8 - - - 1 2 \
2 - - 3 - - 8 5 1 \
- 7 3 5 - - - - 4 \
- - 8 - - 9 3 6 - \
1 9 - - - 7 - 8 - \
8 6 7 - - 3 4 - 9 \
- - 5 - - - 1 - -";

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
    
    resetPuzzle(puzzle1, " ", 9, 9);
}

function resetPuzzle(p, token, w, h)
{
    if (puzzle != null) delete puzzle;
    
    puzzleWidth = w;
    puzzleHeight = h;
    selectionIndex = 0;
    hilightIndex = 0;
    
    puzzle = p.split(token);
    puzzleLength = puzzle.length;
    
    updateMap();
}

function updateMap()
{
    var t0 = new Date();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var ind = -1, len = 0;
    for (var y = puzzleHeight - 1; y >= 0; y--)
    {
        for (var x = puzzleWidth - 1; x >= 0; x--)
        {
            ind = x + y * puzzleWidth;
            
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
            
            if (puzzle[ind] == noValue) continue;
            
            len = ctx.measureText(puzzle[ind]).width;
            ctx.fillText(puzzle[ind],
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
    
    if (puzzle[ind] == noValue) return true;
    
    var len = ctx.measureText(puzzle[ind]).width;
    ctx.fillText(puzzle[ind],
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

