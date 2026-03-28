const Hero = require("../models/Hero");
const cloudinary = require("../config/cloudinary");

/**
 * @desc   Get Hero Section
 * @route  GET /api/hero
 */
exports.getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();

    if (!hero) {
      return res.status(200).json({
        type: "image",
        images: [],
      });
    }

    res.status(200).json(hero);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateHero = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Type required" });
    }

    // ================= IMAGE UPLOAD =================
    if (type === "image") {
      const files = req.files?.images;

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "Images required" });
      }

      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "hero" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);

      const hero = await Hero.findOneAndUpdate(
        {},
        { type: "image", images: uploadedImages, videoUrl: "" },
        { new: true, upsert: true }
      );

      return res.json({ message: "Images uploaded", hero });
    }

    // ================= VIDEO UPLOAD =================
    if (type === "video") {
      const file = req.files?.video?.[0];

      if (!file) {
        return res.status(400).json({ message: "Video required" });
      }

      const videoUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "hero" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });

      const hero = await Hero.findOneAndUpdate(
        {},
        { type: "video", videoUrl, images: [] },
        { new: true, upsert: true }
      );

      return res.json({ message: "Video uploaded", hero });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};