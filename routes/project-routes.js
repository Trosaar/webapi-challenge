const express = require('express');

const router = express.Router();

const projectDB = require('../data/helpers/projectModel.js');

// When the client makes a `POST` request to `/api/project`:
router.post('/', validateProject, async (req, res) => {
  //datatype
  //status code
  //responce

  const { name, description } = req.body;

  try{
    const newProject = await projectDB.insert({name, description})
    res.status(201).json(newProject)
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: 'There was an error while saving the project to the database' })
  }
});

// When the client makes a `GET` request to `/api/project/`:
router.get('/', async (req, res) => {

  try {
    const projects = await projectDB.get();
    res.status(200).json(projects);
  } catch(err) {
    res.status(500).json({ error: 'Cannot retrieve'})
  }
});

// When the client makes a `GET` request to `/api/project/:id`:
router.get('/:id', validateProjectId, async (req, res) => {
  const { id } = req.params;

  try {
    const project = await projectDB.get(id);
    res.status(200).json(project);
  } catch(err) {
    res.status(500).json({ error: 'Cannot retrieve'})
  }
});

// When the client makes a `GET` request to `/api/project/:id/actions`:
router.get('/:id/actions', validateProjectId, async (req, res) => {
  const { id } = req.params;

  const projectactions = await projectDB.getProjectActions(id);
  try {
    res.status(200).json(projectactions);
  } catch(err) {
    res.status(500).json({ error: 'Cannot retrieve'})
  }
});

// When the client makes a `PUT` request to `/api/project/:id`:
router.put('/:id', validateProjectId, async (req, res) => {
  const { id } = req.params
  const { name } = req.body;
  const { description } = req.body;
  const { completed } = req.body

  try {
    const updatedProject = await projectDB.update(id, { name, description, completed });
    res.status(200).json(updatedProject);
  } catch(err) {
    console.log(projectRouter);
    res.status(500).json({ error: "The user information could not be modified." })
  }
});

// When the client makes a `DELETE` request to `/api/project/:id`:
router.delete('/:id', validateProjectId, async (req, res) => {
  const { id } = req.params
  try {
    const deleteproject = await projectDB.remove(id);
    res.status(200).json({ deleteproject });
  } catch(err) {
    res.status(500).json({ error: "The user could not be removed" })
  }
});

//custom middleware
function validateProjectId(req, res, next) {
  const { id } = req.params;

  projectDB.get(id)
    .then( project => {
      if(project){
        req.project = project;
        next();
      } else {
        res.status(400).json({ message: "invalid project id" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "server error!", err})
    })
};

function validateProject(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "missing project data" })
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" })
  } else if (!req.body.description){
    res.status(400).json({ message: "missing required description field" })
  } else {
    next()
  }
};

module.exports = router;
