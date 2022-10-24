import PouchDB from 'pouchdb'

var db = new PouchDB('my_notesDB')

export function addTodo(text) {
  var todo = {
    // _id: new Date().toISOString(),
    title: text,
    completed: false,
  }
  db.post(todo, function callback(err, result) {
    if (!err) {
      console.log('Successfully posted a todo!')
    }
    console.log(result, 'result from add todo fn')
  })
}

export function updateTodo(id, text) {
  var todo = {
    _id: id,
    title: text,
    completed: false,
  }
  db.put(todo, function callback(err, result) {
    if (!err) {
      console.log('Successfully updated a todo!')
    }
  })
}

export function showTodos(setLocalDocs) {
  db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
    setLocalDocs(doc.rows)
  })
}
