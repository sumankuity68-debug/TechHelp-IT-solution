import Service from '../models/Service.js';

// Auto-seed default services
const seedDefaultServices = async () => {
  const defaults = [
    {
      num: '01',
      title: 'Web & Enterprise Systems',
      description: 'Scalable web applications built with React, Node.js, and MongoDB. Secure architectures, fast load times, and cloud integration.',
      tags: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
      isActive: true,
    },
    {
      num: '02',
      title: 'Custom Software & APIs',
      description: 'High-performance API design, microservices orchestration, and database tuning to drive your core operational needs.',
      tags: ['Microservices', 'GraphQL', 'Express', 'SQL/NoSQL'],
      isActive: true,
    },
    {
      num: '03',
      title: 'Cloud & DevOps Solutions',
      description: 'Reliable cloud migrations, CI/CD pipeline automation, and containerized configurations for uninterrupted operations.',
      tags: ['AWS', 'Docker', 'GitHub Actions', 'Serverless'],
      isActive: true,
    },
    {
      num: '04',
      title: 'Digital Experience & UI',
      description: 'Intuitive interface designs that map out seamless user flows. Interactive prototypes and stunning visuals designed for conversions.',
      tags: ['Figma', 'Prototyping', 'Design Systems'],
      isActive: true,
    },
  ];

  await Service.insertMany(defaults);
};

export const getAllServices = async (req, res) => {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      await seedDefaultServices();
    }

    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const services = await Service.find(filter).sort({ num: 1 });

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