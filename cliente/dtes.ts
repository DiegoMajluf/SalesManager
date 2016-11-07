import * as firma from './firma_electronica';


/**Envio de Documentos Tributarios Electronicos. */
export class EnvioDTE {
	
	version: string = "1.0"
	/**Conjunto de DTE enviados. */
	SetDTE: SetDTE
	/**Firma Digital sobre SetDTE. */
	Signature: firma.Signature
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('version')) this.version = <string>Node.getAttribute('version');
		nd = Node.getElementsByTagName('SetDTE');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SetDTE = new SetDTE();
				this.SetDTE.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Signature');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Signature = new firma.Signature();
				this.Signature.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Conjunto de DTE enviados. */
export class SetDTE {
	
	ID: string
	/**Resumen de Informacion Enviada. */
	Caratula: Caratula
	/**Documento Tributario Electronico. */
	DTE: DTE[]
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('ID')) this.ID = <string>Node.getAttribute('ID');
		nd = Node.getElementsByTagName('Caratula');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Caratula = new Caratula();
				this.Caratula.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('DTE');
		if(nd.length > 0) {
			this.DTE = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.DTE.push(new DTE());
					this.DTE[i].ParseFromXMLElement(nd[i]);
				}
		}

	}

}

/**Resumen de Informacion Enviada. */
export class Caratula {
	
	version: string = "1.0"
	/**RUT Emisor de los DTE. */
	RutEmisor: string
	/**RUT que envia los DTE. */
	RutEnvia: string
	/**RUT al que se le envian los DTE. */
	RutReceptor: string
	/**Fecha de Resolucion que Autoriza el Envio de DTE (AAAA-MM-DD). Fecha de Resolucion que Autoriza el Envio de DTE (AAAA-MM-DD). */
	FchResol: Date
	/**Numero de Resolucion que Autoriza el Envio de DTE. */
	NroResol: number
	/**Fecha y Hora de la Firma del Archivo de Envio. */
	TmstFirmaEnv: Date
	/**Subtotales de DTE enviados. */
	SubTotDTE: SubTotDTE[]
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('version')) this.version = <string>Node.getAttribute('version');
		nd = Node.getElementsByTagName('RutEmisor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RutEmisor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RutEnvia')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RutEnvia = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RutReceptor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RutReceptor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FchResol')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchResol = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('NroResol')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroResol = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TmstFirmaEnv')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TmstFirmaEnv = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubTotDTE');
		if(nd.length > 0) {
			this.SubTotDTE = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.SubTotDTE.push(new SubTotDTE());
					this.SubTotDTE[i].ParseFromXMLElement(nd[i]);
				}
		}

	}

}

/**Subtotales de DTE enviados. */
export class SubTotDTE {
	/**Tipo de DTE Enviado. */
	TpoDTE: DOCType
	/**Numero de DTE Enviados. */
	NroDTE: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroDTE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroDTE = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoDTE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoDTE = parseInt(nd[i].textContent);
				break;
			}
	}

}

/**Todos los tipos de Documentos Tributarios Electronicos. */
export enum DOCType {
	FacturaElectronica = 33,
	FacturaElectronicadeVentadeBienesyServiciosNoafectosoExentodeIVA = 34,
	N_43 = 43,
	FacturadeCompraElectronica = 46,
	GuiadeDespachoElectronica = 52,
	NotadeDebitoElectronica = 56,
	NotadeCreditoElectronica = 61,
	N_110 = 110,
	N_111 = 111,
	N_112 = 112,
}
/**Documento Tributario Electronico. */
export class DTE {
	
	version: string = "1.0"
	/**Opcional. Informacion Tributaria del DTE. */
	Documento: Documento
	/**Opcional. Informacion Tributaria de Liquidaciones. */
	Liquidacion: Liquidacion
	/**Opcional. Informacion Tributaria de exportaciones. */
	Exportaciones: Exportaciones
	/**Firma Digital sobre Documento. */
	Signature: firma.Signature
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('version')) this.version = <string>Node.getAttribute('version');
		nd = Node.getElementsByTagName('Documento');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Documento = new Documento();
				this.Documento.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Liquidacion');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Liquidacion = new Liquidacion();
				this.Liquidacion.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Exportaciones');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Exportaciones = new Exportaciones();
				this.Exportaciones.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Signature');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Signature = new firma.Signature();
				this.Signature.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Informacion Tributaria del DTE. */
export class Documento {
	
	ID: string
	/**Identificacion y Totales del Documento. */
	Encabezado: DocumentoEncabezado
	/**Detalle de Itemes del Documento. */
	Detalle: DocumentoDetalle[]
	/**Opcional. Subtotales Informativos. */
	SubTotInfo: DocumentoSubTotInfo[]
	/**Opcional. Descuentos y/o Recargos que afectan al total del Documento. */
	DscRcgGlobal: DocumentoDscRcgGlobal[]
	/**Opcional. Identificacion de otros documentos Referenciados por Documento. */
	Referencia: DocumentoReferencia[]
	/**Opcional. Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
	Comisiones: DocumentoComisiones[]
	/**Timbre Electronico de DTE. */
	TED: DocumentoTED
	/**Fecha y Hora en que se Firmo Digitalmente el Documento AAAA-MM-DDTHH:MI:SS. */
	TmstFirma: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('ID')) this.ID = <string>Node.getAttribute('ID');
		nd = Node.getElementsByTagName('Encabezado');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Encabezado = new DocumentoEncabezado();
				this.Encabezado.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Detalle');
		if(nd.length > 0) {
			this.Detalle = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Detalle.push(new DocumentoDetalle());
					this.Detalle[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('SubTotInfo');
		if(nd.length > 0) {
			this.SubTotInfo = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.SubTotInfo.push(new DocumentoSubTotInfo());
					this.SubTotInfo[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('DscRcgGlobal');
		if(nd.length > 0) {
			this.DscRcgGlobal = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.DscRcgGlobal.push(new DocumentoDscRcgGlobal());
					this.DscRcgGlobal[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('Referencia');
		if(nd.length > 0) {
			this.Referencia = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Referencia.push(new DocumentoReferencia());
					this.Referencia[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('Comisiones');
		if(nd.length > 0) {
			this.Comisiones = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Comisiones.push(new DocumentoComisiones());
					this.Comisiones[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('TED');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TED = new DocumentoTED();
				this.TED.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('TmstFirma')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TmstFirma = new Date(nd[i].textContent);
				break;
			}
	}

}

/**Identificacion y Totales del Documento. */
export class DocumentoEncabezado {
	/**Identificacion del DTE. */
	IdDoc: DocumentoIdDoc
	/**Datos del Emisor. */
	Emisor: DocumentoEmisor
	/**Opcional. RUT a Cuenta de Quien se Emite el DTE. */
	RUTMandante: string
	/**Datos del Receptor. */
	Receptor: DocumentoReceptor
	/**Opcional. RUT que solicita el DTE en Venta a Publico. */
	RUTSolicita: string
	/**Opcional. Informacion de Transporte de Mercaderias. */
	Transporte: DocumentoTransporte
	/**Montos Totales del DTE. */
	Totales: DocumentoTotales
	/**Opcional. Otra Moneda . */
	OtraMoneda: DocumentoOtraMoneda
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('IdDoc');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdDoc = new DocumentoIdDoc();
				this.IdDoc.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Emisor');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Emisor = new DocumentoEmisor();
				this.Emisor.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('RUTMandante')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTMandante = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Receptor');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Receptor = new DocumentoReceptor();
				this.Receptor.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('RUTSolicita')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTSolicita = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Transporte');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Transporte = new DocumentoTransporte();
				this.Transporte.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Totales');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Totales = new DocumentoTotales();
				this.Totales.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('OtraMoneda');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.OtraMoneda = new DocumentoOtraMoneda();
				this.OtraMoneda.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Identificacion del DTE. */
export class DocumentoIdDoc {
	/**Tipo de DTE. */
	TipoDTE: DTEType
	/**Folio del Documento Electronico. */
	Folio: number
	/**Fecha Emision Contable del DTE (AAAA-MM-DD). */
	FchEmis: Date
	/**Opcional. Nota de Credito sin Derecho a Descontar Debito. */
	IndNoRebaja: DocumentoIndNoRebaja
	/**Opcional. Indica Modo de Despacho de los Bienes que Acompanan al DTE. */
	TipoDespacho: DocumentoTipoDespacho
	/**Opcional. Incluido en Guias de Despacho para Especifiicar el Tipo de Traslado de Productos. */
	IndTraslado: DocumentoIndTraslado
	/**Opcional. Tipo de impresión N (Normal)  o T (Ticket) . */
	TpoImpresion: DocumentoTpoImpresion
	/**Opcional. Indica si Transaccion Corresponde a la Prestacion de un Servicio. */
	IndServicio: DocumentoIndServicio
	/**Opcional. Indica el Uso de Montos Brutos en Detalle. */
	MntBruto: DocumentoMntBruto
	/**Opcional. Forma de Pago del DTE. */
	FmaPago: DocumentoFmaPago
	/**Opcional. Forma de Pago Exportación Tabla Formas de Pago de Aduanas. */
	FmaPagExp: number
	/**Opcional. Fecha de Cancelacion del DTE (AAAA-MM-DD). */
	FchCancel: Date
	/**Opcional. Monto Cancelado al   emitirse el documento. */
	MntCancel: number
	/**Opcional. Saldo Insoluto al       emitirse el documento. */
	SaldoInsol: number
	/**Opcional. Tabla de Montos de Pago. */
	MntPagos: DocumentoMntPagos[]
	/**Opcional. Periodo de Facturacion - Desde (AAAA-MM-DD). */
	PeriodoDesde: Date
	/**Opcional. Periodo Facturacion - Hasta (AAAA-MM-DD). */
	PeriodoHasta: Date
	/**Opcional. Medio de Pago. */
	MedioPago: MedioPagoType
	/**Opcional. Tipo Cuenta de Pago. */
	TpoCtaPago: DocumentoTpoCtaPago
	/**Opcional. Número de la cuenta del pago. */
	NumCtaPago: string
	/**Opcional. Banco donde se realiza el pago. */
	BcoPago: string
	/**Opcional. Codigo del Termino de Pago Acordado. */
	TermPagoCdg: string
	/**Opcional. Términos del Pago - glosa. */
	TermPagoGlosa: string
	/**Opcional. Dias de Acuerdo al Codigo de Termino de Pago. */
	TermPagoDias: number
	/**Opcional. Fecha de Vencimiento del Pago (AAAA-MM-DD). */
	FchVenc: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('IndNoRebaja')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndNoRebaja = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TipoDespacho')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoDespacho = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IndTraslado')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndTraslado = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoImpresion')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoImpresion = <DocumentoTpoImpresion>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IndServicio')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndServicio = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntBruto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntBruto = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FmaPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FmaPago = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FmaPagExp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FmaPagExp = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoCtaPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoCtaPago = <DocumentoTpoCtaPago>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('NumCtaPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NumCtaPago = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('BcoPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.BcoPago = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TermPagoCdg')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TermPagoCdg = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TermPagoGlosa')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TermPagoGlosa = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TermPagoDias')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TermPagoDias = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TipoDTE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoDTE = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('Folio')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Folio = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FchEmis')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchEmis = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FchCancel')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchCancel = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntCancel')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntCancel = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SaldoInsol')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SaldoInsol = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntPagos');
		if(nd.length > 0) {
			this.MntPagos = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.MntPagos.push(new DocumentoMntPagos());
					this.MntPagos[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('PeriodoDesde')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PeriodoDesde = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PeriodoHasta')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PeriodoHasta = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MedioPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MedioPago = <MedioPagoType>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FchVenc')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchVenc = new Date(nd[i].textContent);
				break;
			}
	}

}

/***/
export enum DocumentoIndNoRebaja {
	NotadeCreditosinDerechoaDescontarDebito = 1,
}
/***/
export enum DocumentoTipoDespacho {
	DespachoporCuentadelComprador = 1,
	DespachoporCuentadelEmisoraInstalacionesdelComprador = 2,
	DespachoporCuentadelEmisoraOtrasInstalaciones = 3,
}
/***/
export enum DocumentoIndTraslado {
	OperacionConstituyeVenta = 1,
	VentaporEfectuar = 2,
	Consignacion = 3,
	PromocionoDonacionRUTEmisorRUTReceptor = 4,
	TrasladoInterno = 5,
	OtrosTrasladosquenoConstituyenVenta = 6,
	GuiadeDevolucion = 7,
	N_8 = 8,
	N_9 = 9,
}
export type DocumentoTpoImpresion = 'N' | 'T' 

/***/
export enum DocumentoIndServicio {
	FacturaciondeServiciosPeriodicosDomiciliarios = 1,
	FacturaciondeOtrosServiciosPeriodicos = 2,
	FacturadeServicio = 3,
}
/***/
export enum DocumentoMntBruto {
	MontodeLineasdeDetalleCorrespondeaValoresBrutosIVAImpuestosAdicionales = 1,
}
/***/
export enum DocumentoFmaPago {
	PagoContado = 1,
	PagoCredito = 2,
	SinCosto = 3,
}
export type DocumentoTpoCtaPago = 'AHORRO' | 'CORRIENTE' | 'VISTA' 

/**Tipos de Documentos Tributarios Electronicos. */
export enum DTEType {
	FacturaElectronica = 33,
	FacturaElectronicadeVentadeBienesyServiciosNoafectosoExentodeIVA = 34,
	FacturadeCompraElectronica = 46,
	GuiadeDespachoElectronica = 52,
	NotadeDebitoElectronica = 56,
	NotadeCreditoElectronica = 61,
}
/**Tabla de Montos de Pago. */
export class DocumentoMntPagos {
	/**Fecha de Pago (AAAA-MM-DD). */
	FchPago: Date
	/**Monto de Pago. */
	MntPago: number
	/**Opcional. */
	GlosaPagos: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('GlosaPagos')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GlosaPagos = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FchPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchPago = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntPago = parseFloat(nd[i].textContent);
				break;
			}
	}

}

