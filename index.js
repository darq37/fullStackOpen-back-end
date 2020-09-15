require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

app.use(express.static('build'))
app.use(express.json()) // for parsing request body
app.use(cors())

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
app.post('/api/notes', ((request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        response.json(savedNote.toJSON())
        console.log('Note saved successfully')
    }).catch((error) => {
        next(error)
    })
}))
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
            console.log(`Note with id: '${request.params.id}' deleted from the server`)
        }).catch(error => next(error))
})
app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important || false,
    }

    Note.findByIdAndUpdate(request.params.id, note, {new: true})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'Wrong id format!!!'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


