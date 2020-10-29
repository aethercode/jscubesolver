var moveDefs = [
    {
        name: 'R',
        changes: [
            {
                target: 'edges',
                permutation: [1, 2, 3, 4]
            }, {
                target: 'corners',
                permutation: [1, 2, 3, 4],
                orientation: [1, 2, 3, 4]
                /*
                    Do something like, if orientation.targets,
                    follow targets/changes format,
                    else, do permuted
                */
            }
        ]
    }, {
        name: 'U',
        changes: [
            {
                target: 'edges',
                permutation: [1, 2, 3, 4]
            }, {
                target: 'corners',
                permutation: [1, 2, 3, 4]
            }
        ]
    }
]

var moveNames = [];
var primeMoveNames = [];

for (let definition in moveDefs) {
    let newMove = JSON.parse(JSON.stringify(moveDefs[definition]))
    moveNames.push(newMove.name)
    newMove.name = newMove.name+`'`
    primeMoveNames.push(newMove.name)

    for (let changes of newMove.changes) {
        if (changes.permutation) {
            changes.permutation.reverse()
        }
        if (changes.orientation) {
            if (changes.orientation.targets) {
                for (let orientation in changes.orientation.changes) {
                    changes.orientation.changes[orientation] = -changes.orientation.changes[orientation]
                }
            } else {
                for (let orientation in changes.orientation) {
                    changes.orientation[orientation] = -changes.orientation[orientation]
                }
            }
        }
    }



    moveDefs.push(newMove)
}

var allMoveNames = moveNames.concat(primeMoveNames)