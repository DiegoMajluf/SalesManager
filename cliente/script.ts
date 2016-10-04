
window.addEventListener('load', () => {



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
            xml.send(fr.result)
            console.log('Se ha leaido el documento. Se envió')
        }
        fr.readAsArrayBuffer(inp.files[0])

    })
})