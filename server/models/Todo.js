const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  dueDateTime: {
    type: Date,
    required: true
  },
  notified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Todo', todoSchema);
