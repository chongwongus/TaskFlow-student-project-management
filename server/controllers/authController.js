const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

// Configure Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user
        user = await User.create({
            name,
            email,
            password
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
    try {
        console.log('--- Google Login Request Received ---');
        console.log('Request Headers:', req.headers);
        console.log('Request Body:', req.body);

        const { tokenId } = req.body;
        console.log('Extracted tokenId:', tokenId);

        if (!tokenId) {
            console.error('Error: No tokenId provided in request body');
            return res.status(400).json({
                success: false,
                message: 'No token ID provided'
            });
        }

        // Verify Google token
        console.log('Verifying Google token...');
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        console.log('Google token verification successful. Ticket:', ticket);

        const { email_verified, name, email, picture, sub } = ticket.getPayload();
        console.log('Extracted payload:', { email_verified, name, email, picture, sub });

        if (!email_verified) {
            console.warn('Warning: Google email not verified');
            return res.status(400).json({
                success: false,
                message: 'Google email not verified'
            });
        }

        // Check if user exists
        console.log('Checking if user exists with email:', email);
        let user = await User.findOne({ email });

        // If user doesn't exist, create a new user
        if (!user) {
            console.log('User not found. Creating new user...');
            user = await User.create({
                name,
                email,
                googleId: sub,
                avatar: picture
            });
            console.log('New user created:', user);
        } else {
            console.log('User found:', user);
            // Update existing user with Google data
            console.log('Updating user with Google data...');
            user.googleId = sub;
            user.avatar = picture;
            await user.save();
            console.log('User updated:', user);
        }

        console.log('Sending token response...');
        sendTokenResponse(user, 200, res);
        console.log('--- Google Login Request Completed Successfully ---');

    } catch (error) {
        console.error('--- Google Login Error ---');
        console.error('Error:', error);
        console.error('Error Details:', error.message, error.stack); // Include stack trace if available
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    });
};

// Helper function to create token, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    // Use secure flag in production
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }
    });
};