const Video = require('../models/video.model');
const fs = require('fs');
const path = require('path');

exports.createVideo = async (req, res) => {
  const { title, description, userId } = req.body;
  const videoUrl = req.file.path; // Récupérer l'URL du fichier uploadé
  
  try {
    const newVideo = new Video({ title, description, videoUrl, userId });
    await newVideo.save();
    res.status(200).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating video' });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const userId = req.query.userId; // Utilisez req.query.userId pour obtenir le userId du paramètre de requête
    const videos = await Video.find({ userId });

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const videoToDelete = await Video.findById(req.params._id);
    
    await Video.findOneAndDelete({ _id: req.params.id, });
    const videoPath = path.join(__dirname, '..', videoToDelete.videoUrl);
    console.log(videoPath);
    fs.unlink(videoPath, (err) => {
      if (err) {
        console.error('Erreur lors de la suppression du fichier vidéo :', err);
        return res.status(500).json({ message: 'Erreur lors de la suppression du fichier vidéo' });
      }
      res.status(200).json({ message: 'Vidéo supprimée avec succès' });
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la vidéo' });
  }
};

exports.saveChapters = async (req, res) => {
  const { postId, chapters } = req.body;

  try {
    // Parcourir les chapitres envoyés dans la requête
    for (const { time, comment } of chapters) {

      // Chercher si un chapitre avec le même temps existe déjà pour ce postId
      const existingChapter = await Video.findOneAndUpdate(
        { _id: postId, 'chapters.time': time },
        { $set: { 'chapters.$.comment': comment } },
        { new: true }
      );

      if (!existingChapter) {
        // Si le chapitre avec le même temps n'existe pas, l'ajouter
        await Video.updateOne(
          { _id: postId },
          { $addToSet: { chapters: { time, comment } } }
        );
      }
    }

    res.status(200).json({ message: 'Chapters saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving chapters', error });
  }
};

exports.getChapters = async (req, res) => {
  const { videoId } = req.params;

  try {
    const chapters = await Video.find({ videoId });
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chapters', error });
  }
};

exports.getVideosByPostAndUser = async (req, res) => {
  const { postId } = req.query;
  try {
    // Rechercher des vidéos par leur _id au lieu de postId
    const post = await Video.find({ _id: postId });

    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
};


exports.markAsProcesed = async (req, res) => {
  try {
    const { postId } = req.body;
    const video = await Video.findByIdAndUpdate(postId, { traite: 'Traité' }, { new: true });

    console.log(postId);
    
    if (!postId) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.status(200).json(postId);
  } catch (error) {
    console.error('Error marking video as processed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

