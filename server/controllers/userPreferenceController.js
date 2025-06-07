const UserPreference = require('../models/UserPreference');
const User = require('../models/User');

// @desc    Create a new UserPreference
// @route   POST /api/userPreferenceData
// @access  Private
exports.createUserPreference = async (req, res) => {
  try {
    const { email, theme } = req.body;
    // Check if user exists
    let user = await User.findOne({ email });


    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user as creator to request body
    req.body.theme = theme || 'light'; // Default to 'light' if no theme provided

    // Create user preference
    const task = await UserPreference.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user Preference Data
// @route   GET /api/userPreferenceData
// @access  Private
exports.getUserPreference = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if User Preference exists
    let userPreference = await UserPreference.findOne({ email });

    if (!userPreference) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }


    res.status(200).json({
      success: true,
      count: userPreference.length,
      data: userPreference
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};