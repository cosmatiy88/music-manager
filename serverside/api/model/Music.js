let mongoose = require('mongoose')

let musicSchema = mongoose.Schema({
  title: {
    type: String,
    lowercase: true,
    required: true
  },
  music: {
    type: Object,
    required: true,
  },
  artist: {
    type: String,
    lowercase: true,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
})

let Music = mongoose.model('Music', musicSchema)
module.exports = Music
