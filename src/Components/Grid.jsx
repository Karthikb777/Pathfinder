import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../AppState'
import { solveDijkstras, getShortestPath } from '../Algorithms/Dijkstras'
import '../Style.css'
import Header from './Header'


const Grid = () => {
    const NUM_ROWS = 24
    const NUM_COLS = 60

    const {NodeList, Start, End} = useContext(AppContext)
    const [Nodes, setNodes] = NodeList
    const [start, setStart] = Start
    const [end, setEnd] = End

    const [isSetStartActive, setIsSetStartActive] = useState(false) 
    const [isSetEndActive, setIsSetEndActive] = useState(false) 
    const [isMousedown, setIsMouseDown] = useState(false) 

    let tempNodes = []

    useEffect(() => {
        generateGrid()
    }, [])

    const generateGrid = () => {
        for (let i = 0; i < NUM_ROWS; i++) {
            let row = []
            for(let j = 0; j < NUM_COLS; j++) {
                row.push(generateNode(i, j))
            } 
             tempNodes.push(row)
        }
        setNodes(tempNodes)
    }


    const generateNode = (row, col) => {
        return {
            row: row,
            col: col,
            isStartNode: false,
            isEndNode: false,
            isWall: false,
            isVisited: false,
            distance: Infinity
        }
    }

    const handleClick = (e, node) => {
        if(isSetStartActive === true) {
            Nodes.forEach(row => {
                row.forEach(n => {
                    n.isStartNode = false
                    if(n === node) {
                        n.isWall = false
                        n.isStartNode = true
                        setStart(n)
                    }
                })
            });
            console.log(Nodes)
            setIsSetStartActive(!isSetStartActive)
        }
        else if(isSetEndActive === true) {
            Nodes.forEach(row => {
                row.forEach(n => {
                    n.isEndNode = false
                    if(n === node) {
                        n.isWall = false
                        n.isEndNode = true
                        setEnd(n)
                    }
                })
            });
            console.log(Nodes)
            setIsSetEndActive(!isSetEndActive)
        }

        else {
            setNodes(toggleGridWalls(node.row, node.col))
        }
    }

    const handleMouseDown = (e, node) => {
        setIsMouseDown(!isMousedown)
        setNodes(toggleGridWalls(node.row, node.col))
    }

    const handleMouseEnter = (node) => {
        if(!isMousedown) return
        setNodes(toggleGridWalls(node.row, node.col))
    }

    const resetGrid = () => {
        generateGrid()
    }

    const toggleGridWalls = (row, col) => {
        const newGrid = Nodes.slice()
        let toBeWalled = newGrid[row][col]
        toBeWalled.isWall = !toBeWalled.isWall
        return newGrid
    }

    const startEndIcons = (node) => {
        if(node.isStartNode) return <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
        if (node.isEndNode) return <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
    }

    const visualize = () => {
        const solved = solveDijkstras(Nodes, start, end)
        console.log(solved)
        const shortestPath = getShortestPath(end)
        console.log(shortestPath)
        animateDijkstra(solved, shortestPath)

    }

    function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            // here we are animating the shortest path we got
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }
        //   here we are animating the visited nodes
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            console.log(`node`, node)
            node.isProcessing = true
            if(!node.isWall) {
            document.getElementById(`n-${node.row}-${node.col}`).className =
              'node visited';
            }
          }, 10 * i);
        }
      }
    
      function animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            node.isShortestPath = true
            document.getElementById(`n-${node.row}-${node.col}`).className =
              'node path';
          }, 50 * i);
        }
      }


    const setClassNames = (n) => {
        if(n.isProcessing) return `node`
        if(n.isShortestPath) return 'node'
        if(n.isWall) return 'node wall'
        else return 'node'
    }

    const setIds = (n) => {
        return `n-${n.row}-${n.col}`
    }

    return(
        <>
        <Header />
        <div className="btns">
        <button onClick={() => setIsSetStartActive(!isSetStartActive)}>Set start node</button>
        <button onClick={() => setIsSetEndActive(!isSetEndActive)}>Set end node</button>
        <button onClick={() => resetGrid()}>Reset Grid</button>
        <button onClick={() => visualize()}>Visualize</button>
        <div className="things"><div className="node wall"></div> Wall</div>
        <div className="things"><div className="nodeDisplay"></div> Unvisited node</div>
        <div className="things"><div className="node visited"></div> Visited node</div>
        <div className="things"><div className="node path"></div> Shortest path</div>
        <div className="things">
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
            Start node
         </div>
        <div className="things">
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
         End node</div>
        </div>
        <table className="grid">
            <tbody>
               {Nodes.map((row) => {
                   return (
                       <tr>
                           {row.map(n => {
                                return <td className={setClassNames(n)} 
                                id={setIds(n)}
                                onMouseDown={(e) => handleMouseDown(e, n)}
                                onMouseEnter={(e) => handleMouseEnter(n)}
                                onMouseUp={() => setIsMouseDown(false)}
                                onClick={(e) => handleClick(e, n)}>
                                    {startEndIcons(n)}
                                </td>
                               })
                           }
                       </tr>
                   )
               })}
            </tbody>
        </table>
        </>
    )
}

export default Grid