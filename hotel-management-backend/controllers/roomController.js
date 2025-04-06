const Room = require("../models/Room");

// CREATE Room (already there)
const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error.message);
    res.status(500).json({ message: "Failed to create room" });
  }
};

// ⬇️ NEW: GET All Rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error.message);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};
const deleteRoom = async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) return res.status(404).json({ message: "Room not found" });
  
      await room.deleteOne();
      res.json({ message: "Room deleted successfully" });
    } catch (error) {
      console.error("Error deleting room:", error.message);
      res.status(500).json({ message: "Failed to delete room" });
    }
  };
  
  module.exports = {
    createRoom,
    getAllRooms,
    deleteRoom, // ⬅️ don't forget to export
  };
  