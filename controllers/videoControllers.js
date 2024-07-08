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
    const { userId, chapters } = req.body;
  
    try {
      // Sauvegarder les chapitres dans la base de données
      // Vous pouvez les associer à un utilisateur ou à une vidéo spécifique
      // selon votre modèle de données
  
      // Exemple : Mettre à jour une vidéo existante avec les chapitres
      await Video.updateOne({ userId }, { $set: { chapters } });
  
      res.status(200).json({ message: 'Chapters saved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving chapters', error });
    }
  };

  exports.getChapters = async (req, res) => {
    const { videoId } = req.params;
    try {
      const chapters = await Video.find({ videoId }); 
      console.log(chapters);
      res.status(200).json(chapters);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching chapters', error });
    }
  };

  exports.getVideosByPostAndUser = async (req, res) => {
    const { postId } = req.query;

    console.log("Received postId:", postId);
    try {
        const allVideos = await Video.find();
        console.log("All videos in database:", allVideos);
        
        // Rechercher des vidéos par leur _id au lieu de postId
        const post = await Video.find({ _id: postId });
        console.log("Fetched posts:", post);
        
        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};


  