export type MedioPagoType = 'CH' | 'LT' | 'EF' | 'PE' | 'TC' | 'CF' | 'OT' 

/**Datos del Emisor. */
export class DocumentoEmisor {
	/**RUT del Emisor del DTE. */
	RUTEmisor: string
	/**Nombre o Razon Social del Emisor. */
	RznSoc: string
	/**Giro Comercial del Emisor Relevante para el DTE . */
	GiroEmis: string
	/**Opcional. Telefono Emisor. */
	Telefono: string[]
	/**Opcional. Correo Elect. de contacto en empresa del  receptor . */
	CorreoEmisor: string
	/**Codigo de Actividad Economica del Emisor Relevante para el DTE. */
	Acteco: number[]
	/**Opcional. Emisor de una Guía de despacho para Exportación . */
	GuiaExport: DocumentoGuiaExport
	/**Opcional. Sucursal que Emite el DTE. */
	Sucursal: string
	/**Opcional. Codigo de Sucursal Entregado por el SII. */
	CdgSIISucur: number
	/**Opcional. Direccion de Origen. */
	DirOrigen: string
	/**Opcional. Comuna de Origen. */
	CmnaOrigen: string
	/**Opcional. Ciudad de Origen. */
	CiudadOrigen: string
	/**Opcional. Codigo del Vendedor. */
	CdgVendedor: string
	/**Opcional. Identificador Adicional del Emisor . */
	IdAdicEmisor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('RznSoc')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RznSoc = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('GiroEmis')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GiroEmis = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Telefono')
		if(nd.length > 0) {
			this.Telefono = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.Telefono.push(nd[i].textContent);
		}

		nd = Node.getElementsByTagName('Acteco')
		if(nd.length > 0) {
			this.Acteco = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.Acteco.push(parseFloat(nd[i].textContent));
		}

		nd = Node.getElementsByTagName('Sucursal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Sucursal = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CdgSIISucur')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CdgSIISucur = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('DirOrigen')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirOrigen = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CdgVendedor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CdgVendedor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IdAdicEmisor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdAdicEmisor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTEmisor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTEmisor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CorreoEmisor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CorreoEmisor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('GuiaExport');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GuiaExport = new DocumentoGuiaExport();
				this.GuiaExport.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('CmnaOrigen')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaOrigen = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadOrigen')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadOrigen = nd[i].textContent;
				break;
			}
	}

}

/**Emisor de una Guía de despacho para Exportación . */
export class DocumentoGuiaExport {
	/**Opcional. Código Emisor Traslado Excepcional  . */
	CdgTraslado: DocumentoCdgTraslado
	/**Opcional. Folio Autorización ( N° de Resolución del SI). */
	FolioAut: number
	/**Opcional. Fecha de emisión de la Resolución de autorización (AAAA-MM-DD). */
	FchAut: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('CdgTraslado')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CdgTraslado = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FolioAut')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FolioAut = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FchAut')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchAut = new Date(nd[i].textContent);
				break;
			}
	}

}

/***/
export enum DocumentoCdgTraslado {
	N_1 = 1,
	N_2 = 2,
	N_3 = 3,
	N_4 = 4,
}
/**Datos del Receptor. */
export class DocumentoReceptor {
	/**RUT del Receptor del DTE. */
	RUTRecep: string
	/**Opcional. Codigo Interno del Receptor. */
	CdgIntRecep: string
	/**Nombre o Razon Social del Receptor. */
	RznSocRecep: string
	/**Opcional. Receptor Extranjero. */
	Extranjero: DocumentoExtranjero
	/**Opcional. Giro Comercial del Receptor. */
	GiroRecep: string
	/**Opcional. Telefono o E-mail de Contacto del Receptor. */
	Contacto: string
	/**Opcional. Correo Elect. de contacto en empresa del  receptor . */
	CorreoRecep: string
	/**Opcional. Direccion en la Cual se Envian los Productos o se Prestan los Servicios. */
	DirRecep: string
	/**Opcional. Comuna de Recepcion. */
	CmnaRecep: string
	/**Opcional. Ciudad de Recepcion. */
	CiudadRecep: string
	/**Opcional. Direccion Postal. */
	DirPostal: string
	/**Opcional. Comuna Postal. */
	CmnaPostal: string
	/**Opcional. Ciudad Postal. */
	CiudadPostal: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('CdgIntRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CdgIntRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('GiroRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GiroRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Contacto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Contacto = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DirRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DirPostal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirPostal = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RznSocRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RznSocRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Extranjero');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Extranjero = new DocumentoExtranjero();
				this.Extranjero.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('CorreoRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CorreoRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CmnaRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CmnaPostal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaPostal = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadPostal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadPostal = nd[i].textContent;
				break;
			}
	}

}

/**Receptor Extranjero. */
export class DocumentoExtranjero {
	/**Opcional. Num. Identif. Receptor Extranjero. */
	NumId: string
	/**Opcional. Nacionalidad Receptor Extranjero. */
	Nacionalidad: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NumId')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NumId = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Nacionalidad')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Nacionalidad = nd[i].textContent;
				break;
			}
	}

}

/**Informacion de Transporte de Mercaderias. */
export class DocumentoTransporte {
	/**Opcional. Patente del Vehiculo que Transporta los Bienes. */
	Patente: string
	/**Opcional. RUT del Transportista. */
	RUTTrans: string
	/**Opcional. */
	Chofer: DocumentoChofer
	/**Opcional. Direccion de Destino. */
	DirDest: string
	/**Opcional. Comuna de Destino. */
	CmnaDest: string
	/**Opcional. Ciudad de Destino. */
	CiudadDest: string
	/**Opcional. documentos de Exportación y guías de despacho . */
	Aduana: DocumentoAduana
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('Patente')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Patente = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DirDest')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirDest = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTTrans')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTTrans = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Chofer');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Chofer = new DocumentoChofer();
				this.Chofer.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('CmnaDest')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaDest = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadDest')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadDest = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Aduana');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Aduana = new DocumentoAduana();
				this.Aduana.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/***/
export class DocumentoChofer {
	/**RUT del Chofer. */
	RUTChofer: string
	/**Nombre del Chofer. */
	NombreChofer: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NombreChofer')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NombreChofer = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTChofer')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTChofer = nd[i].textContent;
				break;
			}
	}

}

/**documentos de Exportación y guías de despacho . */
export class DocumentoAduana {
	/**Opcional. Código según  tabla "Modalidad de Venta" de aduana. */
	CodModVenta: number
	/**Opcional. Código según  Tabla "Cláusula compra-venta" de  Aduana. */
	CodClauVenta: number
	/**Opcional. Total  Cláusula de venta. */
	TotClauVenta: number
	/**Opcional. Indicar el Código de la vía de transporte utilizada para transportar la mercadería, según tabla Vías de Transporte de Aduana. */
	CodViaTransp: number
	/**Opcional. Nombre o Identificación del Medio de Transporte. */
	NombreTransp: string
	/**Opcional. Rut Cía. Transportadora. */
	RUTCiaTransp: string
	/**Opcional. Nombre Cía. Transportadora. */
	NomCiaTransp: string
	/**Opcional. Identificador Adicional Cía. Transportadora. */
	IdAdicTransp: string
	/**Opcional. Numero de reserva del Operador. */
	Booking: string
	/**Opcional. Código del Operador. */
	Operador: string
	/**Opcional. Código del puerto de embarque según tabla de Aduana . */
	CodPtoEmbarque: number
	/**Opcional. Identificador Adicional Puerto de Embarque. */
	IdAdicPtoEmb: string
	/**Opcional. Código del puerto de desembarque según tabla de Aduana . */
	CodPtoDesemb: number
	/**Opcional. Identificador Adicional Puerto de Desembarque. */
	IdAdicPtoDesemb: string
	/**Opcional. */
	Tara: number
	/**Opcional. Código de la unidad de medida  según tabla de Aduana . */
	CodUnidMedTara: number
	/**Opcional. Sumatoria de los pesos brutos de todos los ítems del documento. */
	PesoBruto: number
	/**Opcional. Código de la unidad de medida  según tabla de Aduana . */
	CodUnidPesoBruto: number
	/**Opcional. Sumatoria de los pesos netos de todos los ítems del documento. */
	PesoNeto: number
	/**Opcional. Código de la unidad de medida  según tabla de Aduana . */
	CodUnidPesoNeto: number
	/**Opcional. Indique el total de items del documento. */
	TotItems: number
	/**Opcional. Cantidad total de bultos que ampara el documento.. */
	TotBultos: number
	/**Opcional. Tabla de descripción de los distintos tipos de bultos. */
	TipoBultos: DocumentoTipoBultos[]
	/**Opcional. Monto del flete según moneda de venta. */
	MntFlete: number
	/**Opcional. Monto del seguro , según moneda de venta. */
	MntSeguro: number
	/**Opcional. Código del país del receptor extranjero de la mercadería,según tabla Países aduana. */
	CodPaisRecep: number
	/**Opcional. Código del país de destino extranjero de la mercadería,según tabla Países aduana. */
	CodPaisDestin: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('CodModVenta')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodModVenta = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodClauVenta')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodClauVenta = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodViaTransp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodViaTransp = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('NombreTransp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NombreTransp = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('NomCiaTransp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NomCiaTransp = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IdAdicTransp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdAdicTransp = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Booking')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Booking = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Operador')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Operador = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CodPtoEmbarque')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodPtoEmbarque = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IdAdicPtoEmb')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdAdicPtoEmb = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CodPtoDesemb')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodPtoDesemb = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IdAdicPtoDesemb')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdAdicPtoDesemb = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Tara')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Tara = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodUnidMedTara')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodUnidMedTara = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PesoBruto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PesoBruto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodUnidPesoBruto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodUnidPesoBruto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PesoNeto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PesoNeto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodUnidPesoNeto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodUnidPesoNeto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TotItems')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TotItems = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TotBultos')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TotBultos = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodPaisRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodPaisRecep = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodPaisDestin')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodPaisDestin = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TotClauVenta')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TotClauVenta = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RUTCiaTransp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTCiaTransp = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TipoBultos');
		if(nd.length > 0) {
			this.TipoBultos = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.TipoBultos.push(new DocumentoTipoBultos());
					this.TipoBultos[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('MntFlete')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntFlete = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntSeguro')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntSeguro = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Tabla de descripción de los distintos tipos de bultos. */
export class DocumentoTipoBultos {
	/**Opcional. Código según  tabla "Tipos de Bultos" de aduana. */
	CodTpoBultos: number
	/**Opcional. Cantidad de Bultos . */
	CantBultos: number
	/**Opcional. Identificación de marcas, cuando es distinto de contenedor. */
	Marcas: string
	/**Opcional. Se utiliza cuando el tipo de bulto es contenedor. */
	IdContainer: string
	/**Opcional. Sello contenedor. Con digito verificador. */
	Sello: string
	/**Opcional. Nombre emisor sello. */
	EmisorSello: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('CodTpoBultos')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodTpoBultos = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CantBultos')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CantBultos = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('Marcas')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Marcas = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IdContainer')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdContainer = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Sello')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Sello = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('EmisorSello')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.EmisorSello = nd[i].textContent;
				break;
			}
	}

}

