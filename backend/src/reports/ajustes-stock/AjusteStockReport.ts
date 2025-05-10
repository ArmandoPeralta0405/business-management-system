import { ReportGenerator } from '../base/ReportGenerator';
import { IAjusteStockView } from '../../models/AjusteStock.model';

export class AjusteStockReport extends ReportGenerator<IAjusteStockView> {
    protected getFileName(): string {
        return 'informe-ajustes-stock';
    }

    protected getDocumentDefinition(ajustes: IAjusteStockView[]): any {
        // Colores inspirados en Bootstrap
        const colors = {
            primary: '#007bff',
            secondary: '#6c757d',
            success: '#28a745',
            info: '#17a2b8',
            light: '#f8f9fa',
            dark: '#343a40',
            white: '#ffffff',
            lightGray: '#e9ecef',
            borderColor: '#dee2e6'
        };

        // Obtener fechas mínima y máxima de los datos para mostrar en el informe
        let fechaMinima = '';
        let fechaMaxima = '';
        let movimientoDescripcion = '';
        
        if (ajustes.length > 0) {
            // Ordenar por fecha para obtener la primera y última
            const ajustesOrdenados = [...ajustes].sort((a, b) => 
                new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
            );
            
            fechaMinima = ajustesOrdenados[0].fecha;
            fechaMaxima = ajustesOrdenados[ajustesOrdenados.length - 1].fecha;
            
            // Si todos los ajustes tienen el mismo movimiento, mostrar su descripción
            const movimientoUnico = ajustes.every(a => a.id_movimiento === ajustes[0].id_movimiento);
            if (movimientoUnico) {
                movimientoDescripcion = ajustes[0].movimiento_descripcion;
            }
        }

        return {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],

            // Definición de fuentes
            fonts: {
                // Usar las fuentes predeterminadas de PDFMake
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-MediumItalic.ttf'
                }
            },

