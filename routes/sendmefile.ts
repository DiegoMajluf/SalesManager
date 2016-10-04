import * as express  from 'express';
export let router = express.Router();

router.post('/', function (req, res) {
    console.log('en la función')
    console.log(req.body);
    res.send(req.body)
});

router.get('/', (req, res) => {
    res.send('entramos ok')
}) 
