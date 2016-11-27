import * as express from 'express';
import { dte, DteService } from 'core-sales-manager'
import { db } from '../commons/mongo';
import { Observable, Subscriber } from 'rxjs/Rx';
import { FindAndModifyWriteOpResultObject } from 'mongodb'


export let router = express.Router();
type IdDoc = dte.DocumentoIdDoc | dte.ExportacionesIdDoc | dte.LiquidacionIdDoc;

router.post('/setdte', (req, res, next) => {
    let str = '';
    req.setEncoding('utf8')
    req.on('data', chnk => str += chnk);
    req.on('end', () => {
        let set: dte.SetDTE
        try {
            set = JSON.parse(str, DteService.dateReviver);
        } catch (err) {
            res.send(500, err)
        }

        addDTEsToBase(set.DTE).subscribe(
            x => res.send(x),
            err => res.send(500, err)
        )
    });
});

router.post('/arraydte', (req, res, next) => {
    let str = '';
    req.setEncoding('utf8')
    req.on('data', chnk => str += chnk);
    req.on('end', () => {
        let dtes: dte.DTE[]
        try {
            dtes = JSON.parse(str, DteService.dateReviver);
        } catch (err) {
            res.status(500).send(err)
        }
        console.log(dtes.length)

        addDTEsToBase(dtes).subscribe(
            x => res.send(x),
            err => {
                console.log(err)
                res.status(500).send(err)
            }
        )


    })
});

function addDTEsToBase(dtes: dte.DTE[]): Observable<{ okDTEs: IdDoc[], errDTEs: { IdDoc: IdDoc, err: any }[] }> {
    return dtes.reduce((acc, dte) => {
        let query = { $and: [{}, {}, {}] }
        let tipoDoc = dte.Documento || dte.Exportaciones || dte.Liquidacion;
        let nombreTipo = (dte.Documento ? 'Documento' : null)
            || (dte.Exportaciones ? 'Exportaciones' : null)
            || (dte.Liquidacion ? 'Liquidacion' : null);

        query.$and[0][`${nombreTipo}.Encabezado.Emisor.RUTEmisor`] = tipoDoc.Encabezado.Emisor.RUTEmisor
        query.$and[1][`${nombreTipo}.Encabezado.IdDoc.TipoDTE`] = tipoDoc.Encabezado.IdDoc.TipoDTE
        query.$and[2][`${nombreTipo}.Encabezado.IdDoc.Folio`] = tipoDoc.Encabezado.IdDoc.Folio

        return acc.merge(Observable.fromPromise(db.collection('dtes')
            .findOneAndUpdate(query, { $setOnInsert: dte }, { upsert: true, returnOriginal: false })))
    }, <Observable<FindAndModifyWriteOpResultObject>>Observable.empty())
        .reduce((acc, v) => {
            let iddoc: IdDoc = (v.value.Documento || v.value.Exportaciones || v.value.Liquidacion).Encabezado.IdDoc;
            if (v.ok == 1) acc.okDTEs.push(iddoc);
            else acc.errDTEs.push({ IdDoc: iddoc, err: v.lastErrorObject })
            return acc
        }, { okDTEs: <IdDoc[]>[], errDTEs: <{ IdDoc: IdDoc, err: any }[]>[] })

}


router.get('/', (req, res) => res.sendFile(process.cwd() + '/cliente/postFile.htm'));