/**Montos Totales del DTE. */
export class DocumentoTotales {
	/**Opcional. Monto Neto del DTE. */
	MntNeto: number
	/**Opcional. Monto Exento del DTE. */
	MntExe: number
	/**Opcional. Monto Base Faenamiento Carne. */
	MntBase: number
	/**Opcional. Monto Base de Márgenes de Comercialización. Monto informado. */
	MntMargenCom: number
	/**Opcional. Tasa de IVA. */
	TasaIVA: number
	/**Opcional. Monto de IVA del DTE. */
	IVA: number
	/**Opcional. Monto del IVA propio. */
	IVAProp: number
	/**Opcional. Monto del IVA de Terceros. */
	IVATerc: number
	/**Opcional. Impuestos y Retenciones Adicionales. */
	ImptoReten: DocumentoImptoReten[]
	/**Opcional. IVA No Retenido. */
	IVANoRet: number
	/**Opcional. Credito Especial Empresas Constructoras. */
	CredEC: number
	/**Opcional. Garantia por Deposito de Envases o Embalajes. */
	GrntDep: number
	/**Opcional. Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
	Comisiones: DocumentoComisionesTotales
	/**Monto Total del DTE. */
	MntTotal: number
	/**Opcional. Monto No Facturable - Corresponde a Bienes o Servicios Facturados Previamente. */
	MontoNF: number
	/**Opcional. Total de Ventas o Servicios del Periodo. */
	MontoPeriodo: number
	/**Opcional. Saldo Anterior - Puede ser Negativo o Positivo. */
	SaldoAnterior: number
	/**Opcional. Valor a Pagar Total del documento. */
	VlrPagar: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('MntNeto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntNeto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntExe')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntExe = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntBase')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntBase = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntMargenCom')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntMargenCom = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TasaIVA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TasaIVA = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IVA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IVA = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IVAProp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IVAProp = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IVATerc')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IVATerc = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ImptoReten');
		if(nd.length > 0) {
			this.ImptoReten = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.ImptoReten.push(new DocumentoImptoReten());
					this.ImptoReten[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('IVANoRet')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IVANoRet = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CredEC')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CredEC = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('GrntDep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GrntDep = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('Comisiones');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Comisiones = new DocumentoComisionesTotales();
				this.Comisiones.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('MntTotal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntTotal = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MontoNF')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MontoNF = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MontoPeriodo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MontoPeriodo = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SaldoAnterior')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SaldoAnterior = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('VlrPagar')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.VlrPagar = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Impuestos y Retenciones Adicionales. */
export class DocumentoImptoReten {
	/**Tipo de Impuesto o Retencion Adicional. */
	TipoImp: ImpAdicDTEType
	/**Opcional. Tasa de Impuesto o Retencion. */
	TasaImp: number
	/**Monto del Impuesto o Retencion. */
	MontoImp: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TasaImp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TasaImp = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TipoImp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoImp = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MontoImp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MontoImp = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Tipo de Impuesto o Retencion Adicional de los DTE. */
export enum ImpAdicDTEType {
	IVAMargenComercializacionFacturaVentadelContribuyenteF29C039 = 14,
	IVARetenidoTotalFacturaCompradelContribuyenteF29C039 = 15,
	IVARetenidoParcialFacturaCompradelContribuyenteF29 = 16,
	IVAAnticipadoFaenamientoCarneF29C042 = 17,
	IVAAnticipadoCarneF29C042 = 18,
	IVAAnticipadoHarinaF29C042 = 19,
	ImpuestoAdicionalProductosArt37abcOroJoyasPielesF29C113 = 23,
	ImpuestoArt42aLicoresPiscoDestiladosF29C148 = 24,
	ImpuestoArt42cVinos = 25,
	ImpuestoArt42cCervezasyBebidasAlcoholicasF29C150 = 26,
	ImpuestoArt42dyeBebidasAnalcoholicasyMineralesF29C146 = 27,
	ImpuestoEspecificoDieselF29C127 = 28,
	IVARetenidoLegumbres = 30,
	IVARetenidoSilvestres = 31,
	IVARetenidoGanado = 32,
	IVARetenidoMadera = 33,
	IVARetenidoTrigo = 34,
	ImpuestoEspecificoGasolina = 35,
	IVARetenidoArroz = 36,
	IVARetenidoHidrobiologicas = 37,
	IVARetenidoChatarra = 38,
	IVARetenidoPPA = 39,
	IVARetenidoOpcional = 40,
	IVARetenidoConstruccion = 41,
	ImpuestoAdicionalProductosArt37ehil1raVentaAlfombrasCRodantesCaviarArmasF29C113 = 44,
	ImpuestoAdicionalProductosArt37j1raVentaPirotecniaF29C113 = 45,
	N_46 = 46,
	N_47 = 47,
	N_48 = 48,
	N_49 = 49,
	N_50 = 50,
	N_51 = 51,
	N_52 = 52,
	N_53 = 53,
	N_301 = 301,
	N_321 = 321,
	N_331 = 331,
	N_341 = 341,
	N_361 = 361,
	N_371 = 371,
	N_481 = 481,
}
/**Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
export class DocumentoComisionesTotales {
	/**Opcional. Valor Neto Comisiones y Otros Cargos. */
	ValComNeto: number
	/**Opcional. Val. Comis. y Otros Cargos no Afectos o Exentos. */
	ValComExe: number
	/**Opcional. Valor IVA Comisiones y Otros Cargos  . */
	ValComIVA: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('ValComNeto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComNeto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValComExe')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComExe = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValComIVA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComIVA = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Otra Moneda . */
export class DocumentoOtraMoneda {
	/**Tipo Ottra moneda Tabla de Monedas  de Aduanas. */
	TpoMoneda: TipMonType
	/**Opcional. Tipo de Cambio fijado por el Banco Central de Chile. */
	TpoCambio: number
	/**Opcional. Monto Neto del DTE en Otra Moneda  . */
	MntNetoOtrMnda: number
	/**Opcional. Monto Exento del DTE en Otra Moneda  . */
	MntExeOtrMnda: number
	/**Opcional. Monto Base Faenamiento Carne en Otra Moneda  . */
	MntFaeCarneOtrMnda: number
	/**Opcional. Monto Base de Márgenes de Comercialización. Monto informado. */
	MntMargComOtrMnda: number
	/**Opcional. Monto de IVA del DTE en Otra Moneda. */
	IVAOtrMnda: number
	/**Opcional. Impuestos y Retenciones Adicionales. */
	ImpRetOtrMnda: DocumentoImpRetOtrMnda[]
	/**Opcional. IVA no retenido Otra Moneda . */
	IVANoRetOtrMnda: number
	/**Monto Total Otra Moneda. */
	MntTotOtrMnda: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TpoMoneda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoMoneda = <TipMonType>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TpoCambio')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoCambio = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntNetoOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntNetoOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntExeOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntExeOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntFaeCarneOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntFaeCarneOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntMargComOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntMargComOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IVAOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IVAOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ImpRetOtrMnda');
		if(nd.length > 0) {
			this.ImpRetOtrMnda = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.ImpRetOtrMnda.push(new DocumentoImpRetOtrMnda());
					this.ImpRetOtrMnda[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('IVANoRetOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IVANoRetOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntTotOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntTotOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
	}

}

export type TipMonType = 'BOLIVAR' | 'BOLIVIANO' | 'CHELIN' | 'CORONA DIN' | 'CORONA NOR' | 'CORONA SC' | 'CRUZEIRO REAL' | 'DIRHAM' | 'DOLAR AUST' | 'DOLAR CAN' | 'DOLAR HK' | 'DOLAR NZ' | 'DOLAR SIN' | 'DOLAR TAI' | 'DOLAR USA' | 'DRACMA' | 'ESCUDO' | 'EURO' | 'FLORIN' | 'FRANCO BEL' | 'FRANCO FR' | 'FRANCO SZ' | 'GUARANI' | 'LIBRA EST' | 'LIRA' | 'MARCO AL' | 'MARCO FIN' | 'NUEVO SOL' | 'OTRAS MONEDAS' | 'PESETA' | 'PESO' | 'PESO CL' | 'PESO COL' | 'PESO MEX' | 'PESO URUG' | 'RAND' | 'RENMINBI' | 'RUPIA' | 'SUCRE' | 'YEN' 

/**Impuestos y Retenciones Adicionales. */
export class DocumentoImpRetOtrMnda {
	/**Tipo de Impuesto o Retencion Adicional. */
	TipoImpOtrMnda: ImpAdicDTEType
	/**Opcional. Tasa de Impuesto o Retencion. */
	TasaImpOtrMnda: number
	/**Valor del impuesto o retención en otra moneda . */
	VlrImpOtrMnda: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TipoImpOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoImpOtrMnda = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TasaImpOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TasaImpOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('VlrImpOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.VlrImpOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Detalle de Itemes del Documento. */
export class DocumentoDetalle {
	/**Numero Secuencial de Linea. */
	NroLinDet: number
	/**Opcional. Codificacion del Item. */
	CdgItem: DocumentoCdgItem[]
	/**Opcional. Indicador de Exencion/Facturacion. */
	IndExe: DocumentoIndExe
	/**Opcional. Sólo para transacciones realizadas por agentes retenedores. */
	Retenedor: DocumentoRetenedor
	/**Nombre del Item. */
	NmbItem: string
	/**Opcional. Descripcion del Item. */
	DscItem: string
	/**Opcional. Cantidad para la Unidad de Medida de Referencia. */
	QtyRef: number
	/**Opcional. Unidad de Medida de Referencia. */
	UnmdRef: string
	/**Opcional. Precio Unitario de Referencia para Unidad de Referencia. */
	PrcRef: number
	/**Opcional. Cantidad del Item. */
	QtyItem: number
	/**Opcional. Distribucion de la Cantidad. */
	Subcantidad: DocumentoSubcantidad[]
	/**Opcional. Fecha Elaboracion del Item. */
	FchElabor: Date
	/**Opcional. Fecha Vencimiento del Item. */
	FchVencim: Date
	/**Opcional. Unidad de Medida. */
	UnmdItem: string
	/**Opcional. Precio Unitario del Item en Pesos. */
	PrcItem: number
	/**Opcional. Precio del Item en Otra Moneda. */
	OtrMnda: DocumentoOtrMnda
	/**Opcional. Porcentaje de Descuento. */
	DescuentoPct: number
	/**Opcional. Monto de Descuento. */
	DescuentoMonto: number
	/**Opcional. Desglose del Descuento. */
	SubDscto: DocumentoSubDscto[]
	/**Opcional. Porcentaje de Recargo. */
	RecargoPct: number
	/**Opcional. Monto de Recargo. */
	RecargoMonto: number
	/**Opcional. Desglose del Recargo. */
	SubRecargo: DocumentoSubRecargo[]
	/**Opcional. Codigo de Impuesto Adicional o Retencion. */
	CodImpAdic: ImpAdicDTEType[]
	/**Monto por Linea de Detalle. Corresponde al Monto Neto, a menos que MntBruto Indique lo Contrario . */
	MontoItem: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinDet')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroLinDet = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IndExe')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndExe = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('NmbItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NmbItem = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DscItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DscItem = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('UnmdRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.UnmdRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('UnmdItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.UnmdItem = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RecargoPct')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RecargoPct = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CdgItem');
		if(nd.length > 0) {
			this.CdgItem = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.CdgItem.push(new DocumentoCdgItem());
					this.CdgItem[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('Retenedor');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Retenedor = new DocumentoRetenedor();
				this.Retenedor.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('QtyRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.QtyRef = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PrcRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PrcRef = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('QtyItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.QtyItem = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('Subcantidad');
		if(nd.length > 0) {
			this.Subcantidad = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Subcantidad.push(new DocumentoSubcantidad());
					this.Subcantidad[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('FchElabor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchElabor = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FchVencim')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchVencim = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PrcItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PrcItem = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('OtrMnda');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.OtrMnda = new DocumentoOtrMnda();
				this.OtrMnda.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('DescuentoPct')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DescuentoPct = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('DescuentoMonto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DescuentoMonto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubDscto');
		if(nd.length > 0) {
			this.SubDscto = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.SubDscto.push(new DocumentoSubDscto());
					this.SubDscto[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('RecargoMonto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RecargoMonto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubRecargo');
		if(nd.length > 0) {
			this.SubRecargo = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.SubRecargo.push(new DocumentoSubRecargo());
					this.SubRecargo[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('CodImpAdic')
		if(nd.length > 0) {
			this.CodImpAdic = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.CodImpAdic.push(parseInt(nd[i].textContent));
		}

		nd = Node.getElementsByTagName('MontoItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MontoItem = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/***/
export enum DocumentoIndExe {
	ElProductooServicioNOESTAAfectoaIVA = 1,
	ElProductooServicioNOESFacturable = 2,
	GarantiaporDepositoEnvase = 3,
	ElproductoNoConstituyeVenta = 4,
	ItemaRebajar = 5,
	Nofacturablesnegativos = 6,
}
/**Codificacion del Item. */
export class DocumentoCdgItem {
	/**Tipo de Codificacion. */
	TpoCodigo: string
	/**Valor del Codigo de Item, para la Codificacion Particular. */
	VlrCodigo: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TpoCodigo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoCodigo = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('VlrCodigo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.VlrCodigo = nd[i].textContent;
				break;
			}
	}

}

/**Sólo para transacciones realizadas por agentes retenedores. */
export class DocumentoRetenedor {
	/**Indicador Agente Retenedor. */
	IndAgente: DocumentoIndAgente
	/**Opcional. Monto Base Faenamiento. */
	MntBaseFaena: number
	/**Opcional. Márgenes de Comercialización. */
	MntMargComer: number
	/**Opcional. Precio Unitario Neto Consumidor Final. */
	PrcConsFinal: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('IndAgente')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndAgente = <DocumentoIndAgente>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('MntBaseFaena')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntBaseFaena = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntMargComer')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntMargComer = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PrcConsFinal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PrcConsFinal = parseFloat(nd[i].textContent);
				break;
			}
	}

}

export type DocumentoIndAgente = 'R' 

/**Distribucion de la Cantidad. */
export class DocumentoSubcantidad {
	/**Cantidad  Distribuida. */
	SubQty: number
	/**Codigo Descriptivo de la Subcantidad. */
	SubCod: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('SubCod')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubCod = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('SubQty')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubQty = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Precio del Item en Otra Moneda. */
export class DocumentoOtrMnda {
	/**Precio Unitario en Otra Moneda. */
	PrcOtrMon: number
	/**Codigo de Otra Moneda (Usar Codigos de Moneda del Banco Central). */
	Moneda: string
	/**Opcional. Factor  para Conversion a Pesos. */
	FctConv: number
	/**Opcional. Descuento en Otra Moneda . */
	DctoOtrMnda: number
	/**Opcional. Recargo en Otra Moneda. */
	RecargoOtrMnda: number
	/**Opcional. Valor por línea de detalle en Otra Moneda. */
	MontoItemOtrMnda: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('Moneda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Moneda = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('PrcOtrMon')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PrcOtrMon = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FctConv')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FctConv = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('DctoOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DctoOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RecargoOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RecargoOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MontoItemOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MontoItemOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Desglose del Descuento. */
export class DocumentoSubDscto {
	/**Tipo de SubDescuento. */
	TipoDscto: DineroPorcentajeType
	/**Valor del SubDescuento. */
	ValorDscto: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TipoDscto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoDscto = <DineroPorcentajeType>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('ValorDscto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValorDscto = parseFloat(nd[i].textContent);
				break;
			}
	}

}

export type DineroPorcentajeType = '%' | '$' 

/**Desglose del Recargo. */
export class DocumentoSubRecargo {
	/**Tipo de SubRecargo. */
	TipoRecargo: DineroPorcentajeType
	/**Valor de SubRecargo. */
	ValorRecargo: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TipoRecargo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoRecargo = <DineroPorcentajeType>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('ValorRecargo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValorRecargo = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Subtotales Informativos. */
export class DocumentoSubTotInfo {
	/**Número de Subtotal . */
	NroSTI: number
	/**Glosa. */
	GlosaSTI: string
	/**Opcional. Ubicación para Impresión . */
	OrdenSTI: number
	/**Opcional. Valor Neto del Subtotal. */
	SubTotNetoSTI: number
	/**Opcional. Valor del IVA del Subtotal. */
	SubTotIVASTI: number
	/**Opcional. Valor de los Impuestos adicionales o específicos del Subtotal. */
	SubTotAdicSTI: number
	/**Opcional. Valor no Afecto o Exento del Subtotal. */
	SubTotExeSTI: number
	/**Opcional. Valor de la línea de subtotal. */
	ValSubtotSTI: number
	/**Opcional. TABLA de  Líneas de Detalle que se agrupan en el Subtotal. */
	LineasDeta: number[]
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('GlosaSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GlosaSTI = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('OrdenSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.OrdenSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('LineasDeta')
		if(nd.length > 0) {
			this.LineasDeta = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.LineasDeta.push(parseFloat(nd[i].textContent));
		}

		nd = Node.getElementsByTagName('SubTotNetoSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotNetoSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubTotIVASTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotIVASTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubTotAdicSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotAdicSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubTotExeSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotExeSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValSubtotSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValSubtotSTI = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Descuentos y/o Recargos que afectan al total del Documento. */
export class DocumentoDscRcgGlobal {
	/**Numero Secuencial de Linea. */
	NroLinDR: number
	/**Tipo de Movimiento. */
	TpoMov: DocumentoTpoMov
	/**Opcional. Descripcion del Descuento o Recargo. */
	GlosaDR: string
	/**Unidad en que se Expresa el Valor. */
	TpoValor: DineroPorcentajeType
	/**Valor del Descuento o Recargo. */
	ValorDR: number
	/**Opcional. Valor en otra moneda. */
	ValorDROtrMnda: number
	/**Opcional. Indica si el D/R es No Afecto o No Facturable. */
	IndExeDR: DocumentoIndExeDR
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinDR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroLinDR = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoMov')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoMov = <DocumentoTpoMov>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('GlosaDR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GlosaDR = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IndExeDR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndExeDR = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoValor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoValor = <DineroPorcentajeType>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('ValorDR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValorDR = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValorDROtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValorDROtrMnda = parseFloat(nd[i].textContent);
				break;
			}
	}

}

export type DocumentoTpoMov = 'D' | 'R' 

/***/
export enum DocumentoIndExeDR {
	DescuentoRecargoGlobalNoAfecto = 1,
	DescuentoRecargoNoFacturable = 2,
}
/**Identificacion de otros documentos Referenciados por Documento. */
export class DocumentoReferencia {
	/**Numero Secuencial de Linea de Referencia. */
	NroLinRef: number
	/**Tipo de Documento de Referencia. */
	TpoDocRef: string
	/**Opcional. Indica que se esta Referenciando un Conjunto de Documentos. */
	IndGlobal: DocumentoIndGlobal
	/**Folio del Documento de Referencia. */
	FolioRef: string
	/**Opcional. RUT Otro Contribuyente. */
	RUTOtr: string
	/**Fecha de la Referencia. */
	FchRef: Date
	/**Opcional. Tipo de Uso de la Referencia. */
	CodRef: DocumentoCodRef
	/**Opcional. Razon Explicita por la que se Referencia el Documento. */
	RazonRef: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroLinRef = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoDocRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoDocRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IndGlobal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndGlobal = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodRef = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RazonRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RazonRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FolioRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FolioRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTOtr')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTOtr = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FchRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchRef = new Date(nd[i].textContent);
				break;
			}
	}

}

/***/
export enum DocumentoIndGlobal {
	ElDocumentohaceReferenciaaunConjuntodeDocumentosTributariosdelMismoTipo = 1,
}
/***/
export enum DocumentoCodRef {
	AnulaDocumentodeReferencia = 1,
	CorrigeTextodelDocumentodeReferencia = 2,
	CorrigeMontos = 3,
}
/**Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
export class DocumentoComisiones {
	/**Numero Secuencial de Linea. */
	NroLinCom: number
	/**C (comisión) u O (otros cargos). */
	TipoMovim: DocumentoTipoMovim
	/**Especificación de la comisión u otro  cargo. */
	Glosa: string
	/**Opcional. Valor porcentual de la comisión u otro cargo. */
	TasaComision: number
	/**Valor Neto Comisiones y Otros Cargos. */
	ValComNeto: number
	/**Val. Comis. y Otros Cargos no Afectos o Exentos. */
	ValComExe: number
	/**Opcional. Valor IVA Comisiones y Otros Cargos  . */
	ValComIVA: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinCom')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroLinCom = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TipoMovim')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoMovim = <DocumentoTipoMovim>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Glosa')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Glosa = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TasaComision')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TasaComision = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValComNeto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComNeto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValComExe')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComExe = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValComIVA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComIVA = parseFloat(nd[i].textContent);
				break;
			}
	}

}

export type DocumentoTipoMovim = 'C' | 'O' 

/**Timbre Electronico de DTE. */
export class DocumentoTED {
	
	version: string = "1.0"
	/**Datos Basicos de Documento. */
	DD: DocumentoDD
	/**Valor de Firma Digital  sobre DD. */
	FRMT: DocumentoFRMT
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('version')) this.version = <string>Node.getAttribute('version');
		nd = Node.getElementsByTagName('DD');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DD = new DocumentoDD();
				this.DD.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('FRMT');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FRMT = new DocumentoFRMT();
				this.FRMT.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Datos Basicos de Documento. */
export class DocumentoDD {
	/**RUT Emisor. */
	RE: string
	/**Tipo DTE. */
	TD: DTEType
	/**Folio DTE. */
	F: number
	/**Fecha Emision DTE en Formato AAAA-MM-DD. */
	FE: Date
	/**RUT Receptor. */
	RR: string
	/**Razon Social Receptor. */
	RSR: string
	/**Monto Total DTE. */
	MNT: number
	/**Descripcion Primer Item de Detalle. */
	IT1: string
	/**Codigo Autorizacion Folios. */
	CAF: DocumentoCAF
	/**TimeStamp de Generacion del Timbre. */
	TSTED: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('RSR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RSR = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('MNT')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MNT = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IT1')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IT1 = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RE = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TD')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TD = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('F')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.F = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FE = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RR = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CAF');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CAF = new DocumentoCAF();
				this.CAF.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('TSTED')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TSTED = new Date(nd[i].textContent);
				break;
			}
	}

}

/**Codigo Autorizacion Folios. */
export class DocumentoCAF {
	
	version: string = "1.0"
	/**Datos de Autorizacion de Folios. */
	DA: DocumentoDA
	/**Firma Digital (RSA) del SII Sobre DA. */
	FRMA: DocumentoFRMA
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('version')) this.version = <string>Node.getAttribute('version');
		nd = Node.getElementsByTagName('DA');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DA = new DocumentoDA();
				this.DA.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('FRMA');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FRMA = new DocumentoFRMA();
				this.FRMA.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Datos de Autorizacion de Folios. */
export class DocumentoDA {
	/**RUT Emisor. */
	RE: string
	/**Razon Social Emisor. */
	RS: string
	/**Tipo DTE. */
	TD: DTEType
	/**Rango Autorizado de Folios. */
	RNG: DocumentoRNG
	/**Fecha Autorizacion en Formato AAAA-MM-DD. */
	FA: Date
	/**Opcional. Clave Publica RSA del Solicitante. */
	RSAPK: DocumentoRSAPK
	/**Opcional. Clave Publica DSA del Solicitante. */
	DSAPK: DocumentoDSAPK
	/**Identificador de Llave. */
	IDK: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('RS')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RS = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IDK')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IDK = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RE = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TD')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TD = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RNG');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RNG = new DocumentoRNG();
				this.RNG.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('FA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FA = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RSAPK');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RSAPK = new DocumentoRSAPK();
				this.RSAPK.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('DSAPK');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DSAPK = new DocumentoDSAPK();
				this.DSAPK.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Rango Autorizado de Folios. */
export class DocumentoRNG {
	/**Folio Inicial (Desde). */
	D: number
	/**Folio Final (Hasta). */
	H: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('D')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.D = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('H')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.H = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Clave Publica RSA del Solicitante. */
export class DocumentoRSAPK {
	/**Modulo RSA. */
	M: string
	/**Exponente RSA. */
	E: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('M')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.M = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('E')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.E = nd[i].textContent;
				break;
			}
	}

}

/**Clave Publica DSA del Solicitante. */
export class DocumentoDSAPK {
	/**Modulo Primo. */
	P: string
	/**Entero Divisor de P - 1. */
	Q: string
	/**Entero f(P, Q). */
	G: string
	/**G**X mod P. */
	Y: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('P')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.P = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Q')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Q = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('G')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.G = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Y')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Y = nd[i].textContent;
				break;
			}
	}

}

/**Firma Digital (RSA) del SII Sobre DA. */
export class DocumentoFRMA {
	
	algoritmo: string = "SHA1withRSA"
	/**Opcional. */
	valor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('algoritmo')) this.algoritmo = <string>Node.getAttribute('algoritmo');
		this.valor = Node.textContent || '';
	}

}

/**Valor de Firma Digital  sobre DD. */
export class DocumentoFRMT {
	
	algoritmo: Documentoalgoritmo
	/**Opcional. */
	valor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('algoritmo')) this.algoritmo = <Documentoalgoritmo>Node.getAttribute('algoritmo');
		this.valor = Node.textContent || '';
	}

}

export type Documentoalgoritmo = 'SHA1withRSA' | 'SHA1withDSA' 

/**Informacion Tributaria de Liquidaciones. */
export class Liquidacion {
	
	ID: string
	/**Identificacion y Totales del Documento. */
	Encabezado: LiquidacionEncabezado
	/**Detalle de Itemes del Documento. */
	Detalle: LiquidacionDetalle[]
	/**Opcional. Subtotales Informativos. */
	SubTotInfo: LiquidacionSubTotInfo[]
	/**Opcional. Identificacion de otros documentos Referenciados por Documento. */
	Referencia: LiquidacionReferencia[]
	/**Opcional. Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
	Comisiones: LiquidacionComisiones[]
	/**Timbre Electronico de DTE. */
	TED: LiquidacionTED
	/**Fecha y Hora en que se Firmo Digitalmente el Documento AAAA-MM-DDTHH:MI:SS. */
	TmstFirma: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('ID')) this.ID = <string>Node.getAttribute('ID');
		nd = Node.getElementsByTagName('Encabezado');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Encabezado = new LiquidacionEncabezado();
				this.Encabezado.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Detalle');
		if(nd.length > 0) {
			this.Detalle = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Detalle.push(new LiquidacionDetalle());
					this.Detalle[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('SubTotInfo');
		if(nd.length > 0) {
			this.SubTotInfo = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.SubTotInfo.push(new LiquidacionSubTotInfo());
					this.SubTotInfo[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('Referencia');
		if(nd.length > 0) {
			this.Referencia = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Referencia.push(new LiquidacionReferencia());
					this.Referencia[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('Comisiones');
		if(nd.length > 0) {
			this.Comisiones = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Comisiones.push(new LiquidacionComisiones());
					this.Comisiones[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('TED');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TED = new LiquidacionTED();
				this.TED.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('TmstFirma')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TmstFirma = new Date(nd[i].textContent);
				break;
			}
	}

}

/**Identificacion y Totales del Documento. */
export class LiquidacionEncabezado {
	/**Identificacion del DTE. */
	IdDoc: LiquidacionIdDoc
	/**Datos del Emisor. */
	Emisor: LiquidacionEmisor
	/**Datos del Receptor. */
	Receptor: LiquidacionReceptor
	/**Montos Totales del DTE. */
	Totales: LiquidacionTotales
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('IdDoc');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdDoc = new LiquidacionIdDoc();
				this.IdDoc.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Emisor');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Emisor = new LiquidacionEmisor();
				this.Emisor.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Receptor');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Receptor = new LiquidacionReceptor();
				this.Receptor.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Totales');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Totales = new LiquidacionTotales();
				this.Totales.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Identificacion del DTE. */
export class LiquidacionIdDoc {
	/**Tipo de DTE. */
	TipoDTE: LIQType
	/**Folio del Documento Electronico. */
	Folio: number
	/**Fecha Emision Contable del DTE (AAAA-MM-DD). */
	FchEmis: Date
	/**Opcional. Indica si Transaccion Corresponde a la Prestacion de un Servicio. */
	IndServicio: LiquidacionIndServicio
	/**Opcional. Indica el Uso de Montos Brutos en Detalle. */
	MntBruto: LiquidacionMntBruto
	/**Opcional. Forma de Pago del DTE. */
	FmaPago: LiquidacionFmaPago
	/**Opcional. Fecha de Cancelacion del DTE (AAAA-MM-DD). */
	FchCancel: Date
	/**Opcional. Monto Cancelado al   emitirse el documento. */
	MntCancel: number
	/**Opcional. Saldo Insoluto al       emitirse el documento. */
	SaldoInsol: number
	/**Opcional. Tabla de Montos de Pago. */
	MntPagos: LiquidacionMntPagos[]
	/**Opcional. Periodo de Facturacion - Desde (AAAA-MM-DD). */
	PeriodoDesde: Date
	/**Opcional. Periodo Facturacion - Hasta (AAAA-MM-DD). */
	PeriodoHasta: Date
	/**Opcional. Medio de Pago. */
	MedioPago: MedioPagoType
	/**Opcional. Tipo Cuenta de Pago. */
	TpoCtaPago: LiquidacionTpoCtaPago
	/**Opcional. Número de la cuenta del pago. */
	NumCtaPago: string
	/**Opcional. Banco donde se realiza el pago. */
	BcoPago: string
	/**Opcional. Codigo del Termino de Pago Acordado. */
	TermPagoCdg: string
	/**Opcional. Términos del Pago - glosa. */
	TermPagoGlosa: string
	/**Opcional. Dias de Acuerdo al Codigo de Termino de Pago. */
	TermPagoDias: number
	/**Opcional. Fecha de Vencimiento del Pago (AAAA-MM-DD). */
	FchVenc: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('IndServicio')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndServicio = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntBruto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntBruto = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FmaPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FmaPago = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoCtaPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoCtaPago = <LiquidacionTpoCtaPago>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('NumCtaPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NumCtaPago = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('BcoPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.BcoPago = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TermPagoCdg')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TermPagoCdg = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TermPagoGlosa')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TermPagoGlosa = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TermPagoDias')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TermPagoDias = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TipoDTE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoDTE = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('Folio')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Folio = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FchEmis')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchEmis = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FchCancel')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchCancel = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntCancel')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntCancel = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SaldoInsol')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SaldoInsol = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntPagos');
		if(nd.length > 0) {
			this.MntPagos = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.MntPagos.push(new LiquidacionMntPagos());
					this.MntPagos[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('PeriodoDesde')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PeriodoDesde = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PeriodoHasta')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PeriodoHasta = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MedioPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MedioPago = <MedioPagoType>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FchVenc')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchVenc = new Date(nd[i].textContent);
				break;
			}
	}

}

/***/
export enum LiquidacionIndServicio {
	FacturaciondeServiciosPeriodicosDomiciliarios = 1,
	FacturaciondeOtrosServiciosPeriodicos = 2,
	FacturadeServicio = 3,
}
/***/
export enum LiquidacionMntBruto {
	MontodeLineasdeDetalleCorrespondeaValoresBrutosIVAImpuestosAdicionales = 1,
}
/***/
export enum LiquidacionFmaPago {
	PagoContado = 1,
	PagoCredito = 2,
	SinCosto = 3,
}
export type LiquidacionTpoCtaPago = 'AHORRO' | 'CORRIENTE' | 'VISTA' 

/**Tipos de Liquidaciones . */
export enum LIQType {
	N_43 = 43,
}
/**Tabla de Montos de Pago. */
export class LiquidacionMntPagos {
	/**Fecha de Pago (AAAA-MM-DD). */
	FchPago: Date
	/**Monto de Pago. */
	MntPago: number
	/**Opcional. */
	GlosaPagos: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('GlosaPagos')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GlosaPagos = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FchPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchPago = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntPago = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Datos del Emisor. */
export class LiquidacionEmisor {
	/**RUT del Emisor del DTE. */
	RUTEmisor: string
	/**Nombre o Razon Social del Emisor. */
	RznSoc: string
	/**Giro Comercial del Emisor Relevante para el DTE . */
	GiroEmis: string
	/**Opcional. Telefono Emisor . */
	Telefono: string[]
	/**Opcional. Correo Elect. de contacto en empresa del  receptor . */
	CorreoEmisor: string
	/**Codigo de Actividad Economica del Emisor Relevante para el DTE. */
	Acteco: number[]
	/**Opcional. Sucursal que Emite el DTE. */
	Sucursal: string
	/**Opcional. Codigo de Sucursal Entregado por el SII. */
	CdgSIISucur: number
	/**Direccion de Origen. */
	DirOrigen: string
	/**Opcional. Comuna de Origen. */
	CmnaOrigen: string
	/**Opcional. Ciudad de Origen. */
	CiudadOrigen: string
	/**Opcional. Codigo del Vendedor. */
	CdgVendedor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('RznSoc')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RznSoc = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('GiroEmis')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GiroEmis = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Telefono')
		if(nd.length > 0) {
			this.Telefono = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.Telefono.push(nd[i].textContent);
		}

		nd = Node.getElementsByTagName('Acteco')
		if(nd.length > 0) {
			this.Acteco = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.Acteco.push(parseFloat(nd[i].textContent));
		}

		nd = Node.getElementsByTagName('Sucursal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Sucursal = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CdgSIISucur')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CdgSIISucur = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('DirOrigen')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirOrigen = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CdgVendedor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CdgVendedor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTEmisor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTEmisor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CorreoEmisor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CorreoEmisor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CmnaOrigen')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaOrigen = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadOrigen')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadOrigen = nd[i].textContent;
				break;
			}
	}

}

/**Datos del Receptor. */
export class LiquidacionReceptor {
	/**RUT del Receptor del DTE. */
	RUTRecep: string
	/**Opcional. Codigo Interno del Receptor. */
	CdgIntRecep: string
	/**Nombre o Razon Social del Receptor. */
	RznSocRecep: string
	/**Giro Comercial del Receptor. */
	GiroRecep: string
	/**Opcional. Glosa con nombre o teléfono de contacto en empresa del  receptor . */
	Contacto: string
	/**Opcional. Correo Elect. de contacto en empresa del  receptor . */
	CorreoRecep: string
	/**Direccion en la Cual se Envian los Productos o se Prestan los Servicios. */
	DirRecep: string
	/**Comuna de Recepcion. */
	CmnaRecep: string
	/**Opcional. Ciudad de Recepcion. */
	CiudadRecep: string
	/**Opcional. Direccion Postal. */
	DirPostal: string
	/**Opcional. Comuna Postal. */
	CmnaPostal: string
	/**Opcional. Ciudad Postal. */
	CiudadPostal: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('CdgIntRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CdgIntRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('GiroRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GiroRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Contacto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Contacto = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DirRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DirPostal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirPostal = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RznSocRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RznSocRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CorreoRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CorreoRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CmnaRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CmnaPostal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaPostal = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadPostal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadPostal = nd[i].textContent;
				break;
			}
	}

}

/**Montos Totales del DTE. */
export class LiquidacionTotales {
	/**Opcional. Monto Neto del DTE. */
	MntNeto: number
	/**Opcional. Monto Exento del DTE. */
	MntExe: number
	/**Opcional. Tasa de IVA. */
	TasaIVA: number
	/**Opcional. Monto de IVA del DTE. */
	IVA: number
	/**Opcional. Monto del IVA propio. */
	IVAProp: number
	/**Opcional. Monto del IVA de Terceros. */
	IVATerc: number
	/**Opcional. Impuestos y Retenciones Adicionales. */
	ImptoReten: LiquidacionImptoReten[]
	/**Opcional. Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
	Comisiones: LiquidacionComisionesTotales
	/**Monto Total del DTE. */
	MntTotal: number
	/**Opcional. Total de Ventas o Servicios del Periodo. */
	MontoPeriodo: number
	/**Opcional. Saldo Anterior - Puede ser Negativo o Positivo. */
	SaldoAnterior: number
	/**Opcional. Valor a Pagar Total del documento. */
	VlrPagar: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('MntNeto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntNeto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntExe')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntExe = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TasaIVA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TasaIVA = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IVA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IVA = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IVAProp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IVAProp = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IVATerc')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IVATerc = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ImptoReten');
		if(nd.length > 0) {
			this.ImptoReten = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.ImptoReten.push(new LiquidacionImptoReten());
					this.ImptoReten[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('Comisiones');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Comisiones = new LiquidacionComisionesTotales();
				this.Comisiones.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('MntTotal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntTotal = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MontoPeriodo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MontoPeriodo = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SaldoAnterior')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SaldoAnterior = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('VlrPagar')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.VlrPagar = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Impuestos y Retenciones Adicionales. */
export class LiquidacionImptoReten {
	/**Tipo de Impuesto o Retencion Adicional. */
	TipoImp: ImpAdicDTEType
	/**Opcional. Tasa de Impuesto o Retencion. */
	TasaImp: number
	/**Monto del Impuesto o Retencion. */
	MontoImp: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TipoImp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoImp = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TasaImp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TasaImp = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MontoImp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MontoImp = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
export class LiquidacionComisionesTotales {
	/**Opcional. Valor Neto Comisiones y Otros Cargos. */
	ValComNeto: number
	/**Opcional. Val. Comis. y Otros Cargos no Afectos o Exentos. */
	ValComExe: number
	/**Opcional. Valor IVA Comisiones y Otros Cargos  . */
	ValComIVA: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('ValComNeto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComNeto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValComExe')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComExe = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValComIVA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComIVA = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Detalle de Itemes del Documento. */
export class LiquidacionDetalle {
	/**Numero Secuencial de Linea. */
	NroLinDet: number
	/**Opcional. Codificacion del Item. */
	CdgItem: LiquidacionCdgItem[]
	/**Tipo de Documento que se Liquida. */
	TpoDocLiq: string
	/**Opcional. Indicador de Exencion/Facturacion. */
	IndExe: LiquidacionIndExe
	/**Nombre del Item. */
	NmbItem: string
	/**Opcional. Descripcion del Item. */
	DscItem: string
	/**Opcional. Cantidad para la Unidad de Medida de Referencia. */
	QtyRef: number
	/**Opcional. Unidad de Medida de Referencia. */
	UnmdRef: string
	/**Opcional. Precio Unitario de Referencia para Unidad de Referencia. */
	PrcRef: number
	/**Opcional. Cantidad del Item. */
	QtyItem: number
	/**Opcional. Distribucion de la Cantidad. */
	Subcantidad: LiquidacionSubcantidad[]
	/**Opcional. Fecha Elaboracion del Item. */
	FchElabor: Date
	/**Opcional. Fecha Vencimiento del Item. */
	FchVencim: Date
	/**Opcional. Unidad de Medida. */
	UnmdItem: string
	/**Opcional. Precio Unitario del Item en Pesos. */
	PrcItem: number
	/**Opcional. Codigo de Impuesto Adicional o Retencion. */
	CodImpAdic: ImpAdicDTEType[]
	/**Monto por Linea de Detalle. Corresponde al Monto Neto, a menos que MntBruto Indique lo Contrario . */
	MontoItem: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinDet')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroLinDet = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoDocLiq')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoDocLiq = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IndExe')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndExe = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('NmbItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NmbItem = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DscItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DscItem = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('UnmdRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.UnmdRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('UnmdItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.UnmdItem = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CdgItem');
		if(nd.length > 0) {
			this.CdgItem = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.CdgItem.push(new LiquidacionCdgItem());
					this.CdgItem[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('QtyRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.QtyRef = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PrcRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PrcRef = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('QtyItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.QtyItem = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('Subcantidad');
		if(nd.length > 0) {
			this.Subcantidad = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Subcantidad.push(new LiquidacionSubcantidad());
					this.Subcantidad[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('FchElabor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchElabor = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FchVencim')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchVencim = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PrcItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PrcItem = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodImpAdic')
		if(nd.length > 0) {
			this.CodImpAdic = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.CodImpAdic.push(parseInt(nd[i].textContent));
		}

		nd = Node.getElementsByTagName('MontoItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MontoItem = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/***/
export enum LiquidacionIndExe {
	ElProductooServicioNOESTAAfectoaIVA = 1,
	ElProductooServicioNOESFacturable = 2,
	GarantiaporDepositoEnvase = 3,
	ElproductoNoConstituyeVenta = 4,
	ItemaRebajar = 5,
	Nofacturablesnegativos = 6,
}
/**Codificacion del Item. */
export class LiquidacionCdgItem {
	/**Tipo de Codificacion. */
	TpoCodigo: string
	/**Valor del Codigo de Item, para la Codificacion Particular. */
	VlrCodigo: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TpoCodigo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoCodigo = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('VlrCodigo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.VlrCodigo = nd[i].textContent;
				break;
			}
	}

}

/**Distribucion de la Cantidad. */
export class LiquidacionSubcantidad {
	/**Cantidad  Distribuida. */
	SubQty: number
	/**Codigo Descriptivo de la Subcantidad. */
	SubCod: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('SubCod')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubCod = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('SubQty')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubQty = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Subtotales Informativos. */
export class LiquidacionSubTotInfo {
	/**Número de Subtotal . */
	NroSTI: number
	/**Glosa. */
	GlosaSTI: string
	/**Opcional. Ubicación para Impresión . */
	OrdenSTI: number
	/**Opcional. Valor Neto del Subtotal. */
	SubTotNetoSTI: number
	/**Opcional. Valor del IVA del Subtotal. */
	SubTotIVASTI: number
	/**Opcional. Valor de los Impuestos adicionales o específicos del Subtotal. */
	SubTotAdicSTI: number
	/**Opcional. Valor no Afecto o Exento del Subtotal. */
	SubTotExeSTI: number
	/**Opcional. Valor de la línea de subtotal. */
	ValSubtotSTI: number
	/**Opcional. TABLA de  Líneas de Detalle que se agrupan en el Subtotal. */
	LineasDeta: number[]
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('GlosaSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GlosaSTI = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('OrdenSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.OrdenSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('LineasDeta')
		if(nd.length > 0) {
			this.LineasDeta = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.LineasDeta.push(parseFloat(nd[i].textContent));
		}

		nd = Node.getElementsByTagName('SubTotNetoSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotNetoSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubTotIVASTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotIVASTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubTotAdicSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotAdicSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubTotExeSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotExeSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValSubtotSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValSubtotSTI = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Identificacion de otros documentos Referenciados por Documento. */
export class LiquidacionReferencia {
	/**Numero Secuencial de Linea de Referencia. */
	NroLinRef: number
	/**Tipo de Documento de Referencia. */
	TpoDocRef: string
	/**Opcional. Indica que se esta Referenciando un Conjunto de Documentos. */
	IndGlobal: LiquidacionIndGlobal
	/**Folio del Documento de Referencia. */
	FolioRef: string
	/**Fecha de la Referencia. */
	FchRef: Date
	/**Opcional. Tipo de Uso de la Referencia. */
	CodRef: LiquidacionCodRef
	/**Opcional. Razon Explicita por la que se Referencia el Documento. */
	RazonRef: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroLinRef = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoDocRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoDocRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IndGlobal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndGlobal = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodRef = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RazonRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RazonRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FolioRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FolioRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FchRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchRef = new Date(nd[i].textContent);
				break;
			}
	}

}

/***/
export enum LiquidacionIndGlobal {
	ElDocumentohaceReferenciaaunConjuntodeDocumentosTributariosdelMismoTipo = 1,
}
/***/
export enum LiquidacionCodRef {
	AnulaDocumentodeReferencia = 1,
	CorrigeTextodelDocumentodeReferencia = 2,
	CorrigeMontos = 3,
}
/**Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
export class LiquidacionComisiones {
	/**Numero Secuencial de Linea. */
	NroLinCom: number
	/**C (comisión) u O (otros cargos). */
	TipoMovim: LiquidacionTipoMovim
	/**Especificación de la comisión u otro  cargo. */
	Glosa: string
	/**Opcional. Valor porcentual de la comisión u otro cargo. */
	TasaComision: number
	/**Valor Neto Comisiones y Otros Cargos. */
	ValComNeto: number
	/**Val. Comis. y Otros Cargos no Afectos o Exentos. */
	ValComExe: number
	/**Opcional. Valor IVA Comisiones y Otros Cargos  . */
	ValComIVA: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinCom')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroLinCom = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TipoMovim')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoMovim = <LiquidacionTipoMovim>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Glosa')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Glosa = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TasaComision')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TasaComision = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValComNeto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComNeto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValComExe')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComExe = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValComIVA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValComIVA = parseFloat(nd[i].textContent);
				break;
			}
	}

}

export type LiquidacionTipoMovim = 'C' | 'O' 

/**Timbre Electronico de DTE. */
export class LiquidacionTED {
	
	version: string = "1.0"
	/**Datos Basicos de Documento. */
	DD: LiquidacionDD
	/**Valor de Firma Digital  sobre DD. */
	FRMT: LiquidacionFRMT
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('version')) this.version = <string>Node.getAttribute('version');
		nd = Node.getElementsByTagName('DD');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DD = new LiquidacionDD();
				this.DD.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('FRMT');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FRMT = new LiquidacionFRMT();
				this.FRMT.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Datos Basicos de Documento. */
export class LiquidacionDD {
	/**RUT Emisor. */
	RE: string
	/**Tipo DTE. */
	TD: LIQType
	/**Folio DTE. */
	F: number
	/**Fecha Emision DTE en Formato AAAA-MM-DD. */
	FE: Date
	/**RUT Receptor. */
	RR: string
	/**Razon Social Receptor. */
	RSR: string
	/**Monto Total DTE. */
	MNT: number
	/**Descripcion Primer Item de Detalle. */
	IT1: string
	/**Codigo Autorizacion Folios. */
	CAF: LiquidacionCAF
	/**TimeStamp de Generacion del Timbre. */
	TSTED: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('RSR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RSR = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('MNT')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MNT = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IT1')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IT1 = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RE = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TD')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TD = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('F')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.F = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FE = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RR = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CAF');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CAF = new LiquidacionCAF();
				this.CAF.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('TSTED')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TSTED = new Date(nd[i].textContent);
				break;
			}
	}

}

/**Codigo Autorizacion Folios. */
export class LiquidacionCAF {
	
	version: string = "1.0"
	/**Datos de Autorizacion de Folios. */
	DA: LiquidacionDA
	/**Firma Digital (RSA) del SII Sobre DA. */
	FRMA: LiquidacionFRMA
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('version')) this.version = <string>Node.getAttribute('version');
		nd = Node.getElementsByTagName('DA');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DA = new LiquidacionDA();
				this.DA.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('FRMA');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FRMA = new LiquidacionFRMA();
				this.FRMA.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Datos de Autorizacion de Folios. */
export class LiquidacionDA {
	/**RUT Emisor. */
	RE: string
	/**Razon Social Emisor. */
	RS: string
	/**Tipo DTE. */
	TD: LIQType
	/**Rango Autorizado de Folios. */
	RNG: LiquidacionRNG
	/**Fecha Autorizacion en Formato AAAA-MM-DD. */
	FA: Date
	/**Opcional. Clave Publica RSA del Solicitante. */
	RSAPK: LiquidacionRSAPK
	/**Opcional. Clave Publica DSA del Solicitante. */
	DSAPK: LiquidacionDSAPK
	/**Identificador de Llave. */
	IDK: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('IDK')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IDK = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RE = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RS')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RS = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TD')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TD = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RNG');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RNG = new LiquidacionRNG();
				this.RNG.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('FA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FA = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RSAPK');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RSAPK = new LiquidacionRSAPK();
				this.RSAPK.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('DSAPK');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DSAPK = new LiquidacionDSAPK();
				this.DSAPK.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Rango Autorizado de Folios. */
export class LiquidacionRNG {
	/**Folio Inicial (Desde). */
	D: number
	/**Folio Final (Hasta). */
	H: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('D')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.D = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('H')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.H = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Clave Publica RSA del Solicitante. */
export class LiquidacionRSAPK {
	/**Modulo RSA. */
	M: string
	/**Exponente RSA. */
	E: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('M')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.M = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('E')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.E = nd[i].textContent;
				break;
			}
	}

}

/**Clave Publica DSA del Solicitante. */
export class LiquidacionDSAPK {
	/**Modulo Primo. */
	P: string
	/**Entero Divisor de P - 1. */
	Q: string
	/**Entero f(P, Q). */
	G: string
	/**G**X mod P. */
	Y: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('P')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.P = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Q')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Q = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('G')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.G = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Y')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Y = nd[i].textContent;
				break;
			}
	}

}

/**Firma Digital (RSA) del SII Sobre DA. */
export class LiquidacionFRMA {
	
	algoritmo: string = "SHA1withRSA"
	/**Opcional. */
	valor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('algoritmo')) this.algoritmo = <string>Node.getAttribute('algoritmo');
		this.valor = Node.textContent || '';
	}

}

