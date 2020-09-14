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
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError'){
        return response.status(500).send({error: 'Wrong id format!!!'})
    }
    next(error)
}

app.use(express.static('build'))
app.use(express.json()) // for parsing request body
app.use(cors())
app.use(requestLogger) // for parsing request body
app.use(errorHandler)

app.get('/api/notes', ((request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
}))
app.get('/api/notes/:id', ((request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).send({error: `Sorry, a note with id: ${request.params.id} not found.`})
        }
    }).catch((error) => {
        next(error)
    })
}))
app.post('/api/notes', ((request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({error: 'content missing'})
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
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important || false,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


