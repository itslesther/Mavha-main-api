import * as express from 'express';
import routes from './routes/routes';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Database } from './services/Database';

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());
const PORT = process.env.PORT || 8080;

const database = new Database();

database.init();

app.get('/', (req, res)=>{
	res.send('Hello World!');
});

app.use(routes);



app.listen(PORT, ()=>{
	console.log(`Node Server initialized on http://localhost:${PORT}`);
});