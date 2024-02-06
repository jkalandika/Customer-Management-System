const Reservation = require("../models/Reservation.model");

// Create a new reservation
const createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    const savedReservation = await reservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single reservation by ID
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a reservation by ID
const updateReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    reservation.name = req.body.name || reservation.name;
    reservation.date = req.body.date || reservation.date;
    reservation.eventType = req.body.eventType || reservation.eventType;
    reservation.noOfParticipants =
      req.body.noOfParticipants || reservation.noOfParticipants;
    reservation.noOfTables = req.body.noOfTables || reservation.noOfTables;
    reservation.isMember = req.body.isMember || reservation.isMember;
    reservation.howDidYouHear =
      req.body.howDidYouHear || reservation.howDidYouHear;

    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a reservation by ID
const deleteReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    await Reservation.deleteOne({ _id: req.params.id });
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reservations by email
const getReservationsByEmail = async (req, res) => {
  try {
    const reservations = await Reservation.find({ email: req.params.email });
    if (!reservations) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservationById,
  deleteReservationById,
  getReservationsByEmail,
};
