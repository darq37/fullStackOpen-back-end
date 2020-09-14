const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const user = process.argv[2]
const password = process.argv[3]
const dbName = 'note-app'


const url =
    `mongodb+srv://${user}:${password}@cluster0.0smgw.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema) /*Mongoose convention
 is to automatically name collections as the plural (e.g. notes)
 when the schema refers to them in the singular (e.g. Note). ==>
 Database name becomes 'note-app.notes' */

/*
const note = new Note({
    content: 'HTML is Easy',
    date: new Date(),
    important: true,
})

note.save().then(() => {
    console.log('note saved!')
    mongoose.connection.close()
})*/
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})

