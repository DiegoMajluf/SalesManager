import * as express from 'express';
import * as DTE from '../cliente/dtes';


export let router = express.Router();
router.post('/', (req, res, next) => {
    let str = '';
    req.setEncoding('utf8')
    req.on('data', chnk => str += chnk);
    req.on('end', () => {
        let set = <DTE.SetDTE>JSON.parse(str);
        res.send(set);
    })
});

router.get('/', (req, res) => res.sendFile(process.cwd() + '/cliente/postFile.htm'));
