import * as express from 'express';
import TaskService from '../services/tasks/tasks';
import SharedService from '../services/shared/shared';
const multer  = require('multer')


const taskService = new TaskService();

const sharedService = new SharedService();

const routes = express.Router();


routes.post('/', ((req, res)=> { //NEW TASK
	// if (!sharedService.fieldsNotEmpty(req.body.title, req.body.dueDate, req.body.priority, req.body.description)) {
  //   res.send({success:false, data: null, error: {code: 'emptyFields'}});
  //   return;
  // }

  taskService.newTask(req.body.creator, req.body.title, req.body.dueDate, req.body.priority, req.body.description, req.body.files)
    .then((taskId) => res.send({success:true, data: taskId, error: null}))
    .catch((err) => res.send({success:false, data: null, error: {code: err}}));

}));

routes.get('/', ((req, res) => { //GET TASKS

  taskService.getTasks()
  .then((tasks) => res.send({success: true, data: tasks, error: null}))
  .catch((err) => res.send({success: false, data: null, error: {code: err}}));

}));


routes.get('/:taskId', ((req, res) => { //GET TASKS BY ID

  taskService.getTask(req.params.taskId)
  .then((task) => res.send({success: true, data: task, error: null}))
  .catch((err) => res.send({success: false, data: null, error: {code: err}}));

}));


routes.put('/:taskId', ((req, res) => { //UPDATE TASK BY ID

  taskService.updateTask(req.params.taskId, req.body.title, req.body.dueDate, req.body.priority, req.body.description, req.body.files)
  .then(() => res.send({success: true, data: null, error: null}))
  .catch((err) => res.send({success: false, data: null, error: {code: err}}));

}));

routes.delete('/:taskId', ((req, res) => { //DELETE TASK BY ID

  taskService.deleteTask(req.params.taskId)
  .then(() => res.send({success: true, data: null, error: null}))
  .catch((err) => res.send({success: false, data: null, error: {code: err}}));

}));


const upload = multer({
	storage: multer.diskStorage({
		destination: './tasks',
		filename: (req, file, cb) => 
			cb(null, `${sharedService.generateId()}.${file.originalname.substr(file.originalname.lastIndexOf('.') + 1)}`)
	})
});

routes.post('/uploadDocument', upload.single('doc'), ((req,res) => {

  taskService.uploadDocument(`${req['file'].destination}/${req['file'].filename}`, req['file'].filename)
    .then((info) => res.send({success: true, data: info, error: null}))
    .catch((err) => res.send({success: false, data: null, error: {code: err}}));

}));


routes.post('/deleteDocument', ((req,res) => {

  taskService.deleteDocument(req.body.path)
    .then(() => res.send({success: true, data: null, error: null}))
    .catch((err) => res.send({success: false, data: null, error: {code: err}}));

}));

export default routes;