/**Valor de Firma Digital  sobre DD. */
export class LiquidacionFRMT {
	
	algoritmo: Liquidacionalgoritmo
	/**Opcional. */
	valor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('algoritmo')) this.algoritmo = <Liquidacionalgoritmo>Node.getAttribute('algoritmo');
		this.valor = Node.textContent || '';
	}

}

export type Liquidacionalgoritmo = 'SHA1withRSA' | 'SHA1withDSA' 

/**Informacion Tributaria de exportaciones. */
export class Exportaciones {
	
	ID: string
	/**Identificacion y Totales del Documento. */
	Encabezado: ExportacionesEncabezado
	/**Detalle de Itemes del Documento. */
	Detalle: ExportacionesDetalle[]
	/**Opcional. Subtotales Informativos. */
	SubTotInfo: ExportacionesSubTotInfo[]
	/**Opcional. Descuentos y/o Recargos que afectan al total del Documento. */
	DscRcgGlobal: ExportacionesDscRcgGlobal[]
	/**Opcional. Identificacion de otros documentos Referenciados por Documento. */
	Referencia: ExportacionesReferencia[]
	/**Timbre Electronico de DTE. */
	TED: ExportacionesTED
	/**Fecha y Hora en que se Firmo Digitalmente el Documento AAAA-MM-DDTHH:MI:SS. */
	TmstFirma: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('ID')) this.ID = <string>Node.getAttribute('ID');
		nd = Node.getElementsByTagName('Encabezado');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Encabezado = new ExportacionesEncabezado();
				this.Encabezado.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Detalle');
		if(nd.length > 0) {
			this.Detalle = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Detalle.push(new ExportacionesDetalle());
					this.Detalle[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('SubTotInfo');
		if(nd.length > 0) {
			this.SubTotInfo = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.SubTotInfo.push(new ExportacionesSubTotInfo());
					this.SubTotInfo[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('DscRcgGlobal');
		if(nd.length > 0) {
			this.DscRcgGlobal = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.DscRcgGlobal.push(new ExportacionesDscRcgGlobal());
					this.DscRcgGlobal[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('Referencia');
		if(nd.length > 0) {
			this.Referencia = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Referencia.push(new ExportacionesReferencia());
					this.Referencia[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('TED');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TED = new ExportacionesTED();
				this.TED.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('TmstFirma')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TmstFirma = new Date(nd[i].textContent);
				break;
			}
	}

}

/**Identificacion y Totales del Documento. */
export class ExportacionesEncabezado {
	/**Identificacion del DTE. */
	IdDoc: ExportacionesIdDoc
	/**Datos del Emisor. */
	Emisor: ExportacionesEmisor
	/**Datos del Receptor. */
	Receptor: ExportacionesReceptor
	/**Opcional. Informacion de Transporte de Mercaderias. */
	Transporte: ExportacionesTransporte
	/**Montos Totales del DTE. */
	Totales: ExportacionesTotales
	/**Opcional. Otra Moneda . */
	OtraMoneda: ExportacionesOtraMoneda
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('IdDoc');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdDoc = new ExportacionesIdDoc();
				this.IdDoc.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Emisor');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Emisor = new ExportacionesEmisor();
				this.Emisor.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Receptor');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Receptor = new ExportacionesReceptor();
				this.Receptor.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Transporte');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Transporte = new ExportacionesTransporte();
				this.Transporte.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('Totales');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Totales = new ExportacionesTotales();
				this.Totales.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('OtraMoneda');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.OtraMoneda = new ExportacionesOtraMoneda();
				this.OtraMoneda.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Identificacion del DTE. */
export class ExportacionesIdDoc {
	/**Tipo de DTE. */
	TipoDTE: EXPType
	/**Folio del Documento Electronico. */
	Folio: number
	/**Fecha Emision Contable del DTE (AAAA-MM-DD). */
	FchEmis: Date
	/**Opcional. Indica Modo de Despacho de los Bienes que Acompanan al DTE. */
	TipoDespacho: ExportacionesTipoDespacho
	/**Opcional. Indica si Transaccion Corresponde a la Prestacion de un Servicio. */
	IndServicio: ExportacionesIndServicio
	/**Opcional. Forma de Pago del DTE. */
	FmaPago: ExportacionesFmaPago
	/**Opcional. Forma de Pago Exportación Tabla Formas de Pago de Aduanas. */
	FmaPagExp: number
	/**Opcional. Fecha de Cancelacion del DTE (AAAA-MM-DD). */
	FchCancel: Date
	/**Opcional. Monto Cancelado al   emitirse el documento. */
	MntCancel: number
	/**Opcional. Saldo Insoluto al       emitirse el documento. */
	SaldoInsol: number
	/**Opcional. Tabla de Montos de Pago. */
	MntPagos: ExportacionesMntPagos[]
	/**Opcional. Periodo de Facturacion - Desde (AAAA-MM-DD). */
	PeriodoDesde: Date
	/**Opcional. Periodo Facturacion - Hasta (AAAA-MM-DD). */
	PeriodoHasta: Date
	/**Opcional. Medio de Pago. */
	MedioPago: MedioPagoType
	/**Opcional. Tipo Cuenta de Pago. */
	TpoCtaPago: ExportacionesTpoCtaPago
	/**Opcional. Número de la cuenta del pago. */
	NumCtaPago: string
	/**Opcional. Banco donde se realiza el pago. */
	BcoPago: string
	/**Opcional. Codigo del Termino de Pago Acordado. */
	TermPagoCdg: string
	/**Opcional. Términos del Pago - glosa. */
	TermPagoGlosa: string
	/**Opcional. Dias de Acuerdo al Codigo de Termino de Pago. */
	TermPagoDias: number
	/**Opcional. Fecha de Vencimiento del Pago (AAAA-MM-DD). */
	FchVenc: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TipoDespacho')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoDespacho = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IndServicio')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndServicio = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FmaPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FmaPago = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FmaPagExp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FmaPagExp = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoCtaPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoCtaPago = <ExportacionesTpoCtaPago>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('NumCtaPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NumCtaPago = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('BcoPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.BcoPago = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TermPagoCdg')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TermPagoCdg = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TermPagoGlosa')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TermPagoGlosa = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TermPagoDias')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TermPagoDias = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TipoDTE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoDTE = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('Folio')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Folio = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FchEmis')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchEmis = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FchCancel')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchCancel = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntCancel')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntCancel = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SaldoInsol')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SaldoInsol = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntPagos');
		if(nd.length > 0) {
			this.MntPagos = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.MntPagos.push(new ExportacionesMntPagos());
					this.MntPagos[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('PeriodoDesde')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PeriodoDesde = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PeriodoHasta')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PeriodoHasta = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MedioPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MedioPago = <MedioPagoType>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FchVenc')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchVenc = new Date(nd[i].textContent);
				break;
			}
	}

}

/***/
export enum ExportacionesTipoDespacho {
	DespachoporCuentadelComprador = 1,
	DespachoporCuentadelEmisoraInstalacionesdelComprador = 2,
	DespachoporCuentadelEmisoraOtrasInstalaciones = 3,
}
/***/
export enum ExportacionesIndServicio {
	FacturadeServicio = 3,
	N_4 = 4,
	N_5 = 5,
}
/***/
export enum ExportacionesFmaPago {
	PagoContado = 1,
	PagoCredito = 2,
	SinCosto = 3,
}
export type ExportacionesTpoCtaPago = 'AHORRO' | 'CORRIENTE' | 'VISTA' 

/**Tipos de Facturas de  Exportacion. */
export enum EXPType {
	N_110 = 110,
	N_111 = 111,
	N_112 = 112,
}
/**Tabla de Montos de Pago. */
export class ExportacionesMntPagos {
	/**Fecha de Pago (AAAA-MM-DD). */
	FchPago: Date
	/**Monto de Pago. */
	MntPago: number
	/**Opcional. */
	GlosaPagos: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('GlosaPagos')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GlosaPagos = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FchPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchPago = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntPago')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntPago = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Datos del Emisor. */
export class ExportacionesEmisor {
	/**RUT del Emisor del DTE. */
	RUTEmisor: string
	/**Nombre o Razon Social del Emisor. */
	RznSoc: string
	/**Giro Comercial del Emisor Relevante para el DTE . */
	GiroEmis: string
	/**Opcional. Telefono Emisor . */
	Telefono: string[]
	/**Opcional. Correo Elect. de contacto en empresa del  receptor . */
	CorreoEmisor: string
	/**Codigo de Actividad Economica del Emisor Relevante para el DTE. */
	Acteco: number[]
	/**Opcional. Sucursal que Emite el DTE. */
	Sucursal: string
	/**Opcional. Codigo de Sucursal Entregado por el SII. */
	CdgSIISucur: number
	/**Opcional. Sucursal que Emite el DTE. */
	CodAdicSucur: string
	/**Opcional. Direccion de Origen. */
	DirOrigen: string
	/**Opcional. Comuna de Origen. */
	CmnaOrigen: string
	/**Opcional. Ciudad de Origen. */
	CiudadOrigen: string
	/**Opcional. Codigo del Vendedor. */
	CdgVendedor: string
	/**Opcional. Identificador Adicional del Emisor . */
	IdAdicEmisor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('RznSoc')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RznSoc = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('GiroEmis')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GiroEmis = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Telefono')
		if(nd.length > 0) {
			this.Telefono = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.Telefono.push(nd[i].textContent);
		}

		nd = Node.getElementsByTagName('Acteco')
		if(nd.length > 0) {
			this.Acteco = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.Acteco.push(parseFloat(nd[i].textContent));
		}

		nd = Node.getElementsByTagName('Sucursal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Sucursal = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CdgSIISucur')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CdgSIISucur = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodAdicSucur')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodAdicSucur = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DirOrigen')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirOrigen = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CdgVendedor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CdgVendedor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IdAdicEmisor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdAdicEmisor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTEmisor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTEmisor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CorreoEmisor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CorreoEmisor = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CmnaOrigen')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaOrigen = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadOrigen')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadOrigen = nd[i].textContent;
				break;
			}
	}

}

