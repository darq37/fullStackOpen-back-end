const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')


const api = supertest(app)
const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
    },
]

beforeEach(async () => {
    await Note.deleteMany({}) //clear the DB

    let noteObject = new Note(initialNotes[0])
    await noteObject.save()

    noteObject = new Note(initialNotes[1])
    await noteObject.save()
})


test('should return notes as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test('should return content', async () => {
    const response = await api.get('/api/notes')

    expect(response.body[0].content).toBe('HTML is easy')
})
test('should return 2 notes', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(2)
})
test('should return all notes', async () => {
    const response = await api.get('api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
})
test('should return specific note', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain(
        'Browser can execute only Javascript'
    )
})



afterAll(() => {
    mongoose.connection.close()
})