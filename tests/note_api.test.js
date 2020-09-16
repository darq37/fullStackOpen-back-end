const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const Note = require('../models/note')

const api = supertest(app)

beforeEach(async () => {
    await Note.deleteMany({})
    console.log("Database cleared")

    for (const note of helper.initialNotes) {
        let noteObject = new Note(note)
        await noteObject.save()
        console.log('New notes saved')
    }
    console.log('Pre-test initialization done.')
    /*
     await Note.deleteMany({})

     const noteObjects = helper.initialNotes
            .map(note => new Note(note))
     const promiseArray = noteObjects.map(note => note.save())
     await Promise.all(promiseArray)

     <This way, its possible to execute all promises in pararel, instead
     of particular order  as in for..of loop>
  * */


})

test('should return notes as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test('should return all notes', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
})
test('should return specific note', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain(
        'Browser can execute only Javascript'
    )
})
test('should return content', async () => {
    const response = await api.get('/api/notes')

    expect(response.body[0].content).toBe('HTML is easy')
})
test('should add a valid note', async () => {
    const newNote = {
        content: 'testNote',
        important: true,
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
        'testNote'
    )
})
test('should reject invalid note', async () => {
    const newNote = {
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)

})
test('should return a note with specifid id', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
})
test('should delete a note', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
        helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
})



afterAll(() => {
    mongoose.connection.close()
})