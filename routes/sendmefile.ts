import * as express from 'express';
import * as fs from 'fs';
import * as DTE from '../cliente/dtes'
import { DOMParser } from 'xmldom'


export let router = express.Router();
let str: string = '';
router.post('/', function (req, res, next) {
    req.setEncoding('utf8')
    req.on('readable',  () => str += <string>req.read());
    req.on('end', () => {
        let doc = new DOMParser().parseFromString(str, "text/xml")
        let dd = new DTE.SetDTE();
        dd.ParseFromXMLElement(doc.documentElement)
        res.send(JSON.stringify(dd));
    })
});

router.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/cliente/postFile.htm')
}) 
