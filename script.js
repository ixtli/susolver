// Node representation metrics
const squareSize = 32;
const gap = 3;
const border = 8;
const inner_space = 2;

// HTML5 stuff
window.onload = init;
var mrvCheck = null;
var select = null;
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
const numberMin = 1;

var selectionIndex = 0;
var hilightIndex = 0;

const noValue = -1;

var puzzles = [];
var currentPuzzle = null;

function genRegion(x,y)
{
    return Math.floor(x/regionsWide) + Math.floor(y/regionHeight) * regionsWide;
}

function loadPuzzles ()
{
    puzzles["wikipedia"] =
"5 3 - - 7 - - - - \
6 - - 1 9 5 - - - \
- 9 8 - - - - 6 - \
8 - - - 6 - - - 3 \
4 - - 8 - 3 - - 1 \
7 - - - 2 - - - 6 \
- 6 - - - - 2 8 - \
- - - 4 1 9 - - 5 \
- - - - 8 - - 7 9";

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
    
    this.emptyValues = puzzleLength;
    
    return this.init(p, token);
}

SudokuPuzzle.prototype =
{
    
    // make-sudoku-puzzle
    // Note that I couldn't name a function this because you shouldn't be
    // allowed to use - in a symbol name ever for any reason period.
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
            obj[i] = 0;
        
        // Init row domains
        var obj = this.rowDomain;
        for (var i = obj.length - 1; i >= 0; i--)
            obj[i] = 0;
        
        // Init region domains
        var obj = this.regionDomain;
        for (var i = obj.length - 1; i >= 0; i--)
            obj[i] = 0;
        
        var x, y;
        for (var i = 0; i < puzzleLength; i++)
        {
            val = parseInt(tmp[i]);
            x = i % puzzleWidth;
            y = (i - x) / puzzleWidth;
            
            this.placeValue( isNaN(val) == true ? noValue : val, x, y );
        }
        
        // Explicit garbage collection
        delete tmp;
        
        return true;
    },
    
    placeValue: function (val, x, y)
    {
        // Place val at x, y using state
        
        if (val > numberMax) return false;
        if (x > puzzleWidth - 1 || x < 0) return false;
        if (y > puzzleHeight - 1 || y < 0) return false;
        
        // If consistencyCheck is true, then use the stateless version
        // which checks each row, column, and region to validate the state
        //if (consistencyCheck == true)
        //    return this.statelessPlaceValue(val, x, y, consistencyCheck);
        
        if (val < numberMin)
            return this.clear(x,y);
        else
            return this.set(val, x, y);
    },
    
    set: function (val, x, y)
    {
        // set val at x, y and update state
        var ind = x + y * puzzleWidth;
        var p = this.puzzle;
        var region = genRegion(x,y);
        
        // Don't allow overwriting values
        if (p[ind] != noValue) return false;
        
        if (this.rowUnique(val, y) == false)
            return false;
        if (this.columnUnique(val, x) == false)
            return false;
        if (this.regionUnique(val, region) == false)
            return false;
        
        // update state
        this.rowDomain[y] |= 1 << val - 1;
        this.columnDomain[x] |= 1 << val - 1;
        this.regionDomain[region] |= 1 << val - 1;
        
        p[ind] = val;
        this.emptyValues--;
        
        // redraw map
        // updateSquare(x,y);
        
        return true;
    },
    
    clear: function (x, y)
    {
        // clear value at x, y and add the value back to the domains
        var ind = x + y * puzzleWidth;
        var p = this.puzzle;
        var region = genRegion(x,y);
        
        var oldVal = p[ind];
        if (oldVal == noValue) return true;
        
        this.rowDomain[y] ^= 1 << (oldVal - 1);
        this.columnDomain[x] ^= 1 << (oldVal - 1);
        this.regionDomain[region] ^= 1 << (oldVal - 1);
        
        // update state
        p[ind] = noValue;
        this.emptyValues++;
        
        // redraw map
        // updateSquare(x,y);
        
        return true;
    },
    
    statelessPlaceValue: function (val, x, y, checkState)
    {
        if (this.statelessRowUnique(val, y) > noValue) return noValue;
        if (this.statelessColumnUnique(val, x) > noValue) return noValue;
        if (this.statelessRegionUnique(val, genRegion(x,y)) > noValue)
            return noValue;
        
        if (checkState == true)
        {
            // Check the state, and throw an error if the state says the value
            // is invalid for any reason.
            if (this.rowUnique(val, y) == false)
            {
                if (console.log != "undefined") console.log("Inconsistency");
                return noValue;
            }
            
            if (this.columnUnique(val, x) == false)
            {
                if (console.log != "undefined") console.log("Inconsistency");
                return noValue;
            }
            
            if (this.regionUnique(val, genRegion(x,y)) == false)
            {
                if (console.log != "undefined") console.log("Inconsistency");
                return noValue;
            }
        }
        
        this.set(val, x, y);
        
        return true;
    },
    
    rowUnique: function (val, row)
    {
        // check that val isn't in row
        return (this.rowDomain[row] & (1 << val - 1) )== 0 ? true : false;
    },
    
    columnUnique: function (val, column)
    {
        return (this.columnDomain[column] & (1 << val - 1)) == 0 ? true : false;
    },
    
    regionUnique: function (val, region)
    {
        return (this.regionDomain[region] & (1 << val - 1)) == 0 ? true : false;
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
        startIndex += ((region - xstart) / regionsHigh) * 
            (puzzleWidth * regionsHigh);
        
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

function backtrackingSearch (p, i)
{

this.guesses = 0;

if (p == null) return false;

var puzzle = p.puzzle,
    rDomain = p.rowDomain,
    cDomain = p.columnDomain,
    regionDomain = p.regionDomain;

var selectUnassignedVariable = (mrvCheck.checked == true ? mrv : first);
var inf = i;

// ECMAScript is broken as implemented, so do this hack:
var self = this;

backtrack(p);

function checkForRemainingValues(ind)
{
    var x = ind % puzzleWidth;
    var y = (ind - x) / puzzleWidth;
    var r = genRegion(x,y);
    
    x = cDomain[x];
    y = rDomain[y];
    r = regionDomain[r];
    
    // Quick out if any are full
    if (r == 0x1FF) return [];
    if (y == 0x1FF) return [];
    if (x == 0x1FF) return [];
    
    // Check to see if any have anything in common
    var val, res = [];
    for (var i = 8; i >= 0; i--)
    {
        val = 0;
        val += (r & (1 << i));
        val += (y & (1 << i));
        val += (x & (1 << i));
        
        if (val == 0) res.push(i+1);
    }
    
    return res;
}

function first()
{
    for (var i = puzzleLength - 1; i >= 0; i--)
        if (puzzle[i] == noValue)
            return {index: i, values: checkForRemainingValues(i)};
    
    return null;
}

function mrv()
{
    var ret = null, tmp = 0, min = null;
    
    for (var i = puzzleLength - 1; i >= 0; i--)
    {
        if (puzzle[i] == noValue)
        {
            tmp = checkForRemainingValues(i);
            if (tmp.length < min || min == null)
            {
                ret = {index: i, values: tmp};
                min = tmp.length;
            }
        }
    }
    
    return ret;
}

function nextDomainValue(x)
{
    for (var i = 9; i > 0; i--)
        if ((rDomain[x] & (1 << (i - 1))) == 0)
            return i;
    
    return noValue;
}

function backtrack (p)
{
    // If the puzzle is complete, return
    if (p.emptyValues == 0) return true;
    
    var values, index, value, x;
    
    // Select an unassigened variable.  By default, choose the first
    {
        var ret = selectUnassignedVariable();
        if (ret == null || ret.values.length < 1) return false;
        index = ret.index;
        values = ret.values;
    }
    
    self.guesses += values.length - 1;
    
    // For each value in domain values.  It's over if we find even
    for (var i = values.length - 1; i >= 0; i--)
    {
        value = values[i];
        x = index % puzzleWidth;
        
        // Assert this assignment
        if (p.placeValue(value, x, (index - x) / puzzleWidth) == true)
        {
            // Add inferences to assignment
            if (infer(inf) != false)
                if (backtrack(p) != false)
                    return true;
            
            p.placeValue(noValue, x, (index - x) / puzzleWidth);
        }
    }
    
    return false;
}

function infer(i)
{
    // Have the ability to turn off inference
    if (i == false) return true;
    
    if (p.emptyValues == 0) return true;
    
    // AC-3 does nothing here because of how checkForRemainingValues() works
    
    return true;
}

}

function initCanvas()
{
    // Get the canvas element to display the game in.
    canvas = document.getElementById('display');
    canvas.width = document.body.offsetWidth;
    canvas.height = window.innerHeight - 150;
    
    // Get graphics contexts for the canvas elements
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillStyle = "black";
    ctx.font = "12pt sans-serif";
}

function init()
{
    var t0 = new Date();
    loadPuzzles();
    var t1 = new Date();
    
    initCanvas();
    
    if (console.log != "undefined")
        console.log("Setup time: " + (t1-t0) + "ms");
    
    configureEventBindings();
    
    solvePuzzle(select.options[select.selectedIndex].value);
}

function solvePuzzle(t)
{
    resetPuzzle(puzzles[t], " ");
    
    t0 = new Date();
    var result = new backtrackingSearch(currentPuzzle, true);
    t1 = new Date();
    
    document.getElementById('time').innerHTML = 
        "Backtrack time: " + (t1-t0) + "ms";
    
    document.getElementById('guesses').innerHTML = 
        "Guesses: " + result.guesses;
    
    updateMap();
}

function resetPuzzle(p, token)
{
    if (currentPuzzle != null)
        delete currentPuzzle;
    
    currentPuzzle = new SudokuPuzzle(p, token);
    
    selectionIndex = 0;
    hilightIndex = 0;
}

function updateMap()
{
    if (currentPuzzle == null) return false;
    
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
    
    if (currentPuzzle == null) return false;
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
    mrvCheck = document.getElementById('mrv');
    select = document.getElementById('list');
    
    window.onmousemove = mouseHandler;
    window.onmousedown = mousedownHandler;
    
    window.onresize = function () {
        initCanvas();
        updateMap();
    };
    
    select.onchange = function () {
        solvePuzzle(select.options[select.selectedIndex].value);
    }
    
    mrvCheck.onclick = function () {
        solvePuzzle(select.options[select.selectedIndex].value);
    }
    
    // Populate list box
    var opt;
    for (i in puzzles)
    {
        if (puzzles.hasOwnProperty(i))
        {
            opt = document.createElement('option');
            opt.text = i;
            opt.value = i;
            select.add(opt, 0);
        }
    }
    
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

