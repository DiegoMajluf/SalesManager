import * as express  from 'express';
import * as fs from 'fs';
var xml4js = require('xml4js');
var parser: any;
export let router = express.Router();


fs.readFile('../schemas/LibrosCV/LibroCV_v10.xsd', { encoding: 'utf-8' }, (err, data) => {
    parser = new xml4js.Parser({});
    parser.addSchema('http://www.example.com/Schema', data, function (err: any, importsAndIncludes: any) {
        // importsAndIncludes contains schemas to be added as well to satisfy all imports and includes found in schema.xsd 
    });
});


router.post('/', function (req, res) {
    req.on('readable', function () {
        req.setEncoding('utf8')
        let str = <string>req.read();
        console.log(str.length);
        res.send(str)
        parser.parseString(str, function (err: Error, result:any) {
            console.log(typeof(result));
            res.send(result)
        });
        
    });
});

router.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/cliente/postFile.htm')
}) 
