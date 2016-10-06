import * as FirmaDigital from './firma_digital';


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
	Signature: FirmaDigital.Signature
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('version')) this.version = Node.getAttribute('version');
		nd = Node.getElementsByTagName('Documento');
		if (nd.length > 0) {
			this.Documento = new Documento();
			this.Documento.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('Liquidacion');
		if (nd.length > 0) {
			this.Liquidacion = new Liquidacion();
			this.Liquidacion.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('Exportaciones');
		if (nd.length > 0) {
			this.Exportaciones = new Exportaciones();
			this.Exportaciones.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('Signature');
		if (nd.length > 0) {
			this.Signature = new FirmaDigital.Signature();
			this.Signature.ParseFromXMLElement(nd[0]);
		}

	}

}

/**Informacion Tributaria del DTE. */
export class Documento {

	ID: string
	/**Identificacion y Totales del Documento. */
	Encabezado: Encabezado
	/**Detalle de Itemes del Documento. */
	Detalle: [Detalle]
	/**Opcional. Subtotales Informativos. */
	SubTotInfo: [SubTotInfo]
	/**Opcional. Descuentos y/o Recargos que afectan al total del Documento. */
	DscRcgGlobal: [DscRcgGlobal]
	/**Opcional. Identificacion de otros documentos Referenciados por Documento. */
	Referencia: [Referencia]
	/**Opcional. Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
	Comisiones: [Comisiones]
	/**Timbre Electronico de DTE. */
	TED: TED
	/**Fecha y Hora en que se Firmo Digitalmente el Documento AAAA-MM-DDTHH:MI:SS. */
	TmstFirma: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('ID')) this.ID = <string>Node.getAttribute('ID');
		nd = Node.getElementsByTagName('Encabezado');
		if (nd.length > 0) {
			this.Encabezado = new Encabezado();
			this.Encabezado.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('Detalle');
		if (nd.length > 0) {
			this.Detalle = <[Detalle]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.Detalle.push(new Detalle());
				this.Detalle[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('SubTotInfo');
		if (nd.length > 0) {
			this.SubTotInfo = <[SubTotInfo]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.SubTotInfo.push(new SubTotInfo());
				this.SubTotInfo[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('DscRcgGlobal');
		if (nd.length > 0) {
			this.DscRcgGlobal = <[DscRcgGlobal]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.DscRcgGlobal.push(new DscRcgGlobal());
				this.DscRcgGlobal[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('Referencia');
		if (nd.length > 0) {
			this.Referencia = <[Referencia]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.Referencia.push(new Referencia());
				this.Referencia[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('Comisiones');
		if (nd.length > 0) {
			this.Comisiones = <[Comisiones]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.Comisiones.push(new Comisiones());
				this.Comisiones[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('TED');
		if (nd.length > 0) {
			this.TED = new TED();
			this.TED.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('TmstFirma')
		if (nd.length > 0) this.TmstFirma = new Date(nd[0].textContent);
	}

}

/**Identificacion y Totales del Documento. */
export class Encabezado {
	/**Identificacion del DTE. */
	IdDoc: IdDoc
	/**Datos del Emisor. */
	Emisor: Emisor
	/**Opcional. RUT a Cuenta de Quien se Emite el DTE. */
	RUTMandante: string
	/**Datos del Receptor. */
	Receptor: Receptor
	/**Opcional. RUT que solicita el DTE en Venta a Publico. */
	RUTSolicita: string
	/**Opcional. Informacion de Transporte de Mercaderias. */
	Transporte: Transporte
	/**Montos Totales del DTE. */
	Totales: Totales
	/**Opcional. Otra Moneda . */
	OtraMoneda: OtraMoneda
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('IdDoc');
		if (nd.length > 0) {
			this.IdDoc = new IdDoc();
			this.IdDoc.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('Emisor');
		if (nd.length > 0) {
			this.Emisor = new Emisor();
			this.Emisor.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('RUTMandante')
		if (nd.length > 0) this.RUTMandante = nd[0].textContent;
		nd = Node.getElementsByTagName('Receptor');
		if (nd.length > 0) {
			this.Receptor = new Receptor();
			this.Receptor.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('RUTSolicita')
		if (nd.length > 0) this.RUTSolicita = nd[0].textContent;
		nd = Node.getElementsByTagName('Transporte');
		if (nd.length > 0) {
			this.Transporte = new Transporte();
			this.Transporte.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('Totales');
		if (nd.length > 0) {
			this.Totales = new Totales();
			this.Totales.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('OtraMoneda');
		if (nd.length > 0) {
			this.OtraMoneda = new OtraMoneda();
			this.OtraMoneda.ParseFromXMLElement(nd[0]);
		}

	}

}

/**Identificacion del DTE. */
export class IdDoc {
	/**Tipo de DTE. */
	TipoDTE: DTEType
	/**Folio del Documento Electronico. */
	Folio: number
	/**Fecha Emision Contable del DTE (AAAA-MM-DD). */
	FchEmis: Date
	/**Opcional. Nota de Credito sin Derecho a Descontar Debito. */
	IndNoRebaja: IndNoRebaja
	/**Opcional. Indica Modo de Despacho de los Bienes que Acompanan al DTE. */
	TipoDespacho: TipoDespacho
	/**Opcional. Incluido en Guias de Despacho para Especifiicar el Tipo de Traslado de Productos. */
	IndTraslado: IndTraslado
	/**Opcional. Tipo de impresión N (Normal)  o T (Ticket) . */
	TpoImpresion: TpoImpresion
	/**Opcional. Indica si Transaccion Corresponde a la Prestacion de un Servicio. */
	IndServicio: IndServicio
	/**Opcional. Indica el Uso de Montos Brutos en Detalle. */
	MntBruto: MntBruto
	/**Opcional. Forma de Pago del DTE. */
	FmaPago: FmaPago
	/**Opcional. Forma de Pago Exportación Tabla Formas de Pago de Aduanas. */
	FmaPagExp: number
	/**Opcional. Fecha de Cancelacion del DTE (AAAA-MM-DD). */
	FchCancel: Date
	/**Opcional. Monto Cancelado al   emitirse el documento. */
	MntCancel: number
	/**Opcional. Saldo Insoluto al       emitirse el documento. */
	SaldoInsol: number
	/**Opcional. Tabla de Montos de Pago. */
	MntPagos: [MntPagos]
	/**Opcional. Periodo de Facturacion - Desde (AAAA-MM-DD). */
	PeriodoDesde: Date
	/**Opcional. Periodo Facturacion - Hasta (AAAA-MM-DD). */
	PeriodoHasta: Date
	/**Opcional. Medio de Pago. */
	MedioPago: MedioPagoType
	/**Opcional. Tipo Cuenta de Pago. */
	TpoCtaPago: TpoCtaPago
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
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('IndNoRebaja')
		if (nd.length > 0) this.IndNoRebaja = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('TipoDespacho')
		if (nd.length > 0) this.TipoDespacho = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('IndTraslado')
		if (nd.length > 0) this.IndTraslado = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('TpoImpresion')
		if (nd.length > 0) this.TpoImpresion = <TpoImpresion>nd[0].textContent;
		nd = Node.getElementsByTagName('IndServicio')
		if (nd.length > 0) this.IndServicio = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('MntBruto')
		if (nd.length > 0) this.MntBruto = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('FmaPago')
		if (nd.length > 0) this.FmaPago = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('FmaPagExp')
		if (nd.length > 0) this.FmaPagExp = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TpoCtaPago')
		if (nd.length > 0) this.TpoCtaPago = <TpoCtaPago>nd[0].textContent;
		nd = Node.getElementsByTagName('NumCtaPago')
		if (nd.length > 0) this.NumCtaPago = nd[0].textContent;
		nd = Node.getElementsByTagName('BcoPago')
		if (nd.length > 0) this.BcoPago = nd[0].textContent;
		nd = Node.getElementsByTagName('TermPagoCdg')
		if (nd.length > 0) this.TermPagoCdg = nd[0].textContent;
		nd = Node.getElementsByTagName('TermPagoGlosa')
		if (nd.length > 0) this.TermPagoGlosa = nd[0].textContent;
		nd = Node.getElementsByTagName('TermPagoDias')
		if (nd.length > 0) this.TermPagoDias = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TipoDTE')
		if (nd.length > 0) this.TipoDTE = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('Folio')
		if (nd.length > 0) this.Folio = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('FchEmis')
		if (nd.length > 0) this.FchEmis = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('FchCancel')
		if (nd.length > 0) this.FchCancel = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('MntCancel')
		if (nd.length > 0) this.MntCancel = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('SaldoInsol')
		if (nd.length > 0) this.SaldoInsol = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntPagos');
		if (nd.length > 0) {
			this.MntPagos = <[MntPagos]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.MntPagos.push(new MntPagos());
				this.MntPagos[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('PeriodoDesde')
		if (nd.length > 0) this.PeriodoDesde = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('PeriodoHasta')
		if (nd.length > 0) this.PeriodoHasta = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('MedioPago')
		if (nd.length > 0) this.MedioPago = <MedioPagoType>nd[0].textContent;
		nd = Node.getElementsByTagName('FchVenc')
		if (nd.length > 0) this.FchVenc = new Date(nd[0].textContent);
	}

}

/***/
enum IndNoRebaja {
	NotadeCreditosinDerechoaDescontarDebito = 1,
}
/***/
enum TipoDespacho {
	DespachoporCuentadelComprador = 1,
	DespachoporCuentadelEmisoraInstalacionesdelComprador = 2,
	DespachoporCuentadelEmisoraOtrasInstalaciones = 3,
}
/***/
enum IndTraslado {
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
type TpoImpresion = 'N' | 'T'

/***/
enum IndServicio {
	FacturaciondeServiciosPeriodicosDomiciliarios = 1,
	FacturaciondeOtrosServiciosPeriodicos = 2,
	FacturadeServicio = 3,
}
/***/
enum MntBruto {
	MontodeLineasdeDetalleCorrespondeaValoresBrutosIVAImpuestosAdicionales = 1,
}
/***/
enum FmaPago {
	PagoContado = 1,
	PagoCredito = 2,
	SinCosto = 3,
}
type TpoCtaPago = 'AHORRO' | 'CORRIENTE' | 'VISTA'

/**Tipos de Documentos Tributarios Electronicos. */
enum DTEType {
	FacturaElectronica = 33,
	FacturaElectronicadeVentadeBienesyServiciosNoafectosoExentodeIVA = 34,
	FacturadeCompraElectronica = 46,
	GuiadeDespachoElectronica = 52,
	NotadeDebitoElectronica = 56,
	NotadeCreditoElectronica = 61,
}
/**Tabla de Montos de Pago. */
export class MntPagos {
	/**Fecha de Pago (AAAA-MM-DD). */
	FchPago: Date
	/**Monto de Pago. */
	MntPago: number
	/**Opcional. */
	GlosaPagos: string
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('GlosaPagos')
		if (nd.length > 0) this.GlosaPagos = nd[0].textContent;
		nd = Node.getElementsByTagName('FchPago')
		if (nd.length > 0) this.FchPago = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('MntPago')
		if (nd.length > 0) this.MntPago = parseFloat(nd[0].textContent);
	}

}

type MedioPagoType = 'CH' | 'LT' | 'EF' | 'PE' | 'TC' | 'CF' | 'OT'

/**Datos del Emisor. */
export class Emisor {
	/**RUT del Emisor del DTE. */
	RUTEmisor: string
	/**Nombre o Razon Social del Emisor. */
	RznSoc: string
	/**Giro Comercial del Emisor Relevante para el DTE . */
	GiroEmis: string
	/**Opcional. Telefono Emisor. */
	Telefono: [string]
	/**Opcional. Correo Elect. de contacto en empresa del  receptor . */
	CorreoEmisor: string
	/**Codigo de Actividad Economica del Emisor Relevante para el DTE. */
	Acteco: [number]
	/**Opcional. Emisor de una Guía de despacho para Exportación . */
	GuiaExport: GuiaExport
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
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('RznSoc')
		if (nd.length > 0) this.RznSoc = nd[0].textContent;
		nd = Node.getElementsByTagName('GiroEmis')
		if (nd.length > 0) this.GiroEmis = nd[0].textContent;
		nd = Node.getElementsByTagName('Telefono')
		if (nd.length > 0) {
			this.Telefono = <[string]>[];
			let itms = nd;
			for (let i = 0; i < itms.length; ++i) this.Telefono.push(itms[i].textContent);
		}

		nd = Node.getElementsByTagName('Acteco')
		if (nd.length > 0) {
			this.Acteco = <[number]>[];
			let itms = nd;
			for (let i = 0; i < itms.length; ++i) this.Acteco.push(parseFloat(itms[i].textContent));
		}

		nd = Node.getElementsByTagName('Sucursal')
		if (nd.length > 0) this.Sucursal = nd[0].textContent;
		nd = Node.getElementsByTagName('CdgSIISucur')
		if (nd.length > 0) this.CdgSIISucur = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CodAdicSucur')
		if (nd.length > 0) this.CodAdicSucur = nd[0].textContent;
		nd = Node.getElementsByTagName('DirOrigen')
		if (nd.length > 0) this.DirOrigen = nd[0].textContent;
		nd = Node.getElementsByTagName('CdgVendedor')
		if (nd.length > 0) this.CdgVendedor = nd[0].textContent;
		nd = Node.getElementsByTagName('IdAdicEmisor')
		if (nd.length > 0) this.IdAdicEmisor = nd[0].textContent;
		nd = Node.getElementsByTagName('RUTEmisor')
		if (nd.length > 0) this.RUTEmisor = nd[0].textContent;
		nd = Node.getElementsByTagName('CorreoEmisor')
		if (nd.length > 0) this.CorreoEmisor = nd[0].textContent;
		nd = Node.getElementsByTagName('GuiaExport');
		if (nd.length > 0) {
			this.GuiaExport = new GuiaExport();
			this.GuiaExport.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('CmnaOrigen')
		if (nd.length > 0) this.CmnaOrigen = nd[0].textContent;
		nd = Node.getElementsByTagName('CiudadOrigen')
		if (nd.length > 0) this.CiudadOrigen = nd[0].textContent;
	}

}

/**Emisor de una Guía de despacho para Exportación . */
export class GuiaExport {
	/**Opcional. Código Emisor Traslado Excepcional  . */
	CdgTraslado: CdgTraslado
	/**Opcional. Folio Autorización ( N° de Resolución del SI). */
	FolioAut: number
	/**Opcional. Fecha de emisión de la Resolución de autorización (AAAA-MM-DD). */
	FchAut: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('CdgTraslado')
		if (nd.length > 0) this.CdgTraslado = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('FolioAut')
		if (nd.length > 0) this.FolioAut = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('FchAut')
		if (nd.length > 0) this.FchAut = new Date(nd[0].textContent);
	}

}

/***/
enum CdgTraslado {
	N_1 = 1,
	N_2 = 2,
	N_3 = 3,
	N_4 = 4,
}
/**Datos del Receptor. */
export class Receptor {
	/**RUT del Receptor del DTE. */
	RUTRecep: string
	/**Opcional. Codigo Interno del Receptor. */
	CdgIntRecep: string
	/**Nombre o Razon Social del Receptor. */
	RznSocRecep: string
	/**Opcional. Receptor Extranjero. */
	Extranjero: Extranjero
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
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('CdgIntRecep')
		if (nd.length > 0) this.CdgIntRecep = nd[0].textContent;
		nd = Node.getElementsByTagName('GiroRecep')
		if (nd.length > 0) this.GiroRecep = nd[0].textContent;
		nd = Node.getElementsByTagName('Contacto')
		if (nd.length > 0) this.Contacto = nd[0].textContent;
		nd = Node.getElementsByTagName('DirRecep')
		if (nd.length > 0) this.DirRecep = nd[0].textContent;
		nd = Node.getElementsByTagName('DirPostal')
		if (nd.length > 0) this.DirPostal = nd[0].textContent;
		nd = Node.getElementsByTagName('RUTRecep')
		if (nd.length > 0) this.RUTRecep = nd[0].textContent;
		nd = Node.getElementsByTagName('RznSocRecep')
		if (nd.length > 0) this.RznSocRecep = nd[0].textContent;
		nd = Node.getElementsByTagName('Extranjero');
		if (nd.length > 0) {
			this.Extranjero = new Extranjero();
			this.Extranjero.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('CorreoRecep')
		if (nd.length > 0) this.CorreoRecep = nd[0].textContent;
		nd = Node.getElementsByTagName('CmnaRecep')
		if (nd.length > 0) this.CmnaRecep = nd[0].textContent;
		nd = Node.getElementsByTagName('CiudadRecep')
		if (nd.length > 0) this.CiudadRecep = nd[0].textContent;
		nd = Node.getElementsByTagName('CmnaPostal')
		if (nd.length > 0) this.CmnaPostal = nd[0].textContent;
		nd = Node.getElementsByTagName('CiudadPostal')
		if (nd.length > 0) this.CiudadPostal = nd[0].textContent;
	}

}

/**Receptor Extranjero. */
export class Extranjero {
	/**Opcional. Num. Identif. Receptor Extranjero. */
	NumId: string
	/**Opcional. Nacionalidad Receptor Extranjero. */
	Nacionalidad: string
	/**Opcional. Identificador Adicional del Receptor  extranjero. */
	IdAdicRecep: string
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('NumId')
		if (nd.length > 0) this.NumId = nd[0].textContent;
		nd = Node.getElementsByTagName('Nacionalidad')
		if (nd.length > 0) this.Nacionalidad = nd[0].textContent;
		nd = Node.getElementsByTagName('IdAdicRecep')
		if (nd.length > 0) this.IdAdicRecep = nd[0].textContent;
	}

}

/**Informacion de Transporte de Mercaderias. */
export class Transporte {
	/**Opcional. Patente del Vehiculo que Transporta los Bienes. */
	Patente: string
	/**Opcional. RUT del Transportista. */
	RUTTrans: string
	/**Opcional. */
	Chofer: Chofer
	/**Opcional. Direccion de Destino. */
	DirDest: string
	/**Opcional. Comuna de Destino. */
	CmnaDest: string
	/**Opcional. Ciudad de Destino. */
	CiudadDest: string
	/**Opcional. documentos de Exportación y guías de despacho . */
	Aduana: Aduana
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('Patente')
		if (nd.length > 0) this.Patente = nd[0].textContent;
		nd = Node.getElementsByTagName('DirDest')
		if (nd.length > 0) this.DirDest = nd[0].textContent;
		nd = Node.getElementsByTagName('RUTTrans')
		if (nd.length > 0) this.RUTTrans = nd[0].textContent;
		nd = Node.getElementsByTagName('Chofer');
		if (nd.length > 0) {
			this.Chofer = new Chofer();
			this.Chofer.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('CmnaDest')
		if (nd.length > 0) this.CmnaDest = nd[0].textContent;
		nd = Node.getElementsByTagName('CiudadDest')
		if (nd.length > 0) this.CiudadDest = nd[0].textContent;
		nd = Node.getElementsByTagName('Aduana');
		if (nd.length > 0) {
			this.Aduana = new Aduana();
			this.Aduana.ParseFromXMLElement(nd[0]);
		}

	}

}

/***/
export class Chofer {
	/**RUT del Chofer. */
	RUTChofer: string
	/**Nombre del Chofer. */
	NombreChofer: string
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('NombreChofer')
		if (nd.length > 0) this.NombreChofer = nd[0].textContent;
		nd = Node.getElementsByTagName('RUTChofer')
		if (nd.length > 0) this.RUTChofer = nd[0].textContent;
	}

}

/**documentos de Exportación y guías de despacho . */
export class Aduana {
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
	TipoBultos: [TipoBultos]
	/**Opcional. Monto del flete según moneda de venta. */
	MntFlete: number
	/**Opcional. Monto del seguro , según moneda de venta. */
	MntSeguro: number
	/**Opcional. Código del país del receptor extranjero de la mercadería,según tabla Países aduana. */
	CodPaisRecep: number
	/**Opcional. Código del país de destino extranjero de la mercadería,según tabla Países aduana. */
	CodPaisDestin: number
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('CodModVenta')
		if (nd.length > 0) this.CodModVenta = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CodClauVenta')
		if (nd.length > 0) this.CodClauVenta = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CodViaTransp')
		if (nd.length > 0) this.CodViaTransp = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('NombreTransp')
		if (nd.length > 0) this.NombreTransp = nd[0].textContent;
		nd = Node.getElementsByTagName('NomCiaTransp')
		if (nd.length > 0) this.NomCiaTransp = nd[0].textContent;
		nd = Node.getElementsByTagName('IdAdicTransp')
		if (nd.length > 0) this.IdAdicTransp = nd[0].textContent;
		nd = Node.getElementsByTagName('Booking')
		if (nd.length > 0) this.Booking = nd[0].textContent;
		nd = Node.getElementsByTagName('Operador')
		if (nd.length > 0) this.Operador = nd[0].textContent;
		nd = Node.getElementsByTagName('CodPtoEmbarque')
		if (nd.length > 0) this.CodPtoEmbarque = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('IdAdicPtoEmb')
		if (nd.length > 0) this.IdAdicPtoEmb = nd[0].textContent;
		nd = Node.getElementsByTagName('CodPtoDesemb')
		if (nd.length > 0) this.CodPtoDesemb = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('IdAdicPtoDesemb')
		if (nd.length > 0) this.IdAdicPtoDesemb = nd[0].textContent;
		nd = Node.getElementsByTagName('Tara')
		if (nd.length > 0) this.Tara = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CodUnidMedTara')
		if (nd.length > 0) this.CodUnidMedTara = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('PesoBruto')
		if (nd.length > 0) this.PesoBruto = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CodUnidPesoBruto')
		if (nd.length > 0) this.CodUnidPesoBruto = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('PesoNeto')
		if (nd.length > 0) this.PesoNeto = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CodUnidPesoNeto')
		if (nd.length > 0) this.CodUnidPesoNeto = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TotItems')
		if (nd.length > 0) this.TotItems = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TotBultos')
		if (nd.length > 0) this.TotBultos = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CodPaisRecep')
		if (nd.length > 0) this.CodPaisRecep = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CodPaisDestin')
		if (nd.length > 0) this.CodPaisDestin = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TotClauVenta')
		if (nd.length > 0) this.TotClauVenta = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('RUTCiaTransp')
		if (nd.length > 0) this.RUTCiaTransp = nd[0].textContent;
		nd = Node.getElementsByTagName('TipoBultos');
		if (nd.length > 0) {
			this.TipoBultos = <[TipoBultos]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.TipoBultos.push(new TipoBultos());
				this.TipoBultos[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('MntFlete')
		if (nd.length > 0) this.MntFlete = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntSeguro')
		if (nd.length > 0) this.MntSeguro = parseFloat(nd[0].textContent);
	}

}

/**Tabla de descripción de los distintos tipos de bultos. */
export class TipoBultos {
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
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('CodTpoBultos')
		if (nd.length > 0) this.CodTpoBultos = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CantBultos')
		if (nd.length > 0) this.CantBultos = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('Marcas')
		if (nd.length > 0) this.Marcas = nd[0].textContent;
		nd = Node.getElementsByTagName('IdContainer')
		if (nd.length > 0) this.IdContainer = nd[0].textContent;
		nd = Node.getElementsByTagName('Sello')
		if (nd.length > 0) this.Sello = nd[0].textContent;
		nd = Node.getElementsByTagName('EmisorSello')
		if (nd.length > 0) this.EmisorSello = nd[0].textContent;
	}

}

/**Montos Totales del DTE. */
export class Totales {
	/**Tipo de Moneda en que se regisrtra la transacción.  Tabla de Monedas  de Aduanas. */
	TpoMoneda: TipMonType
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
	ImptoReten: [ImptoReten]
	/**Opcional. IVA No Retenido. */
	IVANoRet: number
	/**Opcional. Credito Especial Empresas Constructoras. */
	CredEC: number
	/**Opcional. Garantia por Deposito de Envases o Embalajes. */
	GrntDep: number
	/**Opcional. Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
	Comisiones: Comisiones
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
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('TpoMoneda')
		if (nd.length > 0) this.TpoMoneda = <TipMonType>nd[0].textContent;
		nd = Node.getElementsByTagName('MntNeto')
		if (nd.length > 0) this.MntNeto = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntExe')
		if (nd.length > 0) this.MntExe = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntBase')
		if (nd.length > 0) this.MntBase = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntMargenCom')
		if (nd.length > 0) this.MntMargenCom = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TasaIVA')
		if (nd.length > 0) this.TasaIVA = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('IVA')
		if (nd.length > 0) this.IVA = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('IVAProp')
		if (nd.length > 0) this.IVAProp = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('IVATerc')
		if (nd.length > 0) this.IVATerc = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('ImptoReten');
		if (nd.length > 0) {
			this.ImptoReten = <[ImptoReten]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.ImptoReten.push(new ImptoReten());
				this.ImptoReten[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('IVANoRet')
		if (nd.length > 0) this.IVANoRet = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CredEC')
		if (nd.length > 0) this.CredEC = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('GrntDep')
		if (nd.length > 0) this.GrntDep = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('Comisiones');
		if (nd.length > 0) {
			this.Comisiones = new Comisiones();
			this.Comisiones.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('MntTotal')
		if (nd.length > 0) this.MntTotal = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MontoNF')
		if (nd.length > 0) this.MontoNF = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MontoPeriodo')
		if (nd.length > 0) this.MontoPeriodo = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('SaldoAnterior')
		if (nd.length > 0) this.SaldoAnterior = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('VlrPagar')
		if (nd.length > 0) this.VlrPagar = parseFloat(nd[0].textContent);
	}

}

type TipMonType = 'BOLIVAR' | 'BOLIVIANO' | 'CHELIN' | 'CORONA DIN' | 'CORONA NOR' | 'CORONA SC' | 'CRUZEIRO REAL' | 'DIRHAM' | 'DOLAR AUST' | 'DOLAR CAN' | 'DOLAR HK' | 'DOLAR NZ' | 'DOLAR SIN' | 'DOLAR TAI' | 'DOLAR USA' | 'DRACMA' | 'ESCUDO' | 'EURO' | 'FLORIN' | 'FRANCO BEL' | 'FRANCO FR' | 'FRANCO SZ' | 'GUARANI' | 'LIBRA EST' | 'LIRA' | 'MARCO AL' | 'MARCO FIN' | 'NUEVO SOL' | 'OTRAS MONEDAS' | 'PESETA' | 'PESO' | 'PESO CL' | 'PESO COL' | 'PESO MEX' | 'PESO URUG' | 'RAND' | 'RENMINBI' | 'RUPIA' | 'SUCRE' | 'YEN'

/**Impuestos y Retenciones Adicionales. */
export class ImptoReten {
	/**Tipo de Impuesto o Retencion Adicional. */
	TipoImp: ImpAdicDTEType
	/**Opcional. Tasa de Impuesto o Retencion. */
	TasaImp: number
	/**Monto del Impuesto o Retencion. */
	MontoImp: number
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('TasaImp')
		if (nd.length > 0) this.TasaImp = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TipoImp')
		if (nd.length > 0) this.TipoImp = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('MontoImp')
		if (nd.length > 0) this.MontoImp = parseFloat(nd[0].textContent);
	}

}

/**Tipo de Impuesto o Retencion Adicional de los DTE. */
enum ImpAdicDTEType {
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
export class Comisiones {
	/**Numero Secuencial de Linea. */
	NroLinCom: number
	/**C (comisión) u O (otros cargos). */
	TipoMovim: TipoMovim
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
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinCom')
		if (nd.length > 0) this.NroLinCom = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TipoMovim')
		if (nd.length > 0) this.TipoMovim = <TipoMovim>nd[0].textContent;
		nd = Node.getElementsByTagName('Glosa')
		if (nd.length > 0) this.Glosa = nd[0].textContent;
		nd = Node.getElementsByTagName('TasaComision')
		if (nd.length > 0) this.TasaComision = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('ValComNeto')
		if (nd.length > 0) this.ValComNeto = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('ValComExe')
		if (nd.length > 0) this.ValComExe = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('ValComIVA')
		if (nd.length > 0) this.ValComIVA = parseFloat(nd[0].textContent);
	}

}

type TipoMovim = 'C' | 'O'

/**Otra Moneda . */
export class OtraMoneda {
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
	ImpRetOtrMnda: [ImpRetOtrMnda]
	/**Opcional. IVA no retenido Otra Moneda . */
	IVANoRetOtrMnda: number
	/**Monto Total Otra Moneda. */
	MntTotOtrMnda: number
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('TpoMoneda')
		if (nd.length > 0) this.TpoMoneda = <TipMonType>nd[0].textContent;
		nd = Node.getElementsByTagName('TpoCambio')
		if (nd.length > 0) this.TpoCambio = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntNetoOtrMnda')
		if (nd.length > 0) this.MntNetoOtrMnda = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntExeOtrMnda')
		if (nd.length > 0) this.MntExeOtrMnda = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntFaeCarneOtrMnda')
		if (nd.length > 0) this.MntFaeCarneOtrMnda = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntMargComOtrMnda')
		if (nd.length > 0) this.MntMargComOtrMnda = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('IVAOtrMnda')
		if (nd.length > 0) this.IVAOtrMnda = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('ImpRetOtrMnda');
		if (nd.length > 0) {
			this.ImpRetOtrMnda = <[ImpRetOtrMnda]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.ImpRetOtrMnda.push(new ImpRetOtrMnda());
				this.ImpRetOtrMnda[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('IVANoRetOtrMnda')
		if (nd.length > 0) this.IVANoRetOtrMnda = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntTotOtrMnda')
		if (nd.length > 0) this.MntTotOtrMnda = parseFloat(nd[0].textContent);
	}

}

/**Impuestos y Retenciones Adicionales. */
export class ImpRetOtrMnda {
	/**Tipo de Impuesto o Retencion Adicional. */
	TipoImpOtrMnda: ImpAdicDTEType
	/**Opcional. Tasa de Impuesto o Retencion. */
	TasaImpOtrMnda: number
	/**Valor del impuesto o retención en otra moneda . */
	VlrImpOtrMnda: number
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('TipoImpOtrMnda')
		if (nd.length > 0) this.TipoImpOtrMnda = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('TasaImpOtrMnda')
		if (nd.length > 0) this.TasaImpOtrMnda = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('VlrImpOtrMnda')
		if (nd.length > 0) this.VlrImpOtrMnda = parseFloat(nd[0].textContent);
	}

}

/**Detalle de Itemes del Documento. */
export class Detalle {
	/**Numero Secuencial de Linea. */
	NroLinDet: number
	/**Opcional. Codificacion del Item. */
	CdgItem: [CdgItem]
	/**Tipo de Documento que se Liquida. */
	TpoDocLiq: string
	/**Opcional. Indicador de Exencion/Facturacion. */
	IndExe: IndExe
	/**Opcional. Sólo para transacciones realizadas por agentes retenedores. */
	Retenedor: Retenedor
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
	Subcantidad: [Subcantidad]
	/**Opcional. Fecha Elaboracion del Item. */
	FchElabor: Date
	/**Opcional. Fecha Vencimiento del Item. */
	FchVencim: Date
	/**Opcional. Unidad de Medida. */
	UnmdItem: string
	/**Opcional. Precio Unitario del Item en Pesos. */
	PrcItem: number
	/**Opcional. Precio del Item en Otra Moneda. */
	OtrMnda: OtrMnda
	/**Opcional. Porcentaje de Descuento. */
	DescuentoPct: number
	/**Opcional. Monto de Descuento. */
	DescuentoMonto: number
	/**Opcional. Desglose del Descuento. */
	SubDscto: [SubDscto]
	/**Opcional. Porcentaje de Recargo. */
	RecargoPct: number
	/**Opcional. Monto de Recargo. */
	RecargoMonto: number
	/**Opcional. Desglose del Recargo. */
	SubRecargo: [SubRecargo]
	/**Opcional. Codigo de Impuesto Adicional o Retencion. */
	CodImpAdic: [ImpAdicDTEType]
	/**Monto por Linea de Detalle. Corresponde al Monto Neto, a menos que MntBruto Indique lo Contrario . */
	MontoItem: number
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinDet')
		if (nd.length > 0) this.NroLinDet = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TpoDocLiq')
		if (nd.length > 0) this.TpoDocLiq = nd[0].textContent;
		nd = Node.getElementsByTagName('IndExe')
		if (nd.length > 0) this.IndExe = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('NmbItem')
		if (nd.length > 0) this.NmbItem = nd[0].textContent;
		nd = Node.getElementsByTagName('DscItem')
		if (nd.length > 0) this.DscItem = nd[0].textContent;
		nd = Node.getElementsByTagName('UnmdRef')
		if (nd.length > 0) this.UnmdRef = nd[0].textContent;
		nd = Node.getElementsByTagName('UnmdItem')
		if (nd.length > 0) this.UnmdItem = nd[0].textContent;
		nd = Node.getElementsByTagName('RecargoPct')
		if (nd.length > 0) this.RecargoPct = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('CdgItem');
		if (nd.length > 0) {
			this.CdgItem = <[CdgItem]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.CdgItem.push(new CdgItem());
				this.CdgItem[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('Retenedor');
		if (nd.length > 0) {
			this.Retenedor = new Retenedor();
			this.Retenedor.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('QtyRef')
		if (nd.length > 0) this.QtyRef = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('PrcRef')
		if (nd.length > 0) this.PrcRef = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('QtyItem')
		if (nd.length > 0) this.QtyItem = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('Subcantidad');
		if (nd.length > 0) {
			this.Subcantidad = <[Subcantidad]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.Subcantidad.push(new Subcantidad());
				this.Subcantidad[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('FchElabor')
		if (nd.length > 0) this.FchElabor = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('FchVencim')
		if (nd.length > 0) this.FchVencim = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('PrcItem')
		if (nd.length > 0) this.PrcItem = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('OtrMnda');
		if (nd.length > 0) {
			this.OtrMnda = new OtrMnda();
			this.OtrMnda.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('DescuentoPct')
		if (nd.length > 0) this.DescuentoPct = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('DescuentoMonto')
		if (nd.length > 0) this.DescuentoMonto = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('SubDscto');
		if (nd.length > 0) {
			this.SubDscto = <[SubDscto]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.SubDscto.push(new SubDscto());
				this.SubDscto[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('RecargoMonto')
		if (nd.length > 0) this.RecargoMonto = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('SubRecargo');
		if (nd.length > 0) {
			this.SubRecargo = <[SubRecargo]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.SubRecargo.push(new SubRecargo());
				this.SubRecargo[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('CodImpAdic')
		if (nd.length > 0) {
			this.CodImpAdic = <[ImpAdicDTEType]>[];
			let itms = nd;
			for (let i = 0; i < itms.length; ++i) this.CodImpAdic.push(parseInt(itms[i].textContent));
		}

		nd = Node.getElementsByTagName('MontoItem')
		if (nd.length > 0) this.MontoItem = parseFloat(nd[0].textContent);
	}

}

/***/
enum IndExe {
	ElProductooServicioNOESTAAfectoaIVA = 1,
	ElProductooServicioNOESFacturable = 2,
	GarantiaporDepositoEnvase = 3,
	ElproductoNoConstituyeVenta = 4,
	ItemaRebajar = 5,
	Nofacturablesnegativos = 6,
}
/**Codificacion del Item. */
export class CdgItem {
	/**Tipo de Codificacion. */
	TpoCodigo: string
	/**Valor del Codigo de Item, para la Codificacion Particular. */
	VlrCodigo: string
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('TpoCodigo')
		if (nd.length > 0) this.TpoCodigo = nd[0].textContent;
		nd = Node.getElementsByTagName('VlrCodigo')
		if (nd.length > 0) this.VlrCodigo = nd[0].textContent;
	}

}

/**Sólo para transacciones realizadas por agentes retenedores. */
export class Retenedor {
	/**Indicador Agente Retenedor. */
	IndAgente: IndAgente
	/**Opcional. Monto Base Faenamiento. */
	MntBaseFaena: number
	/**Opcional. Márgenes de Comercialización. */
	MntMargComer: number
	/**Opcional. Precio Unitario Neto Consumidor Final. */
	PrcConsFinal: number
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('IndAgente')
		if (nd.length > 0) this.IndAgente = <IndAgente>nd[0].textContent;
		nd = Node.getElementsByTagName('MntBaseFaena')
		if (nd.length > 0) this.MntBaseFaena = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MntMargComer')
		if (nd.length > 0) this.MntMargComer = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('PrcConsFinal')
		if (nd.length > 0) this.PrcConsFinal = parseFloat(nd[0].textContent);
	}

}

type IndAgente = 'R'

/**Distribucion de la Cantidad. */
export class Subcantidad {
	/**Cantidad  Distribuida. */
	SubQty: number
	/**Codigo Descriptivo de la Subcantidad. */
	SubCod: string
	/**Opcional. Tipo de Código Subcantidad. */
	TipCodSubQty: string
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('SubCod')
		if (nd.length > 0) this.SubCod = nd[0].textContent;
		nd = Node.getElementsByTagName('TipCodSubQty')
		if (nd.length > 0) this.TipCodSubQty = nd[0].textContent;
		nd = Node.getElementsByTagName('SubQty')
		if (nd.length > 0) this.SubQty = parseFloat(nd[0].textContent);
	}

}

/**Precio del Item en Otra Moneda. */
export class OtrMnda {
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
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('Moneda')
		if (nd.length > 0) this.Moneda = nd[0].textContent;
		nd = Node.getElementsByTagName('PrcOtrMon')
		if (nd.length > 0) this.PrcOtrMon = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('FctConv')
		if (nd.length > 0) this.FctConv = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('DctoOtrMnda')
		if (nd.length > 0) this.DctoOtrMnda = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('RecargoOtrMnda')
		if (nd.length > 0) this.RecargoOtrMnda = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('MontoItemOtrMnda')
		if (nd.length > 0) this.MontoItemOtrMnda = parseFloat(nd[0].textContent);
	}

}

/**Desglose del Descuento. */
export class SubDscto {
	/**Tipo de SubDescuento. */
	TipoDscto: DineroPorcentajeType
	/**Valor del SubDescuento. */
	ValorDscto: number
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('TipoDscto')
		if (nd.length > 0) this.TipoDscto = <DineroPorcentajeType>nd[0].textContent;
		nd = Node.getElementsByTagName('ValorDscto')
		if (nd.length > 0) this.ValorDscto = parseFloat(nd[0].textContent);
	}

}

type DineroPorcentajeType = '%' | '$'

/**Desglose del Recargo. */
export class SubRecargo {
	/**Tipo de SubRecargo. */
	TipoRecargo: DineroPorcentajeType
	/**Valor de SubRecargo. */
	ValorRecargo: number
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('TipoRecargo')
		if (nd.length > 0) this.TipoRecargo = <DineroPorcentajeType>nd[0].textContent;
		nd = Node.getElementsByTagName('ValorRecargo')
		if (nd.length > 0) this.ValorRecargo = parseFloat(nd[0].textContent);
	}

}

/**Subtotales Informativos. */
export class SubTotInfo {
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
	LineasDeta: [number]
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('NroSTI')
		if (nd.length > 0) this.NroSTI = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('GlosaSTI')
		if (nd.length > 0) this.GlosaSTI = nd[0].textContent;
		nd = Node.getElementsByTagName('OrdenSTI')
		if (nd.length > 0) this.OrdenSTI = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('LineasDeta')
		if (nd.length > 0) {
			this.LineasDeta = <[number]>[];
			let itms = nd;
			for (let i = 0; i < itms.length; ++i) this.LineasDeta.push(parseFloat(itms[i].textContent));
		}

		nd = Node.getElementsByTagName('SubTotNetoSTI')
		if (nd.length > 0) this.SubTotNetoSTI = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('SubTotIVASTI')
		if (nd.length > 0) this.SubTotIVASTI = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('SubTotAdicSTI')
		if (nd.length > 0) this.SubTotAdicSTI = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('SubTotExeSTI')
		if (nd.length > 0) this.SubTotExeSTI = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('ValSubtotSTI')
		if (nd.length > 0) this.ValSubtotSTI = parseFloat(nd[0].textContent);
	}

}

/**Descuentos y/o Recargos que afectan al total del Documento. */
export class DscRcgGlobal {
	/**Numero Secuencial de Linea. */
	NroLinDR: number
	/**Tipo de Movimiento. */
	TpoMov: TpoMov
	/**Opcional. Descripcion del Descuento o Recargo. */
	GlosaDR: string
	/**Unidad en que se Expresa el Valor. */
	TpoValor: DineroPorcentajeType
	/**Valor del Descuento o Recargo. */
	ValorDR: number
	/**Opcional. Valor en otra moneda. */
	ValorDROtrMnda: number
	/**Opcional. Indica si el D/R es No Afecto o No Facturable. */
	IndExeDR: IndExeDR
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinDR')
		if (nd.length > 0) this.NroLinDR = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TpoMov')
		if (nd.length > 0) this.TpoMov = <TpoMov>nd[0].textContent;
		nd = Node.getElementsByTagName('GlosaDR')
		if (nd.length > 0) this.GlosaDR = nd[0].textContent;
		nd = Node.getElementsByTagName('IndExeDR')
		if (nd.length > 0) this.IndExeDR = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('TpoValor')
		if (nd.length > 0) this.TpoValor = <DineroPorcentajeType>nd[0].textContent;
		nd = Node.getElementsByTagName('ValorDR')
		if (nd.length > 0) this.ValorDR = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('ValorDROtrMnda')
		if (nd.length > 0) this.ValorDROtrMnda = parseFloat(nd[0].textContent);
	}

}

type TpoMov = 'D' | 'R'

/***/
enum IndExeDR {
	DescuentoRecargoGlobalNoAfecto = 1,
	DescuentoRecargoNoFacturable = 2,
}
/**Identificacion de otros documentos Referenciados por Documento. */
export class Referencia {
	/**Numero Secuencial de Linea de Referencia. */
	NroLinRef: number
	/**Tipo de Documento de Referencia. */
	TpoDocRef: string
	/**Opcional. Indica que se esta Referenciando un Conjunto de Documentos. */
	IndGlobal: IndGlobal
	/**Folio del Documento de Referencia. */
	FolioRef: string
	/**Opcional. RUT Otro Contribuyente. */
	RUTOtr: string
	/**Opcional. Identificador Adicional del otro contribuyente. */
	IdAdicOtr: string
	/**Fecha de la Referencia. */
	FchRef: Date
	/**Opcional. Tipo de Uso de la Referencia. */
	CodRef: CodRef
	/**Opcional. Razon Explicita por la que se Referencia el Documento. */
	RazonRef: string
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('NroLinRef')
		if (nd.length > 0) this.NroLinRef = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TpoDocRef')
		if (nd.length > 0) this.TpoDocRef = nd[0].textContent;
		nd = Node.getElementsByTagName('IndGlobal')
		if (nd.length > 0) this.IndGlobal = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('IdAdicOtr')
		if (nd.length > 0) this.IdAdicOtr = nd[0].textContent;
		nd = Node.getElementsByTagName('FchRef')
		if (nd.length > 0) this.FchRef = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('CodRef')
		if (nd.length > 0) this.CodRef = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('RazonRef')
		if (nd.length > 0) this.RazonRef = nd[0].textContent;
		nd = Node.getElementsByTagName('FolioRef')
		if (nd.length > 0) this.FolioRef = nd[0].textContent;
		nd = Node.getElementsByTagName('RUTOtr')
		if (nd.length > 0) this.RUTOtr = nd[0].textContent;
	}

}

/***/
enum IndGlobal {
	ElDocumentohaceReferenciaaunConjuntodeDocumentosTributariosdelMismoTipo = 1,
}
/***/
enum CodRef {
	AnulaDocumentodeReferencia = 1,
	CorrigeTextodelDocumentodeReferencia = 2,
	CorrigeMontos = 3,
}
/**Timbre Electronico de DTE. */
export class TED {

	version: string = "1.0"
	/**Datos Basicos de Documento. */
	DD: DD
	/**Valor de Firma Digital  sobre DD. */
	FRMT: FRMT
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('version')) this.version = Node.getAttribute('version');
		nd = Node.getElementsByTagName('DD');
		if (nd.length > 0) {
			this.DD = new DD();
			this.DD.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('FRMT');
		if (nd.length > 0) {
			this.FRMT = new FRMT();
			this.FRMT.ParseFromXMLElement(nd[0]);
		}

	}

}

/**Datos Basicos de Documento. */
export class DD {
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
	CAF: CAF
	/**TimeStamp de Generacion del Timbre. */
	TSTED: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('RSR')
		if (nd.length > 0) this.RSR = nd[0].textContent;
		nd = Node.getElementsByTagName('MNT')
		if (nd.length > 0) this.MNT = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('IT1')
		if (nd.length > 0) this.IT1 = nd[0].textContent;
		nd = Node.getElementsByTagName('RE')
		if (nd.length > 0) this.RE = nd[0].textContent;
		nd = Node.getElementsByTagName('TD')
		if (nd.length > 0) this.TD = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('F')
		if (nd.length > 0) this.F = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('FE')
		if (nd.length > 0) this.FE = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('RR')
		if (nd.length > 0) this.RR = nd[0].textContent;
		nd = Node.getElementsByTagName('CAF');
		if (nd.length > 0) {
			this.CAF = new CAF();
			this.CAF.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('TSTED')
		if (nd.length > 0) this.TSTED = new Date(nd[0].textContent);
	}

}

/**Codigo Autorizacion Folios. */
export class CAF {

	version: string = "1.0"
	/**Datos de Autorizacion de Folios. */
	DA: DA
	/**Firma Digital (RSA) del SII Sobre DA. */
	FRMA: FRMA
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('version')) this.version = Node.getAttribute('version');
		nd = Node.getElementsByTagName('DA');
		if (nd.length > 0) {
			this.DA = new DA();
			this.DA.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('FRMA');
		if (nd.length > 0) {
			this.FRMA = new FRMA();
			this.FRMA.ParseFromXMLElement(nd[0]);
		}

	}

}

/**Datos de Autorizacion de Folios. */
export class DA {
	/**RUT Emisor. */
	RE: string
	/**Razon Social Emisor. */
	RS: string
	/**Tipo DTE. */
	TD: DTEType
	/**Rango Autorizado de Folios. */
	RNG: RNG
	/**Fecha Autorizacion en Formato AAAA-MM-DD. */
	FA: Date
	/**Opcional. Clave Publica RSA del Solicitante. */
	RSAPK: RSAPK
	/**Opcional. Clave Publica DSA del Solicitante. */
	DSAPK: DSAPK
	/**Identificador de Llave. */
	IDK: number
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('RS')
		if (nd.length > 0) this.RS = nd[0].textContent;
		nd = Node.getElementsByTagName('IDK')
		if (nd.length > 0) this.IDK = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('RE')
		if (nd.length > 0) this.RE = nd[0].textContent;
		nd = Node.getElementsByTagName('TD')
		if (nd.length > 0) this.TD = parseInt(nd[0].textContent);
		nd = Node.getElementsByTagName('RNG');
		if (nd.length > 0) {
			this.RNG = new RNG();
			this.RNG.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('FA')
		if (nd.length > 0) this.FA = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('RSAPK');
		if (nd.length > 0) {
			this.RSAPK = new RSAPK();
			this.RSAPK.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('DSAPK');
		if (nd.length > 0) {
			this.DSAPK = new DSAPK();
			this.DSAPK.ParseFromXMLElement(nd[0]);
		}

	}

}

/**Rango Autorizado de Folios. */
export class RNG {
	/**Folio Inicial (Desde). */
	D: number
	/**Folio Final (Hasta). */
	H: number
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('D')
		if (nd.length > 0) this.D = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('H')
		if (nd.length > 0) this.H = parseFloat(nd[0].textContent);
	}

}

/**Clave Publica RSA del Solicitante. */
export class RSAPK {
	/**Modulo RSA. */
	M: string
	/**Exponente RSA. */
	E: string
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('M')
		if (nd.length > 0) this.M = nd[0].textContent;
		nd = Node.getElementsByTagName('E')
		if (nd.length > 0) this.E = nd[0].textContent;
	}

}

/**Clave Publica DSA del Solicitante. */
export class DSAPK {
	/**Modulo Primo. */
	P: string
	/**Entero Divisor de P - 1. */
	Q: string
	/**Entero f(P, Q). */
	G: string
	/**G**X mod P. */
	Y: string
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('P')
		if (nd.length > 0) this.P = nd[0].textContent;
		nd = Node.getElementsByTagName('Q')
		if (nd.length > 0) this.Q = nd[0].textContent;
		nd = Node.getElementsByTagName('G')
		if (nd.length > 0) this.G = nd[0].textContent;
		nd = Node.getElementsByTagName('Y')
		if (nd.length > 0) this.Y = nd[0].textContent;
	}

}

/**Firma Digital (RSA) del SII Sobre DA. */
export class FRMA {

	algoritmo: string = "SHA1withRSA"
	/**Opcional. */
	Valor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('algoritmo')) this.algoritmo = Node.getAttribute('algoritmo');
		this.Valor = Node.textContent || '';
	}

}

/**Valor de Firma Digital  sobre DD. */
export class FRMT {

	algoritmo: string
	/**Opcional. */
	Valor: string
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('algoritmo')) this.algoritmo = <string>Node.getAttribute('algoritmo');
		this.Valor = Node.textContent || '';
	}

}

type algoritmo = 'SHA1withRSA' | 'SHA1withDSA'

/**Informacion Tributaria de Liquidaciones. */
export class Liquidacion {

	ID: string
	/**Identificacion y Totales del Documento. */
	Encabezado: Encabezado
	/**Detalle de Itemes del Documento. */
	Detalle: [Detalle]
	/**Opcional. Subtotales Informativos. */
	SubTotInfo: [SubTotInfo]
	/**Opcional. Identificacion de otros documentos Referenciados por Documento. */
	Referencia: [Referencia]
	/**Opcional. Comisiones y otros cargos es obligatoria para Liquidaciones Factura . */
	Comisiones: [Comisiones]
	/**Timbre Electronico de DTE. */
	TED: TED
	/**Fecha y Hora en que se Firmo Digitalmente el Documento AAAA-MM-DDTHH:MI:SS. */
	TmstFirma: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('ID')) this.ID = <string>Node.getAttribute('ID');
		nd = Node.getElementsByTagName('Encabezado');
		if (nd.length > 0) {
			this.Encabezado = new Encabezado();
			this.Encabezado.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('Detalle');
		if (nd.length > 0) {
			this.Detalle = <[Detalle]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.Detalle.push(new Detalle());
				this.Detalle[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('SubTotInfo');
		if (nd.length > 0) {
			this.SubTotInfo = <[SubTotInfo]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.SubTotInfo.push(new SubTotInfo());
				this.SubTotInfo[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('Referencia');
		if (nd.length > 0) {
			this.Referencia = <[Referencia]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.Referencia.push(new Referencia());
				this.Referencia[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('Comisiones');
		if (nd.length > 0) {
			this.Comisiones = <[Comisiones]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.Comisiones.push(new Comisiones());
				this.Comisiones[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('TED');
		if (nd.length > 0) {
			this.TED = new TED();
			this.TED.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('TmstFirma')
		if (nd.length > 0) this.TmstFirma = new Date(nd[0].textContent);
	}

}

/**Informacion Tributaria de exportaciones. */
export class Exportaciones {

	ID: string
	/**Identificacion y Totales del Documento. */
	Encabezado: Encabezado
	/**Detalle de Itemes del Documento. */
	Detalle: [Detalle]
	/**Opcional. Subtotales Informativos. */
	SubTotInfo: [SubTotInfo]
	/**Opcional. Descuentos y/o Recargos que afectan al total del Documento. */
	DscRcgGlobal: [DscRcgGlobal]
	/**Opcional. Identificacion de otros documentos Referenciados por Documento. */
	Referencia: [Referencia]
	/**Timbre Electronico de DTE. */
	TED: TED
	/**Fecha y Hora en que se Firmo Digitalmente el Documento AAAA-MM-DDTHH:MI:SS. */
	TmstFirma: Date
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('ID')) this.ID = <string>Node.getAttribute('ID');
		nd = Node.getElementsByTagName('Encabezado');
		if (nd.length > 0) {
			this.Encabezado = new Encabezado();
			this.Encabezado.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('Detalle');
		if (nd.length > 0) {
			this.Detalle = <[Detalle]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.Detalle.push(new Detalle());
				this.Detalle[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('SubTotInfo');
		if (nd.length > 0) {
			this.SubTotInfo = <[SubTotInfo]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.SubTotInfo.push(new SubTotInfo());
				this.SubTotInfo[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('DscRcgGlobal');
		if (nd.length > 0) {
			this.DscRcgGlobal = <[DscRcgGlobal]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.DscRcgGlobal.push(new DscRcgGlobal());
				this.DscRcgGlobal[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('Referencia');
		if (nd.length > 0) {
			this.Referencia = <[Referencia]>[];
			for (let i = 0; i < nd.length; ++i) {
				this.Referencia.push(new Referencia());
				this.Referencia[i].ParseFromXMLElement(nd[i]);
			}
		}

		nd = Node.getElementsByTagName('TED');
		if (nd.length > 0) {
			this.TED = new TED();
			this.TED.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('TmstFirma')
		if (nd.length > 0) this.TmstFirma = new Date(nd[0].textContent);
	}

}

/**Envio de Documentos Tributarios Electronicos. */
export class EnvioDTE {

	version: string = "1.0"
	/**Conjunto de DTE enviados. */
	SetDTE: SetDTE
	/**Firma Digital sobre SetDTE. */
	Signature: FirmaDigital.Signature
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('version')) this.version = Node.getAttribute('version');
		nd = Node.getElementsByTagName('SetDTE');
		if (nd.length > 0) {
			this.SetDTE = new SetDTE();
			this.SetDTE.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('Signature');
		if (nd.length > 0) {
			this.Signature = new FirmaDigital.Signature();
			this.Signature.ParseFromXMLElement(nd[0]);
		}

	}

}

/**Conjunto de DTE enviados. */
export class SetDTE {

	ID: string
	/**Resumen de Informacion Enviada. */
	Caratula: Caratula
	/**Documento Tributario Electronico. */
	DTE: [DTE]
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('ID')) this.ID = <string>Node.getAttribute('ID');
		nd = Node.getElementsByTagName('Caratula');
		if (nd.length > 0) {
			this.Caratula = new Caratula();
			this.Caratula.ParseFromXMLElement(nd[0]);
		}

		nd = Node.getElementsByTagName('DTE');
		if (nd.length > 0) {
			this.DTE = <[DTE]>[];
			for (let i = 0; i < nd.length; ++i) {
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
	SubTotDTE: [SubTotDTE]
	ParseFromXMLElement = (Node: Element) => {
		let nd: NodeListOf<Element>
		if (Node.hasAttribute('version')) this.version = Node.getAttribute('version');
		nd = Node.getElementsByTagName('RutEmisor')
		if (nd.length > 0) this.RutEmisor = nd[0].textContent;
		nd = Node.getElementsByTagName('RutEnvia')
		if (nd.length > 0) this.RutEnvia = nd[0].textContent;
		nd = Node.getElementsByTagName('RutReceptor')
		if (nd.length > 0) this.RutReceptor = nd[0].textContent;
		nd = Node.getElementsByTagName('FchResol')
		if (nd.length > 0) this.FchResol = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('NroResol')
		if (nd.length > 0) this.NroResol = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TmstFirmaEnv')
		if (nd.length > 0) this.TmstFirmaEnv = new Date(nd[0].textContent);
		nd = Node.getElementsByTagName('SubTotDTE');
		if (nd.length > 0) {
			this.SubTotDTE = <[SubTotDTE]>[];
			for (let i = 0; i < nd.length; ++i) {
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
		let nd: NodeListOf<Element>
		nd = Node.getElementsByTagName('NroDTE')
		if (nd.length > 0) this.NroDTE = parseFloat(nd[0].textContent);
		nd = Node.getElementsByTagName('TpoDTE')
		if (nd.length > 0) this.TpoDTE = parseInt(nd[0].textContent);
	}

}

/**Todos los tipos de Documentos Tributarios Electronicos. */
enum DOCType {
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
