const Webinar = require("../models/webinarModel");

 

exports.createWebinar = async (req, res) => {
  try {
    const {
      title,
      description,
      day,
      time,
      australiaTimeZone,
      meetLink,
      recordingLink,
      durationMinutes,
    } = req.body;

    if (!title || !day || !time || !australiaTimeZone || !meetLink) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const webinar = await Webinar.create({
      title,
      description,
      day,
      time,
      australiaTimeZone,
      meetLink,
      recordingLink,
      durationMinutes,
    });

    res.status(201).json(webinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ========================= */
/* GET ALL WEBINARS (LIMIT 3) */
/* ========================= */
exports.getWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find()
      .sort({ createdAt: -1 }) // latest first

    if (!webinars.length) {
      return res.status(404).json({ message: "No webinars found" });
    }

    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ========================= */
/* UPDATE WEBINAR */
/* ========================= */
exports.updateWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(webinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========================= */
/* DELETE WEBINAR */
/* ========================= */
exports.deleteWebinar = async (req, res) => {
  try {
    await Webinar.findByIdAndDelete(req.params.id);
    res.json({ message: "Webinar deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};