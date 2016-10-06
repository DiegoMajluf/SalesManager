import * as DTE from './dtes'

(() => {



    let inp = <HTMLInputElement>document.getElementById('inpFile');

    inp.addEventListener('change', () => {

        let xml = new XMLHttpRequest();
        xml.open('post', '/sendmefile');
        xml.onload = function () {
            let pre = <HTMLPreElement>document.getElementById('pre');
            pre.textContent = xml.response;
        }
        let fr = new FileReader();
        fr.onload = function () {
            let dp = new DOMParser();
            let doc = dp.parseFromString(fr.result, "application/xml");
            let dt = new DTE.SetDTE();
            dt.ParseFromXMLElement(doc.documentElement)
            console.log(dt)
            xml.send(fr.result)
        }
        fr.readAsArrayBuffer(inp.files[0])

    })
})()

