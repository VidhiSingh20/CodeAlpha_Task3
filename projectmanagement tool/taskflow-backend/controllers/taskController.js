const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const task = await Task.create({ ...req.body });
  res.json(task);
};

exports.updateTaskStatus = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(task);
};

exports.addComment = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.comments.push({ text: req.body.text, author: req.user.username });
  await task.save();
  res.json(task);
};
