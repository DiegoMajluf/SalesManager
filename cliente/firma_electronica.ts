
/**Firma Digital sobre Documento. */
export class Signature {
	/**Descripcion de la Informacion Firmada y del Metodo de Firma. */
	SignedInfo: SignedInfo
	/**Valor de la Firma Digital. */
	SignatureValue:string
	/**Informacion de Claves Publicas y Certificado. */
	KeyInfo: KeyInfo
	ParseFromXMLElement = (Node: Element) => { 
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('SignatureValue')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SignatureValue= nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('SignedInfo');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SignedInfo = new SignedInfo();
				this.SignedInfo.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('KeyInfo');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.KeyInfo = new KeyInfo();
				this.KeyInfo.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Descripcion de la Informacion Firmada y del Metodo de Firma. */
export class SignedInfo {
	/**Algoritmo de Canonicalizacion. */
	CanonicalizationMethod: CanonicalizationMethod
	/**Algoritmo de Firma. */
	SignatureMethod: SignatureMethod
	/**Referencia a Elemento Firmado. */
	Reference: Reference
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('CanonicalizationMethod');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CanonicalizationMethod = new CanonicalizationMethod();
				this.CanonicalizationMethod.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('SignatureMethod');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SignatureMethod = new SignatureMethod();
				this.SignatureMethod.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Reference');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Reference = new Reference();
				this.Reference.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Algoritmo de Canonicalizacion. */
export class CanonicalizationMethod {
	
	Algorithm: string = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('Algorithm')) this.Algorithm = Node.getAttribute('Algorithm');
	}

}

/**Algoritmo de Firma. */
export class SignatureMethod {
	
	Algorithm: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('Algorithm')) this.Algorithm = <string>Node.getAttribute('Algorithm');
	}

}

export type Algorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1' | 'http://www.w3.org/2000/09/xmldsig#dsa-sha1' 

/**Referencia a Elemento Firmado. */
export class Reference {
	
	URI: string
	/**Opcional. Algoritmo de Transformacion. */
	Transforms: Transforms
	/**Algoritmo de Digest. */
	DigestMethod: DigestMethod
	/**Valor de Digest. */
	DigestValue:string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('URI')) this.URI = <string>Node.getAttribute('URI');
		nd = Node.getElementsByTagName('DigestValue')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DigestValue= nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Transforms');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Transforms = new Transforms();
				this.Transforms.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('DigestMethod');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DigestMethod = new DigestMethod();
				this.DigestMethod.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Algoritmo de Transformacion. */
export class Transforms {
	/***/
	Transform: Transform
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('Transform');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Transform = new Transform();
				this.Transform.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/***/
export class Transform {
	
	Algorithm: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('Algorithm')) this.Algorithm = <string>Node.getAttribute('Algorithm');
	}

}

/**Algoritmo de Digest. */
export class DigestMethod {
	
	Algorithm: string = "http://www.w3.org/2000/09/xmldsig#sha1"
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('Algorithm')) this.Algorithm = Node.getAttribute('Algorithm');
	}

}

/**Informacion de Claves Publicas y Certificado. */
export class KeyInfo {
	/***/
	KeyValue: KeyValue
	/**Informacion del Certificado Publico. */
	X509Data: X509Data
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('KeyValue');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.KeyValue = new KeyValue();
				this.KeyValue.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('X509Data');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.X509Data = new X509Data();
				this.X509Data.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/***/
export class KeyValue {
	/**Opcional. Informacion de Claves Publicas RSA. */
	RSAKeyValue: RSAKeyValue
	/**Opcional. Informacion de Claves Publicas DSA. */
	DSAKeyValue: DSAKeyValue
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('RSAKeyValue');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RSAKeyValue = new RSAKeyValue();
				this.RSAKeyValue.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('DSAKeyValue');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DSAKeyValue = new DSAKeyValue();
				this.DSAKeyValue.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Informacion de Claves Publicas RSA. */
export class RSAKeyValue {
	/**Modulo Clave RSA. */
	Modulus:string
	/**Exponente Clave RSA. */
	Exponent:string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('Modulus')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Modulus= nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Exponent')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Exponent= nd[i].textContent;
				break;
			}
	}

}

/**Informacion de Claves Publicas DSA. */
export class DSAKeyValue {
	/**Modulo Primo. */
	P:string
	/**Entero Divisor de P - 1. */
	Q:string
	/**Entero f(P, Q). */
	G:string
	/**G**X mod P. */
	Y:string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('P')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.P= nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Q')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Q= nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('G')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.G= nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Y')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Y= nd[i].textContent;
				break;
			}
	}

}

/**Informacion del Certificado Publico. */
export class X509Data {
	/**Certificado Publico. */
	X509Certificate:string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('X509Certificate')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.X509Certificate= nd[i].textContent;
				break;
			}
	}

}

