const express = require('express')
const cors = require('cors')
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
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]

app.use(express.json()) // for parsing request body
app.use(requestLogger) // for parsing request body
app.use(cors())
app.get('/api/notes', ((request, response) => {
    response.json(notes)
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
