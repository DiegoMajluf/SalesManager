import * as express  from 'express';
import * as fs from 'fs';
import * as DTE from '../cliente/dtes'
import {DOMParser} from 'xmldom'


export let router = express.Router();

router.post('/', function (req, res) {
    req.on('readable', function () {
        req.setEncoding('utf8')
        let str = <string>req.read();
        // let rd = new DOMParser({
        //     locator: {},
        //     errorHandler: {
        //         warning: (w) => console.warn(w),
        //         error: (e) => console.error(e),
        //         fatalError: (e) => console.error(e)
        //     }
        // })
        // let doc = rd.parseFromString(str, "application/xml")
        res.send(str)
    });
        
});

router.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/cliente/postFile.htm')
}) 
