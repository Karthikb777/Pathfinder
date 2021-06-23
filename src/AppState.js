import React, { useState, createContext } from 'react'

export const AppContext = createContext()

export const Provider = (props) => {
    const [nodeList, setNodeList] = useState([])
    const [start, setStart] = useState([])
    const [end, setEnd] = useState([])

    return(
        <AppContext.Provider value= {{
            NodeList: [nodeList, setNodeList], 
            Start: [start, setStart],
            End: [end, setEnd]
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

