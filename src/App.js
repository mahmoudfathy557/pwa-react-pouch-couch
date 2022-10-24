import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { addTodo, showTodos } from './utils/todoFns'

import PouchDB from 'pouchdb'
export var db = new PouchDB('my_notesDB')
var remoteCouch = 'http://admin:root@localhost:5984/notes'

const Users = () => {
  db.changes({
    since: 'now',
    live: true,
  }).on('change', showTodos)

  function sync() {
    console.log('syncing')
    var opts = { live: true }
    db.replicate.to(remoteCouch, opts, syncError)
    db.replicate.from(remoteCouch, opts, syncError)
  }
  // There was some form or error syncing
  function syncError() {
    console.log('eroor syncing')
  }

  console.log('first')
  // state
  const [users, setUsers] = React.useState([])

  const [localDocs, setLocalDocs] = useState([])
  // effects
  React.useEffect(() => {
    console.log('second')
    if (remoteCouch) {
      sync()
    }
    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((users) => {
        setUsers(users.products)
      })
      .catch((err) => {})
  }, [])

  // render

  const addItemToPouchDB = (e, title) => {
    console.log(title)
    addTodo(title)
  }

  const handleGetLocalDocs = (e) => {
    showTodos(setLocalDocs)
  }
  console.log(localDocs, 'local docs')
  return (
    <div>
      <h2>Products</h2>
      <button onClick={handleGetLocalDocs}>get db</button>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={(e) => addItemToPouchDB(e, user.title)}>
            {user.title}
            <br></br>
            price: ({user.price})$
            <hr />
          </li>
        ))}
      </ul>
    </div>
  )
}
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' exact element={<Users />} />
    </Routes>
  </BrowserRouter>
)
export default App
