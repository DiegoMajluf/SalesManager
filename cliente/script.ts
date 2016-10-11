import * as DTE from './dtes'

let pre = <HTMLPreElement>document.getElementById('pre');

function sendText() {
    let txt = <HTMLTextAreaElement>document.getElementById('textArea');

    let xml = new XMLHttpRequest();
    xml.open('post', '/sendmefile');
    xml.onload = () => pre.textContent = xml.response;
    xml.send(new Blob([txt.value], {type: "application/xml"}))
}


(() => {



    let inp = <HTMLInputElement>document.getElementById('inpFile');
    let but = <HTMLInputElement>document.getElementById('button');
     but.addEventListener('click', sendText);

    inp.addEventListener('change', () => {

        let xml = new XMLHttpRequest();
        xml.open('post', '/sendmefile');
        xml.onload = function () { pre.textContent = xml.response; }
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

    


