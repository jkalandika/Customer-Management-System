const Booking = require("../models/Booking.model");
const { sendEmailNodemailer } = require("../util/sendmail");
const moment = require("moment");
var cron = require('node-cron');

cron.schedule('* * * * *', async () => {
  console.log('running a task every minute');
  try {
    const bookings = await Booking.find();
    await bookings.forEach((booking) => {
      const tempdate = moment(booking.date).format("YYYY-MM-DD");
      const bookingTime = moment(tempdate + ' ' + booking.time, 'YYYY-MM-DD HH:mm');
      const currentTime = moment();
      const timeDiffMinutes = currentTime.diff(bookingTime, 'minutes');
      console.log("booking time" + bookingTime.format('YYYY-MM-DD'))
      console.log("currentTime time" + currentTime.format('YYYY-MM-DD'))
      console.log('timeDiffMinutes',timeDiffMinutes)
      if (bookingTime.format('YYYY-MM-DD') === currentTime.format('YYYY-MM-DD') && timeDiffMinutes == -60 || timeDiffMinutes == -59 || timeDiffMinutes == -58) {
        console.log(booking);
        sendEmailNodemailer(booking.email, "Kind Reminder for Your booking", "Dear Sir, You have a booking in a hour")
      }
    });
  } catch (error) {
    console.log('Server Error' + error);
  }
});

const saveBooking = async (req, res) => {
  const {
    firstName,
    lastName,
    contactNumber,
    email,
    facility,
    date,
    time,
    paymentAmount,
    userId,
  } = req.body;

  const booking = new Booking({
    firstName,
    lastName,
    contactNumber,
    email,
    facility,
    date,
    time,
    paymentAmount,
    userId,
  });

  console.log(booking);

  //Save to mongodb database
  booking
    .save()
    .then(async (savedData) => {
      await sendEmailNodemailer(
        email,
        "Booking Confirmed",
        "Hello " + firstName + ". You booking for " + facility + " is confirmed"
      );
      await res.json(savedData);
    })
    .catch((error) => res.status(500).send("Server Error" + error));
};

const getBookingsGraph = async (req, res) => {
  try {
    const bookings = await Booking.find();

    const dailyTotals = {};

    bookings.forEach((booking) => {
      const date = moment(booking.date).format("YYYY-MM-DD");
      if (!dailyTotals[date]) {
        dailyTotals[date] = 0;
      }
      dailyTotals[date] += booking.paymentAmount;
    });

    const arr = Object.entries(dailyTotals).map((entry) => [
      entry[0],
      entry[1],
    ]);

    console.log(arr);
    res.json(arr);
  } catch (error) {
    res.status(500).send("Server Error" + error);
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).send("Server Error" + error);
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(500).send("Server Error" + error);
  }
};

const getBookingsByUserId = async (req, res) => {
  try {
    const booking = await Booking.find({ userId: req.params.id });
    res.json(booking);
    booking.forEach((singleBooking) => {});
  } catch (error) {
    res.status(500).send("Server Error" + error);
  }
};

const updateBooking = async (req, res) => {
  Booking.findByIdAndUpdate(req.params.id)
    .then((existingData) => {
      existingData.firstName = req.body.firstName;
      existingData.lastName = req.body.lastName;
      existingData.contactNumber = req.body.contactNumber;
      existingData.email = req.body.email;
      existingData.facility = req.body.facility;
      existingData.date = req.body.date;
      existingData.time = req.body.time;
      existingData.paymentAmount = req.body.paymentAmount;
      //Save the changes from request to database
      existingData
        .save()
        .then((updatedData) => res.json(updatedData))
        .catch((error) => res.status(400).json("Error: " + error));
    })
    .catch((error) => res.status(400).json("Error: " + error));
};

const deleteBooking = async (req, res) => {
  Booking.findByIdAndDelete(req.params.id)
    .then((deletedData) => {
      res.json(deletedData);
    })
    .catch((error) => res.status(400).json("Error: " + error));
};

module.exports = {
  saveBooking,
  getBookingById,
  getBookingsByUserId,
  getBookings,
  updateBooking,
  deleteBooking,
  getBookingsGraph,
};
