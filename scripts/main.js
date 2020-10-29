var out = new Vue({
    el: '#out',
    data: {
        output: []
    }
})

var topBar = new Vue({
    el: '#topBar',
    data: {
        shown: true,
        debugEdgeStates: 'cube not loaded yet',
        debugCornerStates: 'cube not loaded yet',
        debugCenterStates: 'cube not loaded yet',
        debugShown: true,
        buttons:  {
            moves: []
        }
    }
})

function clearOutput() {
    out.output = []
}
function pushOutput(t, c) {
    if (c) {
        out.output.push({text: t, color: 'text-'+c})
    } else {
        out.output.push({text: t, color: 'text-secondary'})
    }
}

var tres
function debugUpdate() {
    let edgeOutput = ''
    let cornerOutput = ''
    let centerOutput = ''
    for (let edge in tres.pieces.edges.list) {
        let is = ''
        if (tres.pieces.edges.list[edge].i < 10) {
            is = '0'
        }
        edgeOutput += `[${is+tres.pieces.edges.list[edge].i}, ${tres.pieces.edges.list[edge].o}]`
    }
    for  (let corner in tres.pieces.corners.list) {
        let is = ''
        if (tres.pieces.corners.list[corner].i < 10) {
            is = '0'
        }
        cornerOutput += `[${is+tres.pieces.corners.list[corner].i}, ${tres.pieces.corners.list[corner].o}]`
    }
    for  (let center in tres.pieces.centers.list) {
        centerOutput += `[${tres.pieces.centers.list[center].i}]`
    }
    topBar.debugEdgeStates = edgeOutput
    topBar.debugCornerStates = cornerOutput
    topBar.debugCenterStates = centerOutput
}

function setup() {
    pushOutput('loading cube...', 'info')

    tres = new Cube([
        new pieceSet('edges', 12, 2),
        new pieceSet('corners', 8, 3),
        new pieceSet('centers', 6)
    ], moveDefs)

    debugUpdate()
    pushOutput('cube loaded!', 'success')
}
setup()

topBar.buttons.moves = moveNames
topBar.buttons.primeMoves = primeMoveNames

moveSafe = function(m) {
    let safeToMove
    for (var l in allMoveNames) {
        if (m == allMoveNames[l]) {
            safeToMove = true
        }
    }

    if (safeToMove) {
        tres.move(m)
        this.pushOutput(`>> ${m}`)
        debugUpdate()
    } else {
        this.pushOutput('invalid move(s)!', 'danger')
    }
    setTimeout(function() {
        resetSpacerHeight()
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight)
    })
}

var lastCommand = ''
var commands = new Vue({
    el: '#commands',
    data: {
        command: ''
    }, methods: {
        run: function() {
            if (commands.command !== '') {
                runCommand(commands.command)
                commands.command = ''
            }
        }, fillLastCommand: function() {
            commands.command = lastCommand
            setTimeout(function() {
                commands.$refs.commandInput.selectionStart = commands.$refs.commandInput.selectionEnd = 10000; 
            });
        }
    }
})

var topSpacer = new Vue({
    el: '#topSpacer',
    data: {
        height: 200
    }
})
var bottomSpacer = new Vue({
    el: '#bottomSpacer',
    data: {
        height: 200
    }
})

function resetSpacerHeight() {
    if (topBar.shown) {
        topSpacer.height = document.getElementById("topBar").offsetHeight
    } else {
        topSpacer.height = 0
    }
    bottomSpacer.height = document.getElementById("bottomBar").offsetHeight
}
window.onresize = function() {
    resetSpacerHeight()
}

var availableCommands = {
    info: function() {
        pushOutput(tres, 'info')
    }, clear: function() {
        clearOutput()
    }, debug: function() {
        if (topBar.debugShown) {
            pushOutput('debug panel closed', 'info')
        } else {
            pushOutput('debug panel opened', 'info')
        }
        topBar.debugShown = !topBar.debugShown
        setTimeout(resetSpacerHeight)
    }, help: function() {
        pushOutput('hahaha no help for you', 'danger')
    }, reset: function() {
        setup()
    }, topbar: function() {
        if (topBar.shown) {
            pushOutput('top bar hidden', 'info')
        } else {
            pushOutput('top bar shown', 'info')
        }
        topBar.shown = !topBar.shown
        setTimeout(resetSpacerHeight)
    }, move: function(moves) {
        let moveString = moves.join('').split('')
        let movesOutput = []
        let currentMove = ''

        for (let character = 0; character < moveString.length; character ++) {
            if (moveString[character] !== `'`) {
                currentMove = moveString[character]
                if (moveString[character+1] !== `'`) {
                    movesOutput.push(currentMove)
                }
            } else if (character > 0) {
                currentMove += moveString[character]
                movesOutput.push(currentMove)
            }
        }

        let valid = true
        if (movesOutput.length == 0) {
            valid = false
        }
        for (let move in movesOutput) {
            let thisMoveValid = false
            for (let moveCheck in allMoveNames) {
                if (movesOutput[move] == allMoveNames[moveCheck]) {
                    thisMoveValid = true
                }
            }
            if (thisMoveValid == false) {
                valid = false
            }
        }
        if (valid) {
            for (let move in movesOutput) {
                tres.move(movesOutput[move])
            }
            let movesInfo = ''
            for (let move in movesOutput) {
                let infoOutput = movesOutput[move]
                if (move !== movesOutput.length -1) {
                    infoOutput += ' '
                }
                movesInfo += infoOutput
            }
            pushOutput(`applied moves: ${movesInfo}`, 'info')
            debugUpdate()
        } else {
            pushOutput('invalid move(s)!', 'danger')
        }
    }
}

function runCommand(input) {
    pushOutput(`>> ${input}`)

    let commandLetters = input.split('')
    let blocks = []
    let currentBlock = ''
    for (let letter in commandLetters) {
        if (commandLetters[letter] == ' ') {
            blocks.push(currentBlock)
            currentBlock = ''
        } else {
            currentBlock += commandLetters[letter]
            if (letter == commandLetters.length-1) {
                blocks.push(currentBlock)
            }
        }
    }

    let command = blocks[0].toLowerCase()

    if (availableCommands[command]) {
        blocks.shift()
        availableCommands[command](blocks)
    } else {
        pushOutput(`unknown command: ${command}`, 'danger')
    }

    lastCommand = input

    setTimeout(function(){
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight)
    });
}

setTimeout(resetSpacerHeight)