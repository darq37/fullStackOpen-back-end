require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')
const PORT = process.env.PORT
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()

}

app.use(express.json()) // for parsing request body
app.use(requestLogger) // for parsing request body
app.use(cors())
app.use(express.static('build'))

app.get('/api/notes', ((request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
}))
app.get('/api/notes/:id', ((request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
}))
app.post('/api/notes', ((request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
}))
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


