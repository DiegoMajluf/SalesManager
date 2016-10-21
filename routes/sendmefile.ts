import * as express from 'express';
import * as DTE from '../cliente/dtes';
import { db } from '../commons/mongo'


export let router = express.Router();
router.post('setdte/', (req, res, next) => {
    let str = '';
    req.setEncoding('utf8')
    req.on('data', chnk => str += chnk);
    req.on('end', () => {
        let set = <DTE.SetDTE>JSON.parse(str);

        let sortDTE = set.DTE.reduce((vp, va) => {
            va['ingresado'] = false;
            if (!vp[va.Documento.Encabezado.Emisor.RUTEmisor]) vp[va.Documento.Encabezado.Emisor.RUTEmisor] = {};
            if (!vp[va.Documento.Encabezado.Emisor.RUTEmisor][va.Documento.Encabezado.IdDoc.TipoDTE])
                vp[va.Documento.Encabezado.IdDoc.TipoDTE] = []
            vp[va.Documento.Encabezado.Emisor.RUTEmisor][va.Documento.Encabezado.IdDoc.TipoDTE].push(va)
            vp[va.Documento.Encabezado.Emisor.RUTEmisor + va.Documento.Encabezado.IdDoc.TipoDTE + va.Documento.Encabezado.IdDoc.Folio] = vp;
            return vp;
        }, {})

        Object.keys(sortDTE).forEach(rut => Object.keys(sortDTE[rut])
            .forEach(tipo => {
                let cursor = db.collection('dtes').find({
                    $and: [
                        { 'Documento.Encabezado.IdDoc.TipoDTE': tipo },
                        { 'Documento.Encabezado.Emisor.RUTEmisor': rut },
                        { 'Documento.Encabezado.IdDoc.Folio': { $in: sortDTE[rut][tipo] } }
                    ]
                }).toArray()
                    .then(dtes => {
                        dtes.forEach(
                            dte => {
                                let tmp = sortDTE[dte.Documento.Encabezado.Emisor.RUTEmisor +
                                    dte.Documento.Encabezado.IdDoc.TipoDTE +
                                    dte.Documento.Encabezado.IdDoc.Folio];
                                if (tmp) tmp['ingresado'] = true;
                            })
                        db.collection('dtes').insertMany(set.DTE.filter(d => !d['ingresado']))
                            .then(iw =>
                                res.send(set.DTE.reduce((ac, d) => {
                                    if (!ac[d.Documento.Encabezado.Emisor.RUTEmisor]) ac[d.Documento.Encabezado.Emisor.RUTEmisor] = {};
                                    if (!ac[d.Documento.Encabezado.Emisor.RUTEmisor][d.Documento.Encabezado.IdDoc.TipoDTE])
                                        ac[d.Documento.Encabezado.Emisor.RUTEmisor][d.Documento.Encabezado.IdDoc.TipoDTE] = {};
                                    ac[d.Documento.Encabezado.Emisor.RUTEmisor][d.Documento.Encabezado.IdDoc.TipoDTE]
                                    [d.Documento.Encabezado.IdDoc.Folio] = d['ingresado'];

                                    return ac;
                                })))
                            .catch(err => {
                                res.statusCode = 500;
                                res.send(err)
                            })

                    })
                    .catch(err => {
                        res.statusCode = 500;
                        res.send(err)
                    })
            }))
    });
});

router.post('/arraydte*', (req, res, next) => {
    let str = '';
    req.setEncoding('utf8')
    req.on('data', chnk => str += chnk);
    req.on('end', () => {
        let dtes = <DTE.DTE[]>JSON.parse(str);
        console.log(dtes)
        let sortDTE = dtes.reduce((vp, va) => {
            va['ingresado'] = false;
            if (!vp[va.Documento.Encabezado.Emisor.RUTEmisor]) vp[va.Documento.Encabezado.Emisor.RUTEmisor] = {};
            if (!vp[va.Documento.Encabezado.Emisor.RUTEmisor][va.Documento.Encabezado.IdDoc.TipoDTE])
                vp[va.Documento.Encabezado.IdDoc.TipoDTE] = []
            vp[va.Documento.Encabezado.Emisor.RUTEmisor][va.Documento.Encabezado.IdDoc.TipoDTE].push(va)
            vp[va.Documento.Encabezado.Emisor.RUTEmisor + va.Documento.Encabezado.IdDoc.TipoDTE + va.Documento.Encabezado.IdDoc.Folio] = vp;
            return vp;
        }, {})

        Object.keys(sortDTE).forEach(rut => Object.keys(sortDTE[rut])
            .forEach(tipo => {
                let cursor = db.collection('dtes').find({
                    $and: [
                        { 'Documento.Encabezado.IdDoc.TipoDTE': tipo },
                        { 'Documento.Encabezado.Emisor.RUTEmisor': rut },
                        { 'Documento.Encabezado.IdDoc.Folio': { $in: sortDTE[rut][tipo] } }
                    ]
                }).toArray()
                    .then(dtes => {
                        dtes.forEach(
                            dte => {
                                let tmp = sortDTE[dte.Documento.Encabezado.Emisor.RUTEmisor +
                                    dte.Documento.Encabezado.IdDoc.TipoDTE +
                                    dte.Documento.Encabezado.IdDoc.Folio];
                                if (tmp) tmp['ingresado'] = true;
                            })
                        db.collection('dtes').insertMany(dtes.filter(d => !d['ingresado']))
                            .then(iw =>
                                res.send(dtes.reduce((ac, d) => {
                                    if (!ac[d.Documento.Encabezado.Emisor.RUTEmisor]) ac[d.Documento.Encabezado.Emisor.RUTEmisor] = {};
                                    if (!ac[d.Documento.Encabezado.Emisor.RUTEmisor][d.Documento.Encabezado.IdDoc.TipoDTE])
                                        ac[d.Documento.Encabezado.Emisor.RUTEmisor][d.Documento.Encabezado.IdDoc.TipoDTE] = {};
                                    ac[d.Documento.Encabezado.Emisor.RUTEmisor][d.Documento.Encabezado.IdDoc.TipoDTE]
                                    [d.Documento.Encabezado.IdDoc.Folio] = d['ingresado'];

                                    return ac;
                                })))
                            .catch(err => {
                                res.statusCode = 500;
                                res.send(err)
                            })

                    })
                    .catch(err => {
                        res.statusCode = 500;
                        res.send(err)
                    })
            }))

    })
});


router.get('/', (req, res) => res.sendFile(process.cwd() + '/cliente/postFile.htm'));
