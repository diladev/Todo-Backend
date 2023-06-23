const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a Todo schema
const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  isEditing: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST route to create a new todo
app.post('/todos', async (req, res) => {
  try {
    const newTodo = req.body;
    const createdTodo = await Todo.create(newTodo);
    res.status(201).json(createdTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'An error occurred while creating the todo.' });
  }
});

// GET route to retrieve all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('Error retrieving todos:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the todos.' });
  }
});

// PUT route to update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = req.body;
    const result = await Todo.findByIdAndUpdate(id, updatedTodo, { new: true });
    res.json(result);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'An error occurred while updating the todo.' });
  }
});

// DELETE route to delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    await Todo.findOneAndDelete({ _id: id });
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'An error occurred while deleting the todo.' });
  }
});


// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
