var out = new Vue({
    el: "#out",
    data: {
        output: []
    }
})
var debug = new Vue({
    el: "#debug",
    data: {
        edgestates: "cube not loaded yet",
        cornerstates: "cube not loaded yet"
    }
})

function outclear() {out.output = []}
function outpush(t, c) {
    if (c) {
        out.output.push({text: t, color: "text-"+c})
    } else {
        out.output.push({text: t, color: "text-secondary"})
    }
}
function debugupdate(e, c) {
    debug.edgestates = e
    debug.cornerstates = c
}

var edges = [{i: 1, o: 0}, {i: 2, o: 0}, {i: 3, o: 0}, {i: 4, o: 0}, {i: 5, o: 0}, {i: 6, o: 0}, {i: 7, o: 0}, {i: 8, o: 0}, {i: 9, o: 0}, {i: 10, o: 0}, {i: 11, o: 0}, {i: 12, o: 0}]
var corners = [{i: 1, o: 0}, {i: 2, o: 0}, {i: 3, o: 0}, {i: 4, o: 0}, {i: 5, o: 0}, {i: 6, o: 0}, {i: 7, o: 0}, {i: 8, o: 0}]
var solved = {
    edges: edges,
    corners: corners
}
var movedefs = []

class Cube {
    constructor(e, c, s, d) {
        outpush("loading...")
        this.edges = e.slice()
        this.corners = c.slice()
        this.defs = JSON.parse(JSON.stringify(d))
        this.solved = s

        this.moves = "R"
        this.moves = this.moves.split("")
        this.primemoves = []
        for (var m in this.moves) {
            this.primemoves.push(this.moves[m]+"'")
        }
        this.moves = this.moves.concat(this.primemoves)

        /*
            d is the move code, f is the number in the for loop

            var buffer
            buffer = d[0]
            var f = 1
            while (f < d.length) {
                d[f-1] = f
                f ++
            }
            d[d.length]-1 = buffer
            
        */
        
        this.rcycle = "0594"
        this.R = function() {
            let buffer = this.edges[0]
            this.edges[0] = this.edges[5]
            this.edges[5] = this.edges[9]
            this.edges[9] = this.edges[4]
            this.edges[4] = buffer
        }

        this.edgesdebug = function() {
            let out = ""
            for (var e in this.edges) {
                out += this.edges[e].i+" "+this.edges[e].o
                if (e < this.edges.length-1) {
                    out += " | "
                }
            }
            return out
        }
        this.cornersdebug = function() {
            let out = ""
            for (var c in this.corners) {
                out += this.corners[c].i+" "+this.corners[c].o
                if (c < this.corners.length-1) {
                    out += " | "
                }
            }
            return out
        }
        this.movesafe = function(m) {
            var safe
            for (var l in this.moves) {
                if (m == this.moves[l]) {
                    safe = true
                }
            }

            if (safe) {
                this[m]()
                outpush(m)

                debugupdate("edges: "+this.edgesdebug(), "corners: "+this.cornersdebug())
            } else {
                outpush("invalid move(s)!", "danger")
            }
        }

        debugupdate("edges: "+this.edgesdebug(), "corners: "+this.cornersdebug())
        outpush("cube loaded!", "success")
    }
}

var tres

function reset() {
    outclear()
    tres = new Cube(edges, corners, solved, movedefs)
}
reset()

var buttons = new Vue({
    el: "#buttons",
    data: {
        moves: [{move: "R"}, {move: "U"}, {move: "F"}, {move: "B"}, {move: "L"}, {move: "D"}, {move: "R'"}, {move: "U'"}, {move: "F'"}, {move: "B'"}, {move: "L'"}, {move: "D'"}]
    },
    methods: {
        move: function(m) {
            tres.move(m)
        }
    }
})