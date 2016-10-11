import * as express from 'express';
import * as fs from 'fs';
import * as DTE from '../cliente/dtes'
import { DOMParser } from 'xmldom'


export let router = express.Router();

router.post('/', function (req, res, next) {
    req.on('readable', function () {
        req.setEncoding('utf8')
        let str = <string>req.read();
        try {
            let doc = new DOMParser({
                locator: {},
                errorHandler: {
                    warning: (w) => console.warn('Advertencia: ' + w),
                    error: (e) => console.error('Error: ' + e),
                    fatalError: (e) => console.error('Error Fatal: ' + e)
                }
            }).parseFromString(str, "text/xml")

        } catch (e) {
            console.log(e)
        }

        // let dd = new DTE.SetDTE();
        // dd.ParseFromXMLElement(doc.documentElement)
        res.write(str)
        res.send();
    });

});

router.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/cliente/postFile.htm')
}) 
