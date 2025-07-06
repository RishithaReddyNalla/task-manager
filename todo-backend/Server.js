const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON request bodies

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/tododb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

// Define a Task schema and model
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

// Routes
// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add new task
app.post("/tasks", async (req, res) => {
  const newTask = new Task({
    text: req.body.text,
    completed: false,
  });
  const savedTask = await newTask.save();
  res.json(savedTask);
});

// Update task (mark completed or update text)
app.put("/tasks/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed, text: req.body.text },
    { new: true }
  );
  res.json(updatedTask);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
