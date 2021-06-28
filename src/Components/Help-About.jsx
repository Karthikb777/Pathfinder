import {useState, useEffect} from 'react'

const HelpAbout = ({props}) => {
    const [nodeProps, setNodeProps] = useState({})

    useEffect(()=>{
        setNodeProps(props)
    })

    return(
        <div className="helpAbout">
            <h2 className="logoAbout">PathFinder</h2>
            <p>This is a pathfinding visualizer built to visualize different graph theory algorithms.<br/>Currently, the algorithms available are, Dijkstra's, BFS and DFS.</p>
            <div className="steps">
                <h4>Steps</h4>
                <li>
                    <ul>Select an algorithm.</ul>
                    <ul>Set the start node by dragging it to the desired place.</ul>
                    <ul>Set the end node by dragging it to the desired place.</ul>
                    <ul>Draw walls. (and add weights, in case of Dijkstra's algorithm.)</ul>
                    <ul>Visualize!</ul>
                </li>
            </div>
            <h4>Explanation of different algorithms</h4>
            <h5>Dijkstra's Algorithm</h5>
            <h5>Breadth first search Algorithm</h5>
            <h5>Depth first search Algorithm</h5>
        </div>
    )
}

export default HelpAbout