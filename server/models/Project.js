const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
      maxlength: [100, 'Project name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'on-hold'],
      default: 'planning'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        role: {
          type: String,
          enum: ['owner', 'member', 'viewer'],
          default: 'member'
        },
        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    githubRepo: {
      owner: String,
      name: String,
      fullName: String,
      url: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for tasks
ProjectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

// Ensure the owner is also listed as a member with owner role
ProjectSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('owner')) {
    // Check if owner is already in members array
    const isOwnerInMembers = this.members.some(
      member => member.user.toString() === this.owner.toString() && member.role === 'owner'
    );
    
    if (!isOwnerInMembers) {
      this.members.unshift({
        user: this.owner,
        role: 'owner',
        joinedAt: Date.now()
      });
    }
  }
  next();
});

// Cascade delete tasks when a project is deleted
ProjectSchema.pre('remove', async function(next) {
  await this.model('Task').deleteMany({ project: this._id });
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);