/**Datos del Receptor. */
export class ExportacionesReceptor {
	/**RUT del Receptor del DTE. */
	RUTRecep: string
	/**Opcional. Codigo Interno del Receptor. */
	CdgIntRecep: string
	/**Nombre o Razon Social del Receptor. */
	RznSocRecep: string
	/**Opcional. Receptor Extranjero. */
	Extranjero: ExportacionesExtranjero
	/**Opcional. Giro Comercial del Receptor. */
	GiroRecep: string
	/**Opcional. Glosa con nombre o teléfono de contacto en empresa del  receptor . */
	Contacto: string
	/**Opcional. Correo Elect. de contacto en empresa del  receptor . */
	CorreoRecep: string
	/**Opcional. Direccion en la Cual se Envian los Productos o se Prestan los Servicios. */
	DirRecep: string
	/**Opcional. Comuna de Recepcion. */
	CmnaRecep: string
	/**Opcional. Ciudad de Recepcion. */
	CiudadRecep: string
	/**Opcional. Direccion Postal. */
	DirPostal: string
	/**Opcional. Comuna Postal. */
	CmnaPostal: string
	/**Opcional. Ciudad Postal. */
	CiudadPostal: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('CdgIntRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CdgIntRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('GiroRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GiroRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Contacto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Contacto = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DirRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DirPostal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirPostal = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RznSocRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RznSocRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Extranjero');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Extranjero = new ExportacionesExtranjero();
				this.Extranjero.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('CorreoRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CorreoRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CmnaRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadRecep = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CmnaPostal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaPostal = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadPostal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadPostal = nd[i].textContent;
				break;
			}
	}

}

