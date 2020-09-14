const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
const app = express()
const generateId = () => {

    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;//spreading the array into individual numbers
    return maxId + 1;
}
const PORT = process.env.PORT || 3002;
const url = `mongodb+srv://user:user@cluster0.0smgw.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

let noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const Note = mongoose.model('Note', noteSchema)
let notes = []

app.use(express.json()) // for parsing request body
app.use(requestLogger) // for parsing request body
app.use(cors())
app.use(express.static('build'))

app.get('/api/notes', ((request, response) => {
    Note.find({}).then(notes => response.json(notes))
}))
app.get('/api/notes/:id', ((request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
}))
app.delete('/api/notes/:id', ((request, response) => {
    const id = Number(request.params.id)

    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
}))
app.post('/api/notes', ((req, res) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        id: generateId(),
        content: body.content,
        date: new Date(),
        important: body.important || false
    }

    notes = notes.concat(note)
    res.json(note)
}))

app.put('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)

    const note = notes.find(n => n.id === id)
    note.important = note.important !== true;


    res.status(205).json({
        message: "Note's importance changed"
    })
})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


