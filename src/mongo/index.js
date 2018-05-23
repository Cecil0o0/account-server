const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('opened')
})
db.on('connected', () => {
  console.log('connected')
})
db.on('disconnected', () => {
  console.log('disconnect')
  process.exit(1)
})

let kittySchema = mongoose.Schema({
  name: String
})

let Kitten = mongoose.model('Kitten', kittySchema)

let silence = new Kitten({ name: 'Silence' });
console.log(silence.name)

// Kitten.create({
//   name: 'test'
// }).then(res => {
//   console.log(res)
// })

Kitten.find().then(res => {
  console.log(res)
})