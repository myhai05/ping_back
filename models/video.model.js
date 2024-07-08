const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  chapters: [ChapterSchema], // Ajout des chapitres
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Video', VideoSchema);