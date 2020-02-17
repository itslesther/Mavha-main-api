import * as express from 'express';
import AccountService from '../services/account/account';
import SharedService from '../services/shared/shared';


const accountService = new AccountService();

const sharedService = new SharedService();


const routes = express.Router();


routes.post('/createAccount', ((req, res)=> {

	if (!sharedService.fieldsNotEmpty(req.body.firstName, req.body.lastName, req.body.email, req.body.password)) {
    res.send({success:false, data: null, error: {code: 'emptyFields'}});
    return;
  }

	accountService.createAccount(req.body.firstName, req.body.lastName, req.body.email, req.body.password)
    .then(() => res.send({success:true, data: null, error: null}))
    .catch((err) => res.send({success:false, data: null, error: {code: err}}));

}));



export default routes;