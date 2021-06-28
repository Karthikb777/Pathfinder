let path = []

export function solveDijkstras(grid, start, end) {
    // needs a priority queue, use a sorted array to imitate a priority queue
    const nodes = []
    for (const row of grid) {
      for (const node of row) {
          node.distance = Infinity
            nodes.push(node)
      }
    }

    start.distance = 0
    start.prev = null


    while(!!nodes.length) {
        sortByDistance(nodes)
        const n = nodes.shift()
        console.log(n)
        // if the node is a wall, we continue to the next iteration
        if(n.isWall) continue
        // if there is no path between start and end node
        if(n.distance === Infinity) return path
        n.isVisited = true
        path.push(n)

        // if we found the end node, we return
        if(n === end) return path
        updateUnvisitedNeighbors(n, grid)
    }
}

// we update the distance of every visited neighbors and set the previous nde of the visited neighbors
function updateUnvisitedNeighbors(n, grid) {
    const neighbors = addUnvisitedNeighbors(n, grid)
    for (const neighbor of neighbors) {
        neighbor.distance = n.distance + neighbor.weight
        neighbor.prev = n
    }
}

// imitating a priority queue, this method returns the lowest distance node
function sortByDistance(queue) {
    return queue.sort((a , b) => (a.distance - b.distance))
}

// we add the unvisited neighbors within the following constraints
function addUnvisitedNeighbors(node, grid) {
    const neighbors = []
    let {row, col} = node

    if(row > 0) neighbors.push(grid[row - 1][col])
    if(col > 0) neighbors.push(grid[row][col - 1])
    if(row < grid.length - 1) neighbors.push(grid[row + 1][col])
    if(col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
//  return only the nodes that are unvisited
    return neighbors.filter(neighbor => !neighbor.isVisited)
}

// while curr is not null, we add curr to the start of the shortest path and set curr as the node it came from
export function getShortestPath(end) {
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