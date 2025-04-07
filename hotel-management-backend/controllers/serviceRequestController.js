//serviceRequestController.js
 const ServiceRequest = require("../models/ServiceRequest");
 const logger = require("../utils/logger");

// @desc    Create a new service request
// @route   POST /api/services
// @access  Private
const createServiceRequest = async (req, res) => {
  try {
    const { booking, serviceType, notes } = req.body;

if (!booking || !serviceType) {
  return res.status(400).json({ message: "Booking and service type are required." });
}

const newRequest = await ServiceRequest.create({
  user: req.user._id,
  booking,
  serviceType,
  notes,
});


    logger.info(`Service request created by User ${req.user._id} for Booking ${booking} - Type: ${serviceType}`);
    res.status(201).json(newRequest);
  // Inside createServiceRequest
} catch (err) {
    logger.error(`Error in createServiceRequest: ${err.message}`);
    res.status(500).json({ message: "Server error while creating request." });

  }
  
};

// @desc    Get current user's service requests
// @route   GET /api/services/me
// @access  Private
const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user._id }).populate("booking");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch service requests." });
  }
};

// @desc    Get all service requests (admin)
// @route   GET /api/services
// @access  Private/Admin
const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find().populate("user", "name email").populate("booking");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch service requests." });
  }
};

// @desc    Update status of a service request
// @route   PATCH /api/services/:id
// @access  Private/Admin
const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
const request = await ServiceRequest.findById(req.params.id);

if (!request) {
  return res.status(404).json({ message: "Request not found" });
}

const oldStatus = request.status; // ✅ Define it here
request.status = status || request.status;
await request.save();

logger.info(`Service request ID ${request._id} status changed from '${oldStatus}' to '${request.status}'`);

res.json(request);

  } catch (err) {
    res.status(500).json({ message: "Failed to update request status." });
  }
};
const updateServiceRequest = async (req, res) => {
    try {
      const { serviceType, notes, status } = req.body;
      const request = await ServiceRequest.findById(req.params.id);
  
      if (!request) {
        return res.status(404).json({ message: "Service request not found." });
      }
  
      // If user is not admin and doesn't own this request, deny
      if (!req.user.isAdmin && !request.user.equals(req.user._id)) {
        return res.status(403).json({ message: "Not authorized to edit this request." });
      }
  
      // Optional: Restrict edits after status is "completed"
      if (request.status === "completed") {
        return res.status(400).json({ message: "Cannot modify a completed request." });
      }
  
      // Update fields if provided
      if (serviceType) request.serviceType = serviceType;
      if (notes) request.notes = notes;
      if (status && req.user.isAdmin) request.status = status; // Only admin can update status
  
      await request.save();
      logger.info(`Service request ${request._id} updated by ${req.user._id}`);
      res.json(request);
    } catch (err) {
      logger.error(`Error updating service request: ${err.message}`);
      res.status(500).json({ message: "Failed to update service request." });
    }
  };
  // @desc    Delete a service request
// @route   DELETE /api/services/:id
// @access  Private (User can delete their own request; Admin can delete any)
const deleteServiceRequest = async (req, res) => {
    try {
      const request = await ServiceRequest.findById(req.params.id);
  
      if (!request) {
        return res.status(404).json({ message: "Service request not found." });
      }
  
      // Only allow if user is owner or admin
      if (!req.user.isAdmin && !request.user.equals(req.user._id)) {
        return res.status(403).json({ message: "Not authorized to delete this request." });
      }
  
      // Optional: Block delete if already completed
      if (request.status === "completed" && !req.user.isAdmin) {
        return res.status(400).json({ message: "Cannot delete a completed request." });
      }
  
      await request.deleteOne();
  
      logger.info(`Service request ${request._id} deleted by ${req.user._id}`);
      res.json({ message: "Service request deleted successfully." });
    } catch (err) {
      logger.error(`Error deleting service request: ${err.message}`);
      res.status(500).json({ message: "Failed to delete service request." });
    }
  };
  

module.exports = {
  createServiceRequest,
  getMyServiceRequests,
  getAllServiceRequests,
  updateServiceStatus,
  updateServiceRequest,
  deleteServiceRequest,

};
