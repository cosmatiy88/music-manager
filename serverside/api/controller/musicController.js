const mongoose = require('mongoose')
const Music = require('../model/Music')

exports.getAllMusics = async (req, res) => {
  try {
    const music = await Music.find()
    res.status(200).json({
      message: 'All music loaded successfully',
      payload: music
    })
  } catch (error) {
    res.status(500).json({ message: 'An error occured', error})
  }
}

exports.addNewMusic = async (req, res) => {
  try {
    const music = new Music({
      title: req.body.title,
      artist: req.body.artist,
      music: req.file
    })
    //check for music with same title & artist
    const foundTitle = await Music.find({ title: req.body.title })
    const foundArtist = await Music.find({ artist: req.body.artist })
    if (foundTitle.length >= 1 && foundArtist.length >= 1) {
      res.status(400).json({ message: 'File already exist'})
    } else {
      const newMusic = await music.save()
      res.status(200).json({
        message: 'Music was uploaded successfully',
        payload: newMusic
      })
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occured', error})
  }
}

exports.deleteMusic = async (req, res) => {
  try {
    const id = req.params.musicId
    //check for file with ID
    const foundId = await Music.find({ _id: id })
    if (foundId.length >=1 ) {
      const result = await Music.remove({ _id: id })
      res.status(200).json({
        message: 'Music was deleted successfully',
        payload: result
      })
    } else {
      res.status(404).json({ message: 'No file with such ID', payload: { id } })
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occured', error})
  }
}
