import * as express  from 'express';
import * as fs from 'fs';
import * as DTE from './dtes'
import {DOMParser} from 'xmldom'


export let router = express.Router();


fs.readFile('../schemas/LibrosCV/LibroCV_v10.xsd', { encoding: 'utf-8' }, (err1, data) => {

});


router.post('/', function (req, res) {
    req.on('readable', function () {
        req.setEncoding('utf8')
        let str = <string>req.read();
        let rd = new DOMParser()
        let doc = rd.parseFromString(str)
        console.log(doc.childNodes.item(0).nodeName)
    });
});

router.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/cliente/postFile.htm')
}) 