            header: {
                columns: [
                    {
                        text: 'Business Management Systems',
                        alignment: 'left',
                        margin: [40, 20, 0, 0],
                        fontSize: 10,
                        color: colors.secondary
                    },
                    {
                        text: new Date().toLocaleDateString(),
                        alignment: 'right',
                        margin: [0, 20, 40, 0],
                        fontSize: 10,
                        color: colors.secondary
                    }
                ]
            },
            content: [
                // Aquí puedes agregar un logo si lo tienes
                // {
                //   image: 'data:image/png;base64,...',
                //   width: 120,
                //   alignment: 'center',
                //   margin: [0, 0, 0, 20]
                // },
                { text: 'INFORME DE AJUSTES DE STOCK', style: 'reportTitle' },
                {
                    canvas: [
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 515,
                            h: 0.5,
                            lineWidth: 0,
                            color: colors.primary
                        }
                    ],
                    margin: [0, 10, 0, 20]
                },
                // Sección de filtros aplicados
                {
                    stack: [
                        { text: 'Filtros aplicados:', style: 'sectionHeader', margin: [0, 0, 0, 5] },
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text: 'Período: ',
                                    style: 'labelText',
                                    margin: [0, 0, 5, 0]
                                },
                                {
                                    width: '*',
                                    text: fechaMinima && fechaMaxima 
                                        ? `Del ${fechaMinima} al ${fechaMaxima}` 
                                        : 'Todos los registros',
                                    style: 'valueText'
                                }
                            ]
                        },
                        movimientoDescripcion ? {
                            columns: [
                                {
                                    width: 'auto',
                                    text: 'Tipo de Movimiento: ',
                                    style: 'labelText',
                                    margin: [0, 0, 5, 0]
                                },
                                {
                                    width: '*',
                                    text: movimientoDescripcion,
                                    style: 'valueText'
                                }
                            ]
                        } : {}
                    ],
                    margin: [0, 0, 0, 15]
                },
                {
                    columns: [
                        {
                            width: '*',
                            text: [
                                { text: 'Total de ajustes de stock: ', style: 'labelText' },
                                { text: `${ajustes.length}`, style: 'valueText' }
                            ]
                        },
                        {
                            width: '*',
                            text: [
                                { text: 'Generado por: ', style: 'labelText' },
                                { text: 'Sistema BMS', style: 'valueText' }
                            ],
                            alignment: 'right'
                        }
                    ],
                    columnGap: 10,
                    margin: [0, 0, 0, 20]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: [30, 30, 30, 30, 65, 50, 60, '*'],
                        // Altura mínima realista para filas compactas
                        heights: function (row: any) {
                            return (row === 0) ? 18 : 14;
                        },
                        body: [
                            [
                                { text: 'Código', style: 'tableHeader', alignment: 'left' },
                                { text: 'Emp.', style: 'tableHeader', alignment: 'left' },
                                { text: 'Suc.', style: 'tableHeader', alignment: 'left' },
                                { text: 'Dep.', style: 'tableHeader', alignment: 'left' },
                                { text: 'N°Comprobante', style: 'tableHeader', alignment: 'left' },
                                { text: 'Fecha', style: 'tableHeader', alignment: 'left' },
                                { text: 'Movimiento', style: 'tableHeader', alignment: 'left' },
                                { text: 'Observacion', style: 'tableHeader', alignment: 'left' }
                            ],
                            ...ajustes.map((aju, i) => [
                                { text: aju.id_ajuste?.toString() || '', style: 'tableCell' },
                                { text: aju.id_empresa.toString() || '', style: 'tableCell' },
                                { text: aju.id_sucursal.toString() || '', style: 'tableCell' },
                                { text: aju.id_deposito.toString() || '', style: 'tableCell' },
                                { text: aju.numero_comprobante, style: 'tableCell' },
                                { text: aju.fecha, style: 'tableCell' },
                                { text: aju.movimiento_descripcion, style: 'tableCell' },
                                { text: aju.observacion, style: 'tableCell' }
                            ])
                        ]
                    },
                    layout: {
                        fillColor: function (rowIndex: number, node: any, columnIndex: number) {
                            return (rowIndex === 0) ? colors.primary : (rowIndex % 2 === 0) ? colors.light : colors.white;
                        },
                        hLineWidth: function (i: number, node: any) {
                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                        },
                        vLineWidth: function (i: number, node: any) {
                            return 0; // Sin líneas verticales para un estilo más moderno
                        },
                        hLineColor: function (i: number, node: any) {
                            return (i === 0 || i === node.table.body.length) ? colors.primary : colors.borderColor;
                        },
                        // Padding reducido para filas más compactas
                        paddingLeft: function (i: number, node: any) { return 5; },
                        paddingRight: function (i: number, node: any) { return 5; },
                        paddingTop: function (i: number, node: any) { return 3; },
                        paddingBottom: function (i: number, node: any) { return 3; }
                    }
                },
                {
                    text: 'Información confidencial - Uso interno',
                    style: 'footerNote',
                    margin: [0, 30, 0, 0]
                }
            ],
            footer: function (currentPage: number, pageCount: number) {
                return {
                    columns: [
                        {
                            text: '© Business Management Systems',
                            alignment: 'left',
                            margin: [40, 0, 0, 0],
                            fontSize: 8,
                            color: colors.secondary
                        },
                        {
                            text: `Página ${currentPage} de ${pageCount}`,
                            alignment: 'right',
                            margin: [0, 0, 40, 0],
                            fontSize: 8,
                            color: colors.secondary
                        }
                    ],
                    margin: [40, 20]
                };
            },
            styles: {
                reportTitle: {
                    fontSize: 20,
                    bold: true,
                    color: colors.primary,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                sectionHeader: {
                    fontSize: 14,
                    bold: true,
                    color: colors.dark,
                    margin: [0, 15, 0, 10]
                },
                tableHeader: {
                    fontSize: 9,
                    bold: true,
                    color: colors.white,
                    alignment: 'center'
                },
                tableCell: {
                    fontSize: 8,
                    color: colors.dark,
                    alignment: 'left'
                },
                labelText: {
                    fontSize: 8,
                    bold: true,
                    color: colors.dark
                },
                valueText: {
                    fontSize: 8,
                    color: colors.dark
                },
                footerNote: {
                    fontSize: 7,
                    italic: true,
                    color: colors.secondary,
                    alignment: 'center'
                }
            },
            defaultStyle: {
                font: 'Roboto'  // Usar la fuente definida arriba
            }
        };
    }
}