/**Receptor Extranjero. */
export class ExportacionesExtranjero {
	/**Opcional. Num. Identif. Receptor Extranjero. */
	NumId: string
	/**Opcional. Nacionalidad Receptor Extranjero. */
	Nacionalidad: string
	/**Opcional. Identificador Adicional del Receptor  extranjero. */
	IdAdicRecep: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NumId')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NumId = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Nacionalidad')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Nacionalidad = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IdAdicRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdAdicRecep = nd[i].textContent;
				break;
			}
	}

}

/**Informacion de Transporte de Mercaderias. */
export class ExportacionesTransporte {
	/**Opcional. Patente del Vehiculo que Transporta los Bienes. */
	Patente: string
	/**Opcional. RUT del Transportista. */
	RUTTrans: string
	/**Opcional. */
	Chofer: ExportacionesChofer
	/**Opcional. Direccion de Destino. */
	DirDest: string
	/**Opcional. Comuna de Destino. */
	CmnaDest: string
	/**Opcional. Ciudad de Destino. */
	CiudadDest: string
	/**Opcional. documentos de Exportación y guías de despacho . */
	Aduana: ExportacionesAduana
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('Patente')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Patente = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DirDest')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DirDest = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTTrans')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTTrans = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Chofer');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Chofer = new ExportacionesChofer();
				this.Chofer.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('CmnaDest')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CmnaDest = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CiudadDest')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CiudadDest = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Aduana');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Aduana = new ExportacionesAduana();
				this.Aduana.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/***/
