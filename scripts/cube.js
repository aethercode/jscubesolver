class pieceSet {
    constructor(name, amount, orientations) {
        this.class = name
        if (orientations) {
            this.orientations = orientations
        }

        this.list = []
        for (let piece = 0; piece < amount; piece ++) {
            let currentPiece = {i: piece}
            if (orientations) {
                currentPiece.o = 0
            }
            this.list.push(currentPiece)
        }
    }
}

class Cube {
    moves = {}
    pieces = {}

    constructor(p, d) {
        for (let piece of p) {
            this.pieces[piece.class] = JSON.parse(JSON.stringify(piece))
        }

        for (var move of d) {
            this.moves[move.name] = JSON.parse(JSON.stringify(move))
        }

        this.updatePerms = function(p, d) {
            let updatedPerms = JSON.parse(JSON.stringify(p))

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
            let updatedOrs = JSON.parse(JSON.stringify(o))
            for (var c in d.a) {
                updatedOrs[d.a[c]].o = (updatedOrs[d.a[c]].o + d.o[c]) % t
            }

            return updatedOrs
        }

        this.move = function(c) {
            for (move of this.moves[c].changes) {
                //this.pieces[move.target]
                if (move.permutation) {
                    this.pieces[move.target].list = this.updatePerms(this.pieces[move.target].list, move.permutation)
                }
                if (move.orientation) {
                    if (move.orientation.targets) {

                    } else {
                        this.pieces[move.target].list = this.updateOrs(this.pieces[move.target].list, move.orientation, this.pieces[move.target].orientations)
                    }
                }
            }
        }
    }
}