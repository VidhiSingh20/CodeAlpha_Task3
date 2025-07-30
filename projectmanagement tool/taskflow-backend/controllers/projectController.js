const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({ name, description, members: [req.user._id] });
  res.json(project);
};

exports.getProjects = async (req, res) => {
  const projects = await Project.find({ members: req.user._id });
  res.json(projects);
};
