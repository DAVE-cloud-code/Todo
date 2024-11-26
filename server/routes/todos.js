const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
});

// POST a new todo
router.post('/', async (req, res) => {
  const { task, dueDateTime } = req.body;

  if (!task || !dueDateTime) {
    return res.status(400).json({ message: 'Task and Due Date/Time are required' });
  }

  const todo = new Todo({
    task,
    dueDateTime,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Failed to create todo' });
  }
});

// PATCH (Update notification status)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { notified } = req.body;

  if (typeof notified !== 'boolean') {
    return res.status(400).json({ message: 'Invalid notification status' });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { notified },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Failed to update todo' });
  }
});

// DELETE a todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});

module.exports = router;
