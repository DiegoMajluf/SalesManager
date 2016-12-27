///<reference path="./typings/index.d.ts"/>

'use strict';

import * as express  from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { router as getFile } from './routes/sendmefile'
import { router as query } from './routes/querydata'
import { db  } from './commons/mongo';




export let app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/webapp', express.static(path.join(__dirname, 'webapp')));
app.use('/jspm_packages', express.static(path.join(__dirname, 'jspm_packages')));
app.use('/index.html', express.static(path.join(__dirname, 'index.html')));
app.use('/config.js', express.static(path.join(__dirname, 'config.js')));
app.use('/postFile.html', express.static(path.join(__dirname, 'postFile.html')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use((req, res, next) => {
  req['rutEmpresa']= '76398667-5'
  next();
})
app.use('/sendmefile', getFile)
app.use('/query', query)

app.get('/', (req, res) => {
  res.send({ app: 'hola' })
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(<express.ErrorRequestHandler>function (err, req, res, next) {
    console.log('error')
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
} else

  // production error handler
  // no stacktraces leaked to user
  app.use(<express.ErrorRequestHandler>function (err, req, res, next) {
    console.log('error')
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: {}
    });
  });

let port = 3001
app.listen(port, () => console.log('Example app listening on port ' + port));




