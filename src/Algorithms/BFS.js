// Breadth first search algorithm implementation
let prev = []
let queue = []

const dirRow = [-1, 1, 0, 0]
const dirCol = [0, 0, 1, -1]

export function BFS(grid, start, end) {
 
    start.prev = null
    queue.push(start)

    while(!!queue.length) {
        let node = queue.shift()
        node.isVisited = true
        if(node.isWall) continue
        if(node === end) return prev
        prev.push(node)
        exploreNeighbors(node, grid)
        // console.log(neighbors)
    }

    return prev
}

function exploreNeighbors(node, grid) {
    const {row, col} = node
    for(let i = 0; i < 4; i++) {
        let rr = row + dirRow[i]
        let cc = col + dirCol[i]

        if(rr < 0 || cc < 0) continue

        if(rr >= grid.length || cc >= grid[0].length) continue

        if(grid[rr][cc].isWall) continue
        if(grid[rr][cc].isVisited) continue

        grid[rr][cc].isVisited = true
        grid[rr][cc].prev = node
        queue.push(grid[rr][cc])
    }
}

export function retraceShortestPathBFS(end) {
    console.log(`retracing...`, end)
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