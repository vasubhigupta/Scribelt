import React from "react";
import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) =>{
    const state={
        "Name" : "Arijit",
        "Age" : "45"
    }
    const [mode, setMode] = useState(state);
    const update = () =>{
        setTimeout(() =>{
            setMode({
                "Name" : "KFC",
                "Age" : "89"
            })
        }, 1000)
    }
    return (
    <NoteContext.Provider value={{mode, update}}>
        {props.children}
    </NoteContext.Provider>
    )
}

export default NoteState;