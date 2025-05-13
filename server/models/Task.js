const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: String,
  status: {
    type: String,
    enum: ['to-do', 'in-progress', 'in-review', 'completed'],
    default: 'to-do',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  dueDate: Date,
  completedAt: Date,
  githubIssue: {
    id: Number,
    number: Number,
    url: String,
    syncStatus: {
      type: String,
      enum: ['synced', 'out-of-sync']
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subtasks: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
