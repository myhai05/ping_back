const Video = require('../models/video.model');

exports.createVideo = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.body.userId;
  const videoUrl = req.file.path; // Récupérer l'URL du fichier uploadé
  console.log(req.body);
  try {
    const newVideo = new Video({ title, description, videoUrl, userId });
    await newVideo.save();
    res.status(201).json(newVideo);
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

exports.updateVideo = async (req, res) => {
  const { title, description, videoUrl } = req.body;
  try {
    const updatedVideo = await Video.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, description, videoUrl },
      { new: true }
    );
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating video' });
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
  console.log(req.body);

  try {
    // Parcourir les chapitres envoyés dans la requête
    for (let i = 0; i < chapters.length; i++) {
      const { time, comment } = chapters[i];

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
    const allVideos = await Video.find();


    // Rechercher des vidéos par leur _id au lieu de postId
    const post = await Video.find({ _id: postId });

    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};


