import React from "react";
import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) =>{
    const notesInitial=[
        {
            "id":"61322f1765gf67rv",
            "user":"7789797n9on87",
            "title":"My title",
            "description":"Wake up early",
            "tag":"personal",
            "date":"2021-09-03T14:20:09.668Z"
        }
    ]
    const [notes, setNotes] = useState(notesInitial)
    return (
    <NoteContext.Provider value={{notes, setNotes}}>
        {props.children}
    </NoteContext.Provider>
    )
}

export default NoteState;