export class ExportacionesChofer {
	/**RUT del Chofer. */
	RUTChofer: string
	/**Nombre del Chofer. */
	NombreChofer: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NombreChofer')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NombreChofer = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTChofer')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTChofer = nd[i].textContent;
				break;
			}
	}

}

/**documentos de Exportación y guías de despacho . */
export class ExportacionesAduana {
	/**Opcional. Código según  tabla "Modalidad de Venta" de aduana. */
	CodModVenta: number
	/**Opcional. Código según  Tabla "Cláusula compra-venta" de  Aduana. */
	CodClauVenta: number
	/**Opcional. Total  Cláusula de venta. */
	TotClauVenta: number
	/**Opcional. Indicar el Código de la vía de transporte utilizada para transportar la mercadería, según tabla Vías de Transporte de Aduana. */
	CodViaTransp: number
	/**Opcional. Nombre o Identificación del Medio de Transporte. */
	NombreTransp: string
	/**Opcional. Rut Cía. Transportadora. */
	RUTCiaTransp: string
	/**Opcional. Nombre Cía. Transportadora. */
	NomCiaTransp: string
	/**Opcional. Identificador Adicional Cía. Transportadora. */
	IdAdicTransp: string
	/**Opcional. Numero de reserva del Operador. */
	Booking: string
	/**Opcional. Código del Operador. */
	Operador: string
	/**Opcional. Código del puerto de embarque según tabla de Aduana . */
	CodPtoEmbarque: number
	/**Opcional. Identificador Adicional Puerto de Embarque. */
	IdAdicPtoEmb: string
	/**Opcional. Código del puerto de desembarque según tabla de Aduana . */
	CodPtoDesemb: number
	/**Opcional. Identificador Adicional Puerto de Desembarque. */
	IdAdicPtoDesemb: string
	/**Opcional. */
	Tara: number
	/**Opcional. Código de la unidad de medida  según tabla de Aduana . */
	CodUnidMedTara: number
	/**Opcional. Sumatoria de los pesos brutos de todos los ítems del documento. */
	PesoBruto: number
	/**Opcional. Código de la unidad de medida  según tabla de Aduana . */
	CodUnidPesoBruto: number
	/**Opcional. Sumatoria de los pesos netos de todos los ítems del documento. */
	PesoNeto: number
	/**Opcional. Código de la unidad de medida  según tabla de Aduana . */
	CodUnidPesoNeto: number
	/**Opcional. Indique el total de items del documento. */
	TotItems: number
	/**Opcional. Cantidad total de bultos que ampara el documento.. */
	TotBultos: number
	/**Opcional. Tabla de descripción de los distintos tipos de bultos. */
	TipoBultos: ExportacionesTipoBultos[]
	/**Opcional. Monto del flete según moneda de venta. */
	MntFlete: number
	/**Opcional. Monto del seguro , según moneda de venta. */
	MntSeguro: number
	/**Opcional. Código del país del receptor extranjero de la mercadería,según tabla Países aduana. */
	CodPaisRecep: number
	/**Opcional. Código del país de destino extranjero de la mercadería,según tabla Países aduana. */
	CodPaisDestin: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('CodModVenta')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodModVenta = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodClauVenta')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodClauVenta = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodViaTransp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodViaTransp = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('NombreTransp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NombreTransp = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('NomCiaTransp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NomCiaTransp = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IdAdicTransp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdAdicTransp = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Booking')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Booking = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Operador')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Operador = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CodPtoEmbarque')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodPtoEmbarque = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IdAdicPtoEmb')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdAdicPtoEmb = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CodPtoDesemb')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodPtoDesemb = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IdAdicPtoDesemb')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdAdicPtoDesemb = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Tara')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Tara = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodUnidMedTara')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodUnidMedTara = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PesoBruto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PesoBruto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodUnidPesoBruto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodUnidPesoBruto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PesoNeto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PesoNeto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodUnidPesoNeto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodUnidPesoNeto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TotItems')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TotItems = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TotBultos')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TotBultos = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodPaisRecep')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodPaisRecep = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodPaisDestin')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodPaisDestin = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TotClauVenta')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TotClauVenta = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RUTCiaTransp')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTCiaTransp = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TipoBultos');
		if(nd.length > 0) {
			this.TipoBultos = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.TipoBultos.push(new ExportacionesTipoBultos());
					this.TipoBultos[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('MntFlete')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntFlete = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntSeguro')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntSeguro = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Tabla de descripción de los distintos tipos de bultos. */
export class ExportacionesTipoBultos {
	/**Opcional. Código según  tabla "Tipos de Bultos" de aduana. */
	CodTpoBultos: number
	/**Opcional. Cantidad de Bultos . */
	CantBultos: number
	/**Opcional. Identificación de marcas, cuando es distinto de contenedor. */
	Marcas: string
	/**Opcional. Se utiliza cuando el tipo de bulto es contenedor. */
	IdContainer: string
	/**Opcional. Sello contenedor. Con digito verificador. */
	Sello: string
	/**Opcional. Nombre emisor sello. */
	EmisorSello: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('CodTpoBultos')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodTpoBultos = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CantBultos')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CantBultos = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('Marcas')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Marcas = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IdContainer')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdContainer = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Sello')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Sello = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('EmisorSello')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.EmisorSello = nd[i].textContent;
				break;
			}
	}

}

/**Montos Totales del DTE. */
export class ExportacionesTotales {
	/**Tipo de Moneda en que se regisrtra la transacción.  Tabla de Monedas  de Aduanas. */
	TpoMoneda: TipMonType
	/**Monto Exento del DTE. */
	MntExe: number
	/**Monto Total del DTE. */
	MntTotal: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('MntExe')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntExe = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntTotal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntTotal = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoMoneda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoMoneda = <TipMonType>nd[i].textContent;
				break;
			}
	}

}

