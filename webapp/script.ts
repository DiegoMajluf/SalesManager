import { dte } from 'sii-dtes'

let pre = <HTMLPreElement>document.getElementById('pre');

function sendText() {
    let txt = <HTMLTextAreaElement>document.getElementById('textArea');

    let xml = new XMLHttpRequest();
    xml.open('post', '/sendmefile');
    xml.onload = () => pre.textContent = xml.response;
    xml.send(new Blob([txt.value], { type: "application/xml" }))
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
            let doc = new DOMParser().parseFromString(fr.result, "application/xml");
            let dt = new dte.SetDTE();
            dt.ParseFromXMLElement(doc.documentElement)
            xml.send(JSON.stringify(dt));
        }
        fr.readAsText(inp.files[0])

    })

})()




