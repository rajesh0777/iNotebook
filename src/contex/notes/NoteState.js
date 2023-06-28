import { useState } from "react";
import NoteContext from "./noteContex";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);

  // Get   a Note

  const getNotes = async () => {
    //todo Api call

    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
    });

    const json = await response.json();
    // console.log(json);
    setNotes(json);
  };

  // Add  a Note

  const addNote = async (title, description, tag) => {
    //todo Api call

    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });
      const note = await response.json();
    
   setNotes(notes.concat(note));
  };

  // Delete a Note
  // const deleteNote =(id)=>{
  //   console.log("deleting the notes with id"+id)
  const deleteNote = async (id) => {

    //Api call  
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      }
    
    });
    const json = response.json();
    console.log (json)
    // todo Api call
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  };

  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    //api call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
        "auth-token":localStorage.getItem('token')  
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json =await response.json();
    console.log(json)



    let newNotes =JSON.parse(JSON.stringify(notes))


    // logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
      break;

      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;



