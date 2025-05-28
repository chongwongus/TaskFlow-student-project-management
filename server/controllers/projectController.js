const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    // Add user to request body
    req.body.owner = req.user.id;
    
    // Create project
    const project = await Project.create(req.body);

    // Add the owner as a member with 'owner' role
    project.members.push({
      user: req.user.id,
      role: 'owner'
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    // Find projects where the user is owner or member
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    }).populate('owner', 'name email avatar');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('tasks');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Make sure user is project owner or member
    const isMember = project.members.some(member => 
      member.user._id.toString() === req.user.id
    );

    if (!isMember && project.owner._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Make sure user is project owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Update project
    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Make sure user is project owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // FIXED: Use findByIdAndDelete() instead of remove()
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
exports.addProjectMember = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Make sure user is project owner or has owner role in members
    const userMember = project.members.find(member => 
      member.user.toString() === req.user.id
    );
    const isOwner = project.owner.toString() === req.user.id || 
                   (userMember && userMember.role === 'owner');

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members to this project'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already a member
    const isMember = project.members.some(
      member => member.user.toString() === user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project'
      });
    }

    // Add user to members array
    project.members.push({
      user: user._id,
      role
    });

    await project.save();

    // Populate the new member data for response
    await project.populate('members.user', 'name email avatar');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
exports.removeProjectMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Make sure user is project owner or has owner role in members
    const userMember = project.members.find(member => 
      member.user.toString() === req.user.id
    );
    const isOwner = project.owner.toString() === req.user.id || 
                   (userMember && userMember.role === 'owner');

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members from this project'
      });
    }

    // Find the member to remove
    const memberToRemove = project.members.find(
      member => member.user.toString() === req.params.userId
    );

    if (!memberToRemove) {
      return res.status(404).json({
        success: false,
        message: 'User is not a member of this project'
      });
    }

    // Prevent removing the last owner
    const ownerMembers = project.members.filter(member => member.role === 'owner');
    if (memberToRemove.role === 'owner' && ownerMembers.length === 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the last owner from the project'
      });
    }

    // Remove user from members array
    project.members = project.members.filter(
      member => member.user.toString() !== req.params.userId
    );

    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update member role
// @route   PUT /api/projects/:id/members/:userId
// @access  Private
exports.updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['owner', 'member', 'viewer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be owner, member, or viewer'
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Make sure user is project owner or has owner role in members
    const userMember = project.members.find(member => 
      member.user.toString() === req.user.id
    );
    const isOwner = project.owner.toString() === req.user.id || 
                   (userMember && userMember.role === 'owner');

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update member roles in this project'
      });
    }

    // Find the member to update
    const memberToUpdate = project.members.find(
      member => member.user.toString() === req.params.userId
    );

    if (!memberToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'User is not a member of this project'
      });
    }

    // Prevent removing the last owner
    const ownerMembers = project.members.filter(member => member.role === 'owner');
    if (memberToUpdate.role === 'owner' && ownerMembers.length === 1 && role !== 'owner') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change role of the last owner'
      });
    }

    // Update the member's role
    memberToUpdate.role = role;
    await project.save();

    // Populate member data for response
    await project.populate('members.user', 'name email avatar');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Connect GitHub repository to project
// @route   POST /api/projects/:id/github
// @access  Private
exports.connectGithubRepo = async (req, res) => {
  try {
    const { owner, name, fullName, url } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Make sure user is project owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to connect GitHub repository to this project'
      });
    }

    // Update project with GitHub repository info
    project.githubRepo = {
      owner,
      name,
      fullName,
      url
    };

    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};