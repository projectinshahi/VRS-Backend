const SecuredProperty = require("../models/SecuredProperty");
const cloudinary = require("../config/cloudinary");

exports.createProperty = async (req, res) => {
  try {
    const { title, description, securedPrice, marketPrice, currentPrice } =
      req.body;

    if (!req.files?.coverImage || !req.files?.galleryImages) {
      return res
        .status(400)
        .json({ message: "Cover image and gallery images required" });
    }

    // Upload cover image
    const coverUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "secured-properties/cover" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        },
      );
      stream.end(req.files.coverImage[0].buffer);
    });

    // Upload gallery images
    const galleryUploadPromises = req.files.galleryImages.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "secured-properties/gallery" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            },
          );
          stream.end(file.buffer);
        }),
    );

    const galleryImages = await Promise.all(galleryUploadPromises);

    const property = await SecuredProperty.create({
      title,
      description,
      coverImage: coverUpload,
      galleryImages,
      securedPrice,
      marketPrice,
      currentPrice,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await SecuredProperty.find().sort({
      createdAt: -1,
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateProperty = async (req, res) => {
  try {
    const { title, description, securedPrice, marketPrice, currentPrice } =
      req.body;

    let updateData = {
      title,
      description,
      securedPrice,
      marketPrice,
      currentPrice,
    };

    // If new cover image uploaded
    if (req.files?.coverImage) {
      const coverUpload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "secured-properties/cover" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          },
        );
        stream.end(req.files.coverImage[0].buffer);
      });

      updateData.coverImage = coverUpload;
    }

    // If new gallery images uploaded
    if (req.files?.galleryImages) {
      const galleryUploadPromises = req.files.galleryImages.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "secured-properties/gallery" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              },
            );
            stream.end(file.buffer);
          }),
      );

      updateData.galleryImages = await Promise.all(galleryUploadPromises);
    }

    const property = await SecuredProperty.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await SecuredProperty.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


