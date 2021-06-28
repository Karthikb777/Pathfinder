import React, { useState, useEffect, useContext, useRef } from 'react'
import { AppContext } from '../AppState'
import { solveDijkstras, getShortestPath } from '../Algorithms/Dijkstras'
import { BFS, retraceShortestPathBFS } from '../Algorithms/BFS'
import { DFS, retraceShortestPathDFS } from '../Algorithms/DFS'
import '../Style.css'
// import Header from './Help-About'


const Grid = () => {
    let NUM_ROWS = 25
    let NUM_COLS = 60
    const DEFAULT_START_ROW = 5
    const DEFAULT_START_COL = 5
    const DEFAULT_END_ROW = 5
    const DEFAULT_END_COL = 15

    const nodeRefs = useRef([])

    // const {NodeList, Start, End} = useContext(AppContext)
    const [Nodes, setNodes] = useState([])
    const [start, setStart] = useState({})
    const [end, setEnd] = useState({})

    const [isSetStartActive, setIsSetStartActive] = useState(false) 
    const [isSetEndActive, setIsSetEndActive] = useState(false) 
    const [isMousedown, setIsMouseDown] = useState(false)
    const [isKeydown, setIsKeyDown] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [algo, setAlgo] = useState('Dijkstra\'s') 

    useEffect(() => {
        let w = window.innerWidth
        let h = window.innerHeight
        if(w < 500) NUM_COLS = 16
        generateGrid()
    }, [])

    useEffect(() => {

    }, [Nodes])

    const generateGrid = () => {
        let tempNodes = []
        for (let i = 0; i < NUM_ROWS; i++) {
            let row = []
            let refRow= []
            for(let j = 0; j < NUM_COLS; j++) {
                refRow[j] = null
                let n = generateNode(i, j)
                if(n.isStartNode) setStart(n)
                if(n.isEndNode) setEnd(n)
                row.push(n)
            } 
            nodeRefs.current[i] = refRow
            tempNodes.push(row)
        }
        setNodes(tempNodes)
    }

    const generateNode = (row, col) => {
        return {
            row: row,
            col: col,
            isStartNode: row === DEFAULT_START_ROW && col === DEFAULT_START_COL,
            isEndNode: row === DEFAULT_END_ROW && col === DEFAULT_END_COL,
            isWall: false,
            isVisited: false,
            hasMoreWeight: false,
            weight: 1,
            distance: Infinity
        }
    }

    const handleClick = (e, node) => {
        // if(isSetStartActive === true) {
        //     Nodes.forEach(row => {
        //         row.forEach(n => {
        //             if(n === node) {
        //                 n.isWall = false
        //                 n.isStartNode = true
        //                 setStart(n)
        //             } else n.isStartNode = false
        //         })
        //     });
        //     console.log(Nodes)
        //     setIsSetStartActive(!isSetStartActive)
        // }
        // else if(isSetEndActive === true) {
        //     Nodes.forEach(row => {
        //         row.forEach(n => {
        //             if(n === node) {
        //                 n.isWall = false
        //                 n.isEndNode = true
        //                 setEnd(n)
        //             } else n.isEndNode = false 
        //         })
        //     });
        //     console.log(Nodes)
        //     setIsSetEndActive(!isSetEndActive)
        // }

        // else {
            setNodes(toggleGridWalls(node.row, node.col))
        // }
    }

    const handleMouseDown = (e, node) => {
        setIsMouseDown(!isMousedown)
        if(node.isStartNode) setIsSetStartActive(true)
        if(node.isEndNode) setIsSetEndActive(true)
        else {
            setNodes(toggleGridWalls(node.row, node.col))
        }
    }

    const handleMouseEnter = (node) => {
        if(!isMousedown) return
        if(isSetEndActive) toggleStartEndNode(node, 1)
        if(isSetStartActive) toggleStartEndNode(node, 0)
        else setNodes(toggleGridWalls(node.row, node.col))
    }

    const handleMouseUp = (e, node) => {
        setIsMouseDown(false)
        setIsSetStartActive(false)
        setIsSetEndActive(false)
    }
 
    const handleKeyDown = (event) => {
        if(algo === 'Dijkstra\'s') {
            if(event.shiftKey) setIsKeyDown(true)
        }
    }

    const resetGrid = () => {
        // let newGrid = Nodes.slice()
        window.location.reload()
        // for(let i = 0; i < NUM_ROWS; i++) {
        //     for(let j = 0; j< NUM_COLS; j++) {
        //     newGrid[i][j].isStartNode = i === DEFAULT_START_ROW && j === DEFAULT_START_COL
        //     newGrid[i][j].isEndNode = i === DEFAULT_END_ROW && j === DEFAULT_END_COL
        //     newGrid[i][j].isWall = false
        //     newGrid[i][j].isVisited = false
        //     newGrid[i][j].hasMoreWeight = false
        //     newGrid[i][j].weight = 1
        //     newGrid[i][j].distance = Infinity
        //     newGrid[i][j].prev = null
        //     nodeRefs.current[i][j].className = 'node'
        //     if(newGrid[i][j].isStartNode) setStart(newGrid[i][j])
        //     if(newGrid[i][j].isEndNode) setEnd(newGrid[i][j])
        //     }
        // }
        // setNodes(newGrid)
        
    }

    const toggleStartEndNode = (node, choice) => {
        let newGrid = Nodes.slice()
        switch(choice) {
           case 0: {
                for(let i = 0; i < NUM_ROWS; i++) {
                    for(let j = 0; j < NUM_COLS; j++) {
                        if(newGrid[i][j] === node) {
                            newGrid[i][j].isWall = false
                            newGrid[i][j].isStartNode = true
                            setStart(newGrid[i][j])
                        }
                        else newGrid[i][j].isStartNode = false
                    }
                }
                break
            }
            case 1: {
                for(let i = 0; i < NUM_ROWS; i++) {
                    for(let j = 0; j < NUM_COLS; j++) {
                        if(newGrid[i][j] === node) {
                            newGrid[i][j].isWall = false
                            newGrid[i][j].isEndNode = true
                            setEnd(newGrid[i][j])
                        }
                        else newGrid[i][j].isEndNode = false
                    }
                }
                break
            }
        default: break
        }

        setNodes(newGrid)
    }

    const resetWalls = () => {
        const newGrid = Nodes.slice()
        for(let i = 0; i < NUM_ROWS; i++) {
            for( let j = 0; j < NUM_COLS; j++) {
                newGrid[i][j].isWall = false
                newGrid[i][j].hasMoreWeight = false
                newGrid[i][j].weight = 1
                
            }
        }
        setNodes(newGrid)
    }

    const toggleGridWalls = (row, col) => {
        const newGrid = Nodes.slice()
        let toBeWalled = newGrid[row][col]
        if(!toBeWalled.isStartNode && !toBeWalled.isEndNode){
            if(isKeydown) {
            if(toBeWalled.hasMoreWeight) {
                toBeWalled.hasMoreWeight = false
                toBeWalled.weight = 1
            }
            else {
            toBeWalled.hasMoreWeight = true
            toBeWalled.weight = 5
            }
        }
        else toBeWalled.isWall = !toBeWalled.isWall
    }
    return newGrid
    }

    const nodeIcons = (node) => {
        if(node.isStartNode) return (
        <svg className="icon" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.25 5.25C6.5925 5.25 5.25 6.5925 5.25 8.25C5.25 9.9075 6.5925 11.25 8.25 11.25C9.9075 11.25 11.25 9.9075 11.25 8.25C11.25 6.5925 9.9075 5.25 8.25 5.25ZM14.955 7.5C14.61 4.3725 12.1275 1.89 9 1.545V0H7.5V1.545C4.3725 1.89 1.89 4.3725 1.545 7.5H0V9H1.545C1.89 12.1275 4.3725 14.61 7.5 14.955V16.5H9V14.955C12.1275 14.61 14.61 12.1275 14.955 9H16.5V7.5H14.955V7.5ZM8.25 13.5C5.3475 13.5 3 11.1525 3 8.25C3 5.3475 5.3475 3 8.25 3C11.1525 3 13.5 5.3475 13.5 8.25C13.5 11.1525 11.1525 13.5 8.25 13.5Z" fill="black"/>
        </svg>
        )
    
        if (node.isEndNode) return (
            <svg className="icon" width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.25 0C2.3475 0 0 2.3475 0 5.25C0 9.1875 5.25 15 5.25 15C5.25 15 10.5 9.1875 10.5 5.25C10.5 2.3475 8.1525 0 5.25 0ZM5.25 7.125C4.215 7.125 3.375 6.285 3.375 5.25C3.375 4.215 4.215 3.375 5.25 3.375C6.285 3.375 7.125 4.215 7.125 5.25C7.125 6.285 6.285 7.125 5.25 7.125Z" fill="black"/>
            </svg>
        )
        if (node.hasMoreWeight) return <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="13px" viewBox="0 0 24 24" width="13px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z"/></svg>
    }

    const visualize = () => {
        let solved, shortestPath
        solved = null
        shortestPath = null
        switch (algo) {
            case 'Dijkstra\'s':
                solved = solveDijkstras(Nodes, start, end)
                shortestPath = getShortestPath(end)
                break;
            case 'BFS':
                solved = BFS(Nodes, start, end)
                shortestPath = retraceShortestPathBFS(end)
                break;
            case 'DFS':
                solved = DFS(Nodes, start, end)
                shortestPath = retraceShortestPathDFS(end)
                break;
        
            default:
                break;
        }
        animate(solved, shortestPath)
    }

    function animate(visitedNodes, nodesInShortestPath) {
        for (let i = 0; i <= visitedNodes.length; i++) {
            // here we are animating the shortest path we got
          if (i === visitedNodes.length) {
            setTimeout(() => {
              animateShortestPath(nodesInShortestPath);
            }, 10 * i);
            return;
          }
        //   here we are animating the visited nodes
          setTimeout(() => {
            const node = visitedNodes[i];
            console.log(`node`, node)
            if(!node.isWall) {
                nodeRefs.current[node.row][node.col].classList.add('node-visited')
            }
          }, 10 * i);
        }
      }
    
      function animateShortestPath(nodesInShortestPath) {
        for (let i = 0; i < nodesInShortestPath.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPath[i];
            nodeRefs.current[node.row][node.col].classList.add('node-shortest-path')
          }, 50 * i);
        }
      }

    const algoInfo = () => {
        switch (algo) {
            case 'Dijkstra\'s':
                return <p>Dijkstra's algorithm is <b>weighted</b> and guarantees a shortest path!<br/><p className="hint">Hint: Hold shift key while drawing walls to add weights.</p></p>
            case 'BFS':
                return <p>Breadth First Search algorithm is <b>unweighted</b> and guarantees a shortest path!</p>
            case 'DFS':
                return <p>Depth First Search algorithm is <b>unweighted</b> and does not guarantee a shortest path!</p>
            default:
                return ''
        }
    }

    const menuClass = () => {
        if(menuOpen) return 'selectAlgo'
        return 'selectAlgoHidden'
    }

    const setAlgorithm = (algo) => {
        setAlgo(algo)
        setMenuOpen(!menuOpen)
    } 


    const setClassNames = (n) => {
        if(n.isWall) return 'node wall'
        // if(n.isStartNode) return 'node start'
        // if(n.isEndNode) return 'node end'
        else return 'node'
    }

    return(
        <>
        <h3 className="logo">Pathfinder</h3>
        <div className="btns">
        <button onClick={() => setMenuOpen(!menuOpen)}>Select Algorithm</button>
        <button className='visualizeBtn' onClick={() => visualize()}>Visualize {algo}</button>
        <button onClick={() => resetWalls()}>Reset walls {'&'} weights</button>
        <button onClick={() => resetGrid()}>Reset Grid</button>
        <a target="_blank" rel="noreferrer" href="https://github.com/Karthikb777/Pathfinder">Source Code</a>
        </div>
        <div className="algoInfo">{algoInfo()}</div>
        <div className={menuClass()}>
            <ul>
                <li onClick={() => setAlgorithm('Dijkstra\'s')}>Dijkstra's</li>
                <li onClick={() => setAlgorithm('BFS')}>Breadth first search</li>
                <li onClick={() => setAlgorithm('DFS')}>Depth first search</li>
            </ul>
        </div>
        <div>
            <li className="info">
                <ul>
                    <li className="infoField">
                        <ul className="infoIcon infoSvg">
                            <svg className="icon" width="15" height="15" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.25 5.25C6.5925 5.25 5.25 6.5925 5.25 8.25C5.25 9.9075 6.5925 11.25 8.25 11.25C9.9075 11.25 11.25 9.9075 11.25 8.25C11.25 6.5925 9.9075 5.25 8.25 5.25ZM14.955 7.5C14.61 4.3725 12.1275 1.89 9 1.545V0H7.5V1.545C4.3725 1.89 1.89 4.3725 1.545 7.5H0V9H1.545C1.89 12.1275 4.3725 14.61 7.5 14.955V16.5H9V14.955C12.1275 14.61 14.61 12.1275 14.955 9H16.5V7.5H14.955V7.5ZM8.25 13.5C5.3475 13.5 3 11.1525 3 8.25C3 5.3475 5.3475 3 8.25 3C11.1525 3 13.5 5.3475 13.5 8.25C13.5 11.1525 11.1525 13.5 8.25 13.5Z" fill="black"/>
                            </svg>
                        </ul>
                        <ul className="infoText">Start node</ul>
                    </li>
                </ul>
                <ul>
                    <li className="infoField">
                        <ul className="infoIcon infoSvg">
                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.25 0C2.3475 0 0 2.3475 0 5.25C0 9.1875 5.25 15 5.25 15C5.25 15 10.5 9.1875 10.5 5.25C10.5 2.3475 8.1525 0 5.25 0ZM5.25 7.125C4.215 7.125 3.375 6.285 3.375 5.25C3.375 4.215 4.215 3.375 5.25 3.375C6.285 3.375 7.125 4.215 7.125 5.25C7.125 6.285 6.285 7.125 5.25 7.125Z" fill="black"/>
                            </svg>
                        </ul>
                        <ul className="infoText">End node</ul>
                    </li>
                </ul>
                <ul>
                    <li className="infoField">
                        <ul className="infoIcon infoWall"></ul>
                        <ul className="infoText">Walls</ul>
                    </li>
                </ul>
                {algo === 'Dijkstra\'s'?
                <ul>
                    <li className="infoField">
                        <ul className="infoIcon infoSvg">
                        <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 24 24" width="15px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z"/></svg>
                        </ul>
                        <ul className="infoText">Weights</ul>
                    </li>
                </ul> :'' }
                <ul>
                    <li className="infoField">
                        <ul className="infoIcon infoVisited"></ul>
                        <ul className="infoText">Visited nodes</ul>
                    </li>
                </ul>
                <ul>
                    <li className="infoField">
                        <ul className="infoIcon infoPath"></ul>
                        <ul className="infoText">Path nodes</ul>
                    </li>
                </ul>
            </li>
        </div>
        <table className="grid"
        tabIndex='1'
        onKeyDown={(e) => handleKeyDown(e)}
        onKeyUp={()=> setIsKeyDown(false)}
        >
            <tbody>
               {Nodes.map((row) => {
                   return (
                       <tr>
                           {row.map(n => {
                                return <td className={setClassNames(n)} 
                                ref={(el) => nodeRefs.current[n.row][n.col] = el}
                                onMouseDown={(e) => handleMouseDown(e, n)}
                                onMouseEnter={(e) => handleMouseEnter(n)}
                                onMouseUp={(e) => handleMouseUp(e, n)}
                                onClick={(e) => handleClick(e, n)}>
                                    {nodeIcons(n)}
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