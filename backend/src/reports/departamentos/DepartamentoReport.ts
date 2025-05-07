import { ReportGenerator } from '../base/ReportGenerator';
import { IDepartamentoView } from '../../models/Departamento.model';

export class DepartamentoReport extends ReportGenerator<IDepartamentoView> {
    protected getFileName(): string {
        return 'informe-departamentos';
    }

    protected getDocumentDefinition(departamentos: IDepartamentoView[]): any {
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
                { text: 'INFORME DE DEPARTAMENTOS', style: 'reportTitle' },
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
                {
                    columns: [
                        {
                            width: '*',
                            text: [
                                { text: 'Total de departamentos: ', style: 'labelText' },
                                { text: `${departamentos.length}`, style: 'valueText' }
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
                        widths: [50, '*', '*'],
                        // Altura mínima realista para filas compactas
                        heights: function (row: any) {
                            return (row === 0) ? 18 : 14;
                        },
                        body: [
                            [
                                { text: 'CÓDIGO', style: 'tableHeader', alignment: 'left' },
                                { text: 'DEPARTAMENTO', style: 'tableHeader', alignment: 'left' },
                                { text: 'PAÍS', style: 'tableHeader', alignment: 'left' }
                            ],
                            ...departamentos.map((dep, i) => [
                                { text: dep.id_departamento?.toString() || '', style: 'tableCell' },
                                { text: dep.descripcion, style: 'tableCell' },
                                { text: dep.pais_descripcion, style: 'tableCell' }
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