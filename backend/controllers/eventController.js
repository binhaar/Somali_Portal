const Event = require("../models/Event");

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const {
      title_en,
      title_so,
      description_en,
      description_so,
      location_en,
      location_so,
      image,
      startDate,
      endDate,
      organizer,
      external_url
    } = req.body;

    if (!title_en || !title_so || !startDate) {
      return res.status(400).json({
        message: "English title, Somali title and start date are required"
      });
    }

    const event = await Event.create({
      title_en,
      title_so,
      description_en,
      description_so,
      location_en,
      location_so,
      image,
      startDate,
      endDate,
      organizer,
      external_url
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error.message);

    res.status(500).json({
      message: "Server error while creating event",
      error: error.message
    });
  }
};


// GET PUBLIC EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      is_active: true
    }).sort({
      startDate: 1
    });

    res.status(200).json({
      count: events.length,
      events
    });
  } catch (error) {
    console.error("GET EVENTS ERROR:", error.message);

    res.status(500).json({
      message: "Server error while fetching events",
      error: error.message
    });
  }
};


// GET SINGLE EVENT
const getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      is_active: true
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json({
      event
    });
  } catch (error) {
    console.error("GET SINGLE EVENT ERROR:", error.message);

    res.status(500).json({
      message: "Server error while fetching event",
      error: error.message
    });
  }
};


// GET ALL EVENTS FOR ADMIN
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({
      startDate: 1
    });

    res.status(200).json({
      count: events.length,
      events
    });
  } catch (error) {
    console.error("GET ALL EVENTS ERROR:", error.message);

    res.status(500).json({
      message: "Server error while fetching all events",
      error: error.message
    });
  }
};


// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error.message);

    res.status(500).json({
      message: "Server error while updating event",
      error: error.message
    });
  }
};


// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error.message);

    res.status(500).json({
      message: "Server error while deleting event",
      error: error.message
    });
  }
};


// TOGGLE EVENT STATUS
const toggleEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    event.is_active = !event.is_active;

    await event.save();

    res.status(200).json({
      message: "Event status updated successfully",
      event
    });
  } catch (error) {
    console.error("TOGGLE EVENT ERROR:", error.message);

    res.status(500).json({
      message: "Server error while changing event status",
      error: error.message
    });
  }
};


module.exports = {
  createEvent,
  getEvents,
  getSingleEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  toggleEventStatus
};