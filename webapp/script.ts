
let pre = <HTMLPreElement>document.getElementById('pre');

function sendText() {
    let txt = <HTMLTextAreaElement>document.getElementById('textArea');

    let xml = new XMLHttpRequest();
    xml.open('post', 'query/getquerys');
    xml.setRequestHeader('content-type','application/json')
    xml.onload = () => pre.textContent = JSON.stringify(JSON.parse(xml.response), null, ' ');
    xml.send(txt.value)
}





