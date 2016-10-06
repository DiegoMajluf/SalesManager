
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
		if(nd.length > 0) this.SignatureValue = nd[0].textContent;
		nd = Node.getElementsByTagName('SignedInfo');
		if(nd.length > 0) {
			this.SignedInfo = new SignedInfo();
			this.SignedInfo.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('KeyInfo');
		if(nd.length > 0) {
			this.KeyInfo = new KeyInfo();
			this.KeyInfo.ParseFromXMLElement(nd[0]);
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
		if(nd.length > 0) {
			this.CanonicalizationMethod = new CanonicalizationMethod();
			this.CanonicalizationMethod.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('SignatureMethod');
		if(nd.length > 0) {
			this.SignatureMethod = new SignatureMethod();
			this.SignatureMethod.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('Reference');
		if(nd.length > 0) {
			this.Reference = new Reference();
			this.Reference.ParseFromXMLElement(nd[0]);
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

type Algorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1' | 'http://www.w3.org/2000/09/xmldsig#dsa-sha1' 

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
		if(nd.length > 0) this.DigestValue = nd[0].textContent;
		nd = Node.getElementsByTagName('Transforms');
		if(nd.length > 0) {
			this.Transforms = new Transforms();
			this.Transforms.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('DigestMethod');
		if(nd.length > 0) {
			this.DigestMethod = new DigestMethod();
			this.DigestMethod.ParseFromXMLElement(nd[0]);
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
		if(nd.length > 0) {
			this.Transform = new Transform();
			this.Transform.ParseFromXMLElement(nd[0]);
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
		if(nd.length > 0) {
			this.KeyValue = new KeyValue();
			this.KeyValue.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('X509Data');
		if(nd.length > 0) {
			this.X509Data = new X509Data();
			this.X509Data.ParseFromXMLElement(nd[0]);
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
		if(nd.length > 0) {
			this.RSAKeyValue = new RSAKeyValue();
			this.RSAKeyValue.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('DSAKeyValue');
		if(nd.length > 0) {
			this.DSAKeyValue = new DSAKeyValue();
			this.DSAKeyValue.ParseFromXMLElement(nd[0]);
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
		if(nd.length > 0) this.Modulus = nd[0].textContent;
		nd = Node.getElementsByTagName('Exponent')
		if(nd.length > 0) this.Exponent = nd[0].textContent;
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
		if(nd.length > 0) this.P = nd[0].textContent;
		nd = Node.getElementsByTagName('Q')
		if(nd.length > 0) this.Q = nd[0].textContent;
		nd = Node.getElementsByTagName('G')
		if(nd.length > 0) this.G = nd[0].textContent;
		nd = Node.getElementsByTagName('Y')
		if(nd.length > 0) this.Y = nd[0].textContent;
	}

}

/**Informacion del Certificado Publico. */
export class X509Data {
	/**Certificado Publico. */
	X509Certificate:string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('X509Certificate')
		if(nd.length > 0) this.X509Certificate = nd[0].textContent;
	}

}

