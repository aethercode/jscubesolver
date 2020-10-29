var out = new Vue({
    el: '#out',
    data: {
        output: []
    }
})
var debug = new Vue({
    el: '#debug',
    data: {
        edgeStates: 'cube not loaded yet',
        cornerStates: 'cube not loaded yet'
    }
})

function clearOutput() {out.output = []}
function pushOutput(t, c) {
    if (c) {
        out.output.push({text: t, color: 'text-'+c})
    } else {
        out.output.push({text: t, color: 'text-secondary'})
    }
}
function debugUpdate(e, c) {
    debug.edgeStates = e
    debug.cornerStates = c
}

//long term goal: make it fully customizable and expand on orientation and permutation instead of corners and edges
class Cube {
    constructor(e, c, s, d) {
        pushOutput('loading...')

        this.edges = e.slice()
        this.corners = c.slice()
        this.defs = JSON.parse(JSON.stringify(d))
        this.solvedState = s

        this.moveNames = []
        this.moves = []

        function stringToNumberArray(s) {
            let numberArray = s.split('')
            for (var n in numberArray) {
                numberArray[n] = parseInt(numberArray[n])
            }
            return numberArray
        }

        for (var m in this.defs) {
            this.moveNames.push(this.defs[m].m)
            this.moves[this.defs[m].m] = {eo: {}, co: {}}
            this.moves[this.defs[m].m].ep = stringToNumberArray(this.defs[m].ep)
            this.moves[this.defs[m].m].cp = stringToNumberArray(this.defs[m].cp)
            this.moves[this.defs[m].m].eo.o = stringToNumberArray(this.defs[m].eo.o)
            this.moves[this.defs[m].m].co.o = stringToNumberArray(this.defs[m].co.o)
            this.moves[this.defs[m].m].eo.a = stringToNumberArray(this.defs[m].eo.a)
            this.moves[this.defs[m].m].co.a = stringToNumberArray(this.defs[m].co.a)
        }

        this.updatePerms = function(p, d) {
            let updatedPerms = p.slice()

            let buffer = updatedPerms[d[0]].i
            let onMove = 1
            while (onMove < d.length) {
                updatedPerms[d[onMove-1]].i = updatedPerms[d[onMove]].i
                onMove ++
            }
            updatedPerms[d[d.length-1]].i = buffer

            return updatedPerms
        }
        this.updateOrs = function(o, d, t) {
            //WHERE'S THE SOCK ERIC???
            let updatedOrs = JSON.parse(JSON.stringify(o))
            for (var c in d.a) {
                updatedOrs[d.a[c]].o = (updatedOrs[d.a[c]].o + d.o[c]) % t
            }


            return updatedOrs
        }

        this.move = function(c) {
            this.edges = this.updateOrs(this.edges, this.moves[c].eo, 2)
            this.corners = this.updateOrs(this.corners, this.moves[c].co, 3)
            this.edges = this.updatePerms(this.edges, this.moves[c].ep)
            this.corners = this.updatePerms(this.corners, this.moves[c].cp)

            debugUpdate('edges: '+this.edgesDebug(), 'corners: '+this.cornersDebug())
        }

        this.edgesDebug = function() {
            let out = ''
            for (var e in this.edges) {
                out += this.edges[e].i+' '+this.edges[e].o
                if (e < this.edges.length-1) {
                    out += ' | '
                }
            }
            return out
        }
        this.cornersDebug = function() {
            let out = ''
            for (var c in this.corners) {
                out += this.corners[c].i+' '+this.corners[c].o
                if (c < this.corners.length-1) {
                    out += ' | '
                }
            }
            return out
        }
        this.moveSafe = function(m) {
            var safe
            for (var l in this.moveNames) {
                if (m == this.moveNames[l]) {
                    safe = true
                }
            }

            if (safe) {
                this.move(m)
                pushOutput(m)
            } else {
                pushOutput(`invalid move(s)! (${m})`, 'danger')
            }
        }

        debugUpdate('edges: '+this.edgesDebug(), 'corners: '+this.cornersDebug())
        pushOutput('cube loaded!', 'success')
    }
}

var edges = [{i: 1, o: 0}, {i: 2, o: 0}, {i: 3, o: 0}, {i: 4, o: 0}, {i: 5, o: 0}, {i: 6, o: 0}, {i: 7, o: 0}, {i: 8, o: 0}, {i: 9, o: 0}, {i: 10, o: 0}, {i: 11, o: 0}, {i: 12, o: 0}]
var corners = [{i: 1, o: 0}, {i: 2, o: 0}, {i: 3, o: 0}, {i: 4, o: 0}, {i: 5, o: 0}, {i: 6, o: 0}, {i: 7, o: 0}, {i: 8, o: 0}]
var solved = {
    edges: edges,
    corners: corners
}

//template: {m: '', ep: '', cp: '', eo: {a: '', o: ''}, co: {a: '', o: ''}}

var moveDefs = [{m: 'R', ep: '1594', cp: '1234', eo: {a: '1594', o: '1111'}, co: {a: '1234', o: '1221'}}]

for (var m in moveDefs) {
    let newMove = {...moveDefs[m]}
    newMove.m = moveDefs[m].m+`'`
    newMove.ep = moveDefs[m].ep.split('').reverse().join('')
    newMove.cp = moveDefs[m].cp.split('').reverse().join('') 
    newMove.eo
    newMove.co
    newMove.eo.o = moveDefs[m].eo.o.split('').reverse().join('') 
    newMove.co.o = moveDefs[m].co.o.split('').reverse().join('')
    newMove.eo.a = moveDefs[m].eo.a.split('').reverse().join('')
    newMove.co.a = moveDefs[m].co.a.split('').reverse().join('') 
    moveDefs.push(newMove)
}

var tres

function reset() {
    clearOutput()
    tres = new Cube(edges, corners, solved, moveDefs)
}
reset()