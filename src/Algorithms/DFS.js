// Depth first search implementataion
let visitedNodesInOrder = []
let nextNodesStack = []

const dirRow = [-1, 1, 0, 0]
const dirCol = [0, 0, 1, -1]

export function DFS(grid, start, end) {
    start.prev = null
    start.isVisited = true
    visitedNodesInOrder.push(start)
    nextNodesStack.push(start)

    while(nextNodesStack.length !== 0) {
        let node = nextNodesStack.pop()
        visitedNodesInOrder.push(node)
        if (node === end) return visitedNodesInOrder
        DFSutil(grid, node)
    }
}

function DFSutil(grid, start) {
    let {row, col} = start
    for(let i = 0; i < 4; i++) {
        let rr = row + dirRow[i]
        let cc = col + dirCol[i]

        if(rr < 0 || cc < 0) continue

        if(rr >= grid.length || cc >= grid[0].length) continue

        if(grid[rr][cc].isWall) continue
        if(grid[rr][cc].isVisited) continue

        grid[rr][cc].isVisited = true
        nextNodesStack.push(grid[rr][cc])
        grid[rr][cc].prev = start
    }
}


export function retraceShortestPathDFS(end) {
    const shortestPath = []
    let curr = end
    while(curr !== null) {
        // if there is no path between start and end node
        if(curr === undefined) return shortestPath
        shortestPath.unshift(curr)
        curr = curr.prev
    }

    return shortestPath
}

