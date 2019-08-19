const express = require('express');

const router = express.Router();

const actionDB = require('../data/helpers/actionModel.js');
const projectDB = require('../data/helpers/projectModel.js');


// When the client makes a `POST` request to `/api/action`:
router.post('/', validateAction, validateProjectId, async (req, res) => {
  //datatype
  //status code
  //responce

  const { project_id, description, notes, completed } = req.body;
  try{
    const newAction = await actionDB.insert({project_id, description, notes, completed})
    res.status(201).json(newAction)
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: 'There was an error while saving the action to the database' })
  }
});

// When the client makes a `GET` request to `/api/action`:
router.get('/', async (req, res) => {

  try {
    const action = await actionDB.get();
    res.status(200).json(action);
  } catch(err) {
    res.status(500).json({ error: 'Cannot retrieve'})
  }
});

// When the client makes a `GET` request to `/api/action/:id`:
router.get('/:id', validateActionId, async (req, res) => {
  const { id } = req.params;

  try {
    const action = await actionDB.get(id);
    res.status(200).json(action);
  } catch(err) {
    res.status(500).json({ error: 'Cannot retrieve'})
  }
});

// When the client makes a `PUT` request to `/api/action/:id`:
router.put('/:id', validateActionId, validateProjectId, async (req, res) => {
  const { id } = req.params
  const { project_id, description, notes, completed } = req.body;

  try {
    const updatedAction = await actionDB.update(id, { project_id, description, notes, completed });
    res.status(200).json(updatedAction);
  } catch(err) {
    console.log(actionRouter);
    res.status(500).json({ error: "The user information could not be modified." })
  }
});

// When the client makes a `DELETE` request to `/api/action/:id`:
router.delete('/:id', validateActionId, async (req, res) => {
  const { id } = req.params
  try {
    const deleteaction = await actionDB.remove(id);
    res.status(200).json({ deleteaction });
  } catch(err) {
    res.status(500).json({ error: "The user could not be removed" })
  }
});

//custom middleware
function validateActionId(req, res, next) {
  const { id } = req.params;

  actionDB.get(id)
    .then( action => {
      if(action){
        req.action = action;
        next();
      } else {
        res.status(400).json({ message: "invalid action id" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "server error!", err})
    })
};

function validateProjectId(req, res, next) {
  const { project_id } = req.body;

  projectDB.get(project_id)
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


function validateAction(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "missing action data" })
  } else if (!req.body.project_id){
    res.status(400).json({ message: "missing required project_id field"})
  } else if (!req.body.description) {
    res.status(400).json({ message: "missing required description field" })
  } else if (!req.body.notes){
    res.status(400).json({ message: "missing required notes field" })
  } else {
    next()
  }
};

module.exports = router;
