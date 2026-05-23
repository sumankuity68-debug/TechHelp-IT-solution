import Service from '../models/Service.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ num: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching services',
    });
  }
};

export const createService = async (req, res) => {
  try {
    const { num, title, description, tags } = req.body;

    if (!num || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide num, title, and description',
      });
    }

    const exists = await Service.findOne({ num });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Service with this number already exists',
      });
    }

    const service = await Service.create({
      num,
      title,
      description,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating service',
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating service',
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting service',
    });
  }
};