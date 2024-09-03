const Video = require('../models/video.model');
const { io } = require('../socket');

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

    await Video.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    res.status(200).json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video' });
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

let notifiedUsers = []; 

exports.sendNotification = async (req, res) => {
  const { userId } = req.body;

  // Ajouter l'utilisateur à la liste des utilisateurs notifiés si ce n'est pas déjà fait
  if (!notifiedUsers.includes(userId)) {
    notifiedUsers.push(userId);
  }
  // Send the notification to all connected clients
  io.emit('notification', { userId });
    
  res.status(200).send({ success: true, message: 'Notification sent!' });
};

exports.getNotificatedUsers = async (req, res) => {
  res.status(200).json({ users: notifiedUsers });
};

exports.markAsProcesed = async (req, res) => {
  try {
    const { videoId } = req.body;
    const video = await Video.findByIdAndUpdate(videoId, { traite: 'Traité' }, { new: true });
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.status(200).json(video);
  } catch (error) {
    console.error('Error marking video as processed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

