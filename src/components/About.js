import React from 'react'
import { useContext } from 'react'
import NoteContext from '../context/notes/NoteContext'

function About() {
  const a = useContext(NoteContext)
  return (
    <div>{a.mode.Name}'s age is {a.mode.Age}</div>
  )
}

export default About