/**Otra Moneda . */
export class ExportacionesOtraMoneda {
	/**Tipo Otra moneda Tabla de Monedas  de Aduanas. */
	TpoMoneda: TipMonType
	/**Opcional. Tipo de Cambio fijado por el Banco Central de Chile. */
	TpoCambio: number
	/**Opcional. Monto Exento del DTE en Otra Moneda  . */
	MntExeOtrMnda: number
	/**Monto Total Otra Moneda. */
	MntTotOtrMnda: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TpoMoneda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoMoneda = <TipMonType>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TpoCambio')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoCambio = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntExeOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntExeOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MntTotOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MntTotOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Detalle de Itemes del Documento. */
export class ExportacionesDetalle {
	/**Numero Secuencial de Linea. */
	NroLinDet: number
	/**Opcional. Codificacion del Item. */
	CdgItem: ExportacionesCdgItem[]
	/**Opcional. Indicador de Exencion/Facturacion. */
	IndExe: ExportacionesIndExe
	/**Nombre del Item. */
	NmbItem: string
	/**Opcional. Descripcion del Item. */
	DscItem: string
	/**Opcional. Cantidad para la Unidad de Medida de Referencia. */
	QtyRef: number
	/**Opcional. Unidad de Medida de Referencia. */
	UnmdRef: string
	/**Opcional. Precio Unitario de Referencia para Unidad de Referencia. */
	PrcRef: number
	/**Opcional. Cantidad del Item. */
	QtyItem: number
	/**Opcional. Distribucion de la Cantidad. */
	Subcantidad: ExportacionesSubcantidad[]
	/**Opcional. Fecha Elaboracion del Item. */
	FchElabor: Date
	/**Opcional. Fecha Vencimiento del Item. */
	FchVencim: Date
	/**Opcional. Unidad de Medida. */
	UnmdItem: string
	/**Opcional. Precio Unitario del Item . */
	PrcItem: number
	/**Opcional. Precio del Item en Otra Moneda. */
	OtrMnda: ExportacionesOtrMnda
	/**Opcional. Porcentaje de Descuento. */
	DescuentoPct: number
	/**Opcional. Monto de Descuento. */
	DescuentoMonto: number
	/**Opcional. Desglose del Descuento. */
	SubDscto: ExportacionesSubDscto[]
	/**Opcional. Porcentaje de Recargo. */
	RecargoPct: number
	/**Opcional. Monto de Recargo. */
	RecargoMonto: number
	/**Opcional. Desglose del Recargo. */
	SubRecargo: ExportacionesSubRecargo[]
	/**Monto por Linea de Detalle. Corresponde al Monto Neto, a menos que MntBruto Indique lo Contrario . */
	MontoItem: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinDet')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroLinDet = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IndExe')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndExe = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('NmbItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NmbItem = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('DscItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DscItem = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('UnmdRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.UnmdRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('UnmdItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.UnmdItem = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('MontoItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MontoItem = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CdgItem');
		if(nd.length > 0) {
			this.CdgItem = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.CdgItem.push(new ExportacionesCdgItem());
					this.CdgItem[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('QtyRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.QtyRef = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PrcRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PrcRef = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('QtyItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.QtyItem = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('Subcantidad');
		if(nd.length > 0) {
			this.Subcantidad = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.Subcantidad.push(new ExportacionesSubcantidad());
					this.Subcantidad[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('FchElabor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchElabor = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FchVencim')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchVencim = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PrcItem')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PrcItem = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('OtrMnda');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.OtrMnda = new ExportacionesOtrMnda();
				this.OtrMnda.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('DescuentoPct')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DescuentoPct = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('DescuentoMonto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DescuentoMonto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubDscto');
		if(nd.length > 0) {
			this.SubDscto = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.SubDscto.push(new ExportacionesSubDscto());
					this.SubDscto[i].ParseFromXMLElement(nd[i]);
				}
		}

		nd = Node.getElementsByTagName('RecargoPct')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RecargoPct = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RecargoMonto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RecargoMonto = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubRecargo');
		if(nd.length > 0) {
			this.SubRecargo = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node){
					this.SubRecargo.push(new ExportacionesSubRecargo());
					this.SubRecargo[i].ParseFromXMLElement(nd[i]);
				}
		}

	}

}

/***/
export enum ExportacionesIndExe {
	ElProductooServicioNOESTAAfectoaIVA = 1,
	ElProductooServicioNOESFacturable = 2,
	GarantiaporDepositoEnvase = 3,
	ElproductoNoConstituyeVenta = 4,
	ItemaRebajar = 5,
	Nofacturablesnegativos = 6,
}
/**Codificacion del Item. */
export class ExportacionesCdgItem {
	/**Tipo de Codificacion. */
	TpoCodigo: string
	/**Valor del Codigo de Item, para la Codificacion Particular. */
	VlrCodigo: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TpoCodigo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoCodigo = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('VlrCodigo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.VlrCodigo = nd[i].textContent;
				break;
			}
	}

}

/**Distribucion de la Cantidad. */
export class ExportacionesSubcantidad {
	/**Cantidad  Distribuida. */
	SubQty: number
	/**Codigo Descriptivo de la Subcantidad. */
	SubCod: string
	/**Opcional. Tipo de Código Subcantidad. */
	TipCodSubQty: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('SubCod')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubCod = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TipCodSubQty')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipCodSubQty = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('SubQty')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubQty = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Precio del Item en Otra Moneda. */
export class ExportacionesOtrMnda {
	/**Precio Unitario en Otra Moneda. */
	PrcOtrMon: number
	/**Codigo de Otra Moneda (Usar Codigos de Moneda del Banco Central). */
	Moneda: string
	/**Opcional. Factor  para Conversion a Pesos. */
	FctConv: number
	/**Opcional. Descuento en Otra Moneda . */
	DctoOtrMnda: number
	/**Opcional. Recargo en Otra Moneda. */
	RecargoOtrMnda: number
	/**Valor por línea de detalle en Otra Moneda. */
	MontoItemOtrMnda: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('Moneda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Moneda = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RecargoOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RecargoOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('MontoItemOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MontoItemOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('PrcOtrMon')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.PrcOtrMon = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FctConv')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FctConv = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('DctoOtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DctoOtrMnda = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Desglose del Descuento. */
export class ExportacionesSubDscto {
	/**Tipo de SubDescuento. */
	TipoDscto: ExportacionesTipoDscto
	/**Valor del SubDescuento. */
	ValorDscto: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TipoDscto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoDscto = <ExportacionesTipoDscto>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('ValorDscto')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValorDscto = parseFloat(nd[i].textContent);
				break;
			}
	}

}

export type ExportacionesTipoDscto = '$' | '%' 

/**Desglose del Recargo. */
export class ExportacionesSubRecargo {
	/**Tipo de SubRecargo. */
	TipoRecargo: ExportacionesTipoRecargo
	/**Valor de SubRecargo. */
	ValorRecargo: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('TipoRecargo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TipoRecargo = <ExportacionesTipoRecargo>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('ValorRecargo')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValorRecargo = parseFloat(nd[i].textContent);
				break;
			}
	}

}

export type ExportacionesTipoRecargo = '$' | '%' 

/**Subtotales Informativos. */
export class ExportacionesSubTotInfo {
	/**Número de Subtotal . */
	NroSTI: number
	/**Glosa. */
	GlosaSTI: string
	/**Opcional. Ubicación para Impresión . */
	OrdenSTI: number
	/**Opcional. Valor Neto del Subtotal. */
	SubTotNetoSTI: number
	/**Opcional. Valor del IVA del Subtotal. */
	SubTotIVASTI: number
	/**Opcional. Valor de los Impuestos adicionales o específicos del Subtotal. */
	SubTotAdicSTI: number
	/**Opcional. Valor no Afecto o Exento del Subtotal. */
	SubTotExeSTI: number
	/**Opcional. Valor de la línea de subtotal. */
	ValSubtotSTI: number
	/**Opcional. TABLA de  Líneas de Detalle que se agrupan en el Subtotal. */
	LineasDeta: number[]
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('GlosaSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GlosaSTI = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('OrdenSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.OrdenSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('LineasDeta')
		if(nd.length > 0) {
			this.LineasDeta = [];
			for (let i = 0; i < nd.length; ++i)
				if(nd[i].parentNode == Node)  this.LineasDeta.push(parseFloat(nd[i].textContent));
		}

		nd = Node.getElementsByTagName('SubTotNetoSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotNetoSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubTotIVASTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotIVASTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubTotAdicSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotAdicSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('SubTotExeSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.SubTotExeSTI = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValSubtotSTI')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValSubtotSTI = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Descuentos y/o Recargos que afectan al total del Documento. */
export class ExportacionesDscRcgGlobal {
	/**Numero Secuencial de Linea. */
	NroLinDR: number
	/**Tipo de Movimiento. */
	TpoMov: ExportacionesTpoMov
	/**Opcional. Descripcion del Descuento o Recargo. */
	GlosaDR: string
	/**Unidad en que se Expresa el Valor. */
	TpoValor: ExportacionesTpoValor
	/**Valor del Descuento o Recargo. */
	ValorDR: number
	/**Opcional. Valor en otra moneda. */
	ValorDROtrMnda: number
	/**Opcional. Indica si el D/R es No Afecto o No Facturable. */
	IndExeDR: ExportacionesIndExeDR
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinDR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroLinDR = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoMov')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoMov = <ExportacionesTpoMov>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('GlosaDR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.GlosaDR = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TpoValor')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoValor = <ExportacionesTpoValor>nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IndExeDR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndExeDR = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValorDR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValorDR = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('ValorDROtrMnda')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.ValorDROtrMnda = parseFloat(nd[i].textContent);
				break;
			}
	}

}

export type ExportacionesTpoMov = 'D' | 'R' 

export type ExportacionesTpoValor = '%' | '$' 

/***/
export enum ExportacionesIndExeDR {
	DescuentoRecargoGlobalNoAfecto = 1,
	DescuentoRecargoNoFacturable = 2,
}
/**Identificacion de otros documentos Referenciados por Documento. */
export class ExportacionesReferencia {
	/**Numero Secuencial de Linea de Referencia. */
	NroLinRef: number
	/**Tipo de Documento de Referencia. */
	TpoDocRef: string
	/**Opcional. Indica que se esta Referenciando un Conjunto de Documentos. */
	IndGlobal: ExportacionesIndGlobal
	/**Folio del Documento de Referencia. */
	FolioRef: string
	/**Opcional. RUT Otro Contribuyente. */
	RUTOtr: string
	/**Opcional. Identificador Adicional del otro contribuyente. */
	IdAdicOtr: string
	/**Fecha de la Referencia. */
	FchRef: Date
	/**Opcional. Tipo de Uso de la Referencia. */
	CodRef: ExportacionesCodRef
	/**Opcional. Razon Explicita por la que se Referencia el Documento. */
	RazonRef: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.NroLinRef = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('TpoDocRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TpoDocRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IndGlobal')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IndGlobal = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IdAdicOtr')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IdAdicOtr = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FchRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FchRef = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('CodRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CodRef = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RazonRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RazonRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('FolioRef')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FolioRef = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RUTOtr')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RUTOtr = nd[i].textContent;
				break;
			}
	}

}

/***/
export enum ExportacionesIndGlobal {
	ElDocumentohaceReferenciaaunConjuntodeDocumentosTributariosdelMismoTipo = 1,
}
/***/
export enum ExportacionesCodRef {
	AnulaDocumentodeReferencia = 1,
	CorrigeTextodelDocumentodeReferencia = 2,
	CorrigeMontos = 3,
}
/**Timbre Electronico de DTE. */
export class ExportacionesTED {
	
	version: string = "1.0"
	/**Datos Basicos de Documento. */
	DD: ExportacionesDD
	/**Valor de Firma Digital  sobre DD. */
	FRMT: ExportacionesFRMT
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('version')) this.version = <string>Node.getAttribute('version');
		nd = Node.getElementsByTagName('DD');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DD = new ExportacionesDD();
				this.DD.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('FRMT');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FRMT = new ExportacionesFRMT();
				this.FRMT.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Datos Basicos de Documento. */
export class ExportacionesDD {
	/**RUT Emisor. */
	RE: string
	/**Tipo DTE. */
	TD: EXPType
	/**Folio DTE. */
	F: number
	/**Fecha Emision DTE en Formato AAAA-MM-DD. */
	FE: Date
	/**RUT Receptor. */
	RR: string
	/**Razon Social Receptor. */
	RSR: string
	/**Monto Total DTE. */
	MNT: number
	/**Descripcion Primer Item de Detalle. */
	IT1: string
	/**Codigo Autorizacion Folios. */
	CAF: ExportacionesCAF
	/**TimeStamp de Generacion del Timbre. */
	TSTED: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('RSR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RSR = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('MNT')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.MNT = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('IT1')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IT1 = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('RE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RE = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TD')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TD = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('F')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.F = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('FE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FE = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RR')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RR = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('CAF');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.CAF = new ExportacionesCAF();
				this.CAF.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('TSTED')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TSTED = new Date(nd[i].textContent);
				break;
			}
	}

}

/**Codigo Autorizacion Folios. */
export class ExportacionesCAF {
	
	version: string = "1.0"
	/**Datos de Autorizacion de Folios. */
	DA: ExportacionesDA
	/**Firma Digital (RSA) del SII Sobre DA. */
	FRMA: ExportacionesFRMA
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('version')) this.version = <string>Node.getAttribute('version');
		nd = Node.getElementsByTagName('DA');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DA = new ExportacionesDA();
				this.DA.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('FRMA');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FRMA = new ExportacionesFRMA();
				this.FRMA.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Datos de Autorizacion de Folios. */
export class ExportacionesDA {
	/**RUT Emisor. */
	RE: string
	/**Razon Social Emisor. */
	RS: string
	/**Tipo DTE. */
	TD: EXPType
	/**Rango Autorizado de Folios. */
	RNG: ExportacionesRNG
	/**Fecha Autorizacion en Formato AAAA-MM-DD. */
	FA: Date
	/**Opcional. Clave Publica RSA del Solicitante. */
	RSAPK: ExportacionesRSAPK
	/**Opcional. Clave Publica DSA del Solicitante. */
	DSAPK: ExportacionesDSAPK
	/**Identificador de Llave. */
	IDK: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('RS')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RS = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('IDK')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.IDK = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RE')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RE = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('TD')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.TD = parseInt(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RNG');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RNG = new ExportacionesRNG();
				this.RNG.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('FA')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.FA = new Date(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('RSAPK');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.RSAPK = new ExportacionesRSAPK();
				this.RSAPK.ParseFromXMLElement(nd[i]);
				break;
			}

		nd = Node.getElementsByTagName('DSAPK');
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.DSAPK = new ExportacionesDSAPK();
				this.DSAPK.ParseFromXMLElement(nd[i]);
				break;
			}

	}

}

/**Rango Autorizado de Folios. */
export class ExportacionesRNG {
	/**Folio Inicial (Desde). */
	D: number
	/**Folio Final (Hasta). */
	H: number
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('D')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.D = parseFloat(nd[i].textContent);
				break;
			}
		nd = Node.getElementsByTagName('H')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.H = parseFloat(nd[i].textContent);
				break;
			}
	}

}

/**Clave Publica RSA del Solicitante. */
export class ExportacionesRSAPK {
	/**Modulo RSA. */
	M: string
	/**Exponente RSA. */
	E: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('M')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.M = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('E')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.E = nd[i].textContent;
				break;
			}
	}

}

/**Clave Publica DSA del Solicitante. */
export class ExportacionesDSAPK {
	/**Modulo Primo. */
	P: string
	/**Entero Divisor de P - 1. */
	Q: string
	/**Entero f(P, Q). */
	G: string
	/**G**X mod P. */
	Y: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		nd = Node.getElementsByTagName('P')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.P = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Q')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Q = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('G')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.G = nd[i].textContent;
				break;
			}
		nd = Node.getElementsByTagName('Y')
		for (let i = 0; i < nd.length; ++i)
			if(nd[i].parentNode == Node) {
				this.Y = nd[i].textContent;
				break;
			}
	}

}

/**Firma Digital (RSA) del SII Sobre DA. */
export class ExportacionesFRMA {
	
	algoritmo: string = "SHA1withRSA"
	/**Opcional. */
	valor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('algoritmo')) this.algoritmo = <string>Node.getAttribute('algoritmo');
		this.valor = Node.textContent || '';
	}

}

/**Valor de Firma Digital  sobre DD. */
export class ExportacionesFRMT {
	
	algoritmo: Exportacionesalgoritmo
	/**Opcional. */
	valor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd : NodeListOf<Element>
		if(Node.hasAttribute('algoritmo')) this.algoritmo = <Exportacionesalgoritmo>Node.getAttribute('algoritmo');
		this.valor = Node.textContent || '';
	}

}

export type Exportacionesalgoritmo = 'SHA1withRSA' | 'SHA1withDSA' 

