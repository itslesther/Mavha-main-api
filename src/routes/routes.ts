import * as express from 'express';


import accountRoutes from './account';
import taskRoutes from './tasks';


const routes = express.Router();



routes.use('/account', accountRoutes);
routes.use('/tasks', taskRoutes);


export default routes;