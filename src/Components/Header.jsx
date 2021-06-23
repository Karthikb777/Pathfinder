import {useState, useEffect} from 'react'

const Header = ({props}) => {
    const [nodeProps, setNodeProps] = useState({})

    useEffect(()=>{
        setNodeProps(props)
    })

    return(
        <div className="navbar">
            <nav>
                <h3 className="logo">Pathfinder - Shortest Path Algorithms</h3>
            </nav>
        </div>
    )
}

export default Header