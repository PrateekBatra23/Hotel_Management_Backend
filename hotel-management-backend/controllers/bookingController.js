const Booking = require("../models/Booking");
const Room = require("../models/Room");

const bookRoom = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Basic check for existing bookings (expand logic later)
    const isAlreadyBooked = await Booking.findOne({
      room: roomId,
      status: "booked",
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
      ],
    });

    if (isAlreadyBooked) {
      return res.status(400).json({ message: "Room already booked for selected dates" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn,
      checkOut,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking error:", err.message);
    res.status(500).json({ message: "Booking failed" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("room");
    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

const cancelBooking = async (req, res) => {
  console.log("🧪 cancelBooking called");

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Cancel booking error:", err.message);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

module.exports = {
  bookRoom,
  getMyBookings,
  cancelBooking, // 👈 don't forget this!
};
