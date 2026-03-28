const DiscoverVideo = require("../models/discoverVideo");
const cloudinary = require("../config/cloudinary");

// GET
exports.getVideo = async (req, res) => {
  try {
    const video = await DiscoverVideo.findOne();
    res.json(video || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE / CREATE
exports.updateVideo = async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ message: "Video URL required" });
    }

    let uploadedThumbnail = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "discover-video", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      uploadedThumbnail = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    let video = await DiscoverVideo.findOne();

    if (!video) {
      video = await DiscoverVideo.create({
        thumbnail: uploadedThumbnail,
        videoUrl,
      });
    } else {
      // delete old thumbnail
      if (uploadedThumbnail && video.thumbnail?.public_id) {
        await cloudinary.uploader.destroy(video.thumbnail.public_id);
      }

      video.videoUrl = videoUrl;

      if (uploadedThumbnail) {
        video.thumbnail = uploadedThumbnail;
      }

      await video.save();
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};