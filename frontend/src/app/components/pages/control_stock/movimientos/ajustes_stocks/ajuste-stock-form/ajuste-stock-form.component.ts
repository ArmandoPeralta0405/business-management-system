import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../../../../services/tables/empresa.service';
import { SucursalService } from '../../../../../../services/tables/sucursal.service';
import { DepositoService } from '../../../../../../services/tables/deposito.service';
import { AjusteStockService } from '../../../../../../services/tables/ajuste_stock.service';
import { IEmpresaView } from '../../../../../../models/empresa.model';
import { ISucursalView } from '../../../../../../models/sucursal.model';
import { IDeposito } from '../../../../../../models/deposito.model';
import { CommonModule } from '@angular/common';
import { MovimientoService } from '../../../../../../services/tables/movimiento.service';
import { IMovimiento } from '../../../../../../models/movimiento.model';
import { ArticuloService } from '../../../../../../services/tables/articulo.service';
import { IArticuloView } from '../../../../../../models/articulo.model';
import { DetalleAjusteStockService } from '../../../../../../services/tables/detalle_ajuste_stock.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

// Declarar la variable bootstrap para TypeScript
declare var bootstrap: any;

@Component({
  selector: 'app-ajuste-stock-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './ajuste-stock-form.component.html',
  styleUrl: './ajuste-stock-form.component.css'
})
export class AjusteStockFormComponent {
  ID_USUARIO: number = 0;
  
  // Propiedades para control de pestañas
  datosGeneralesCompletos = false;
  hayArticulosAgregados = false;
  mostrarAlertaDatosIncompletos = false;
  
  // Variables para la búsqueda de artículos
  articulosBuscados: IArticuloView[] = [];
  mostrarSugerencias: boolean = false;
  
  formData = {
    fechaAjuste: '',
    horaAjuste: '',
    numeroDocumento: '',
    usuario: '',
    empresa: -1,
    sucursal: -1,
    deposito: -1,
    tipoMovimiento: -1,
    observaciones: '',
    codigoArticulo: '',
    descripcionArticulo: '',
    cantidadArticulo: 1,
    idArticulo: undefined as number | undefined // Agregar el ID del artículo
  };

  formDisabled = true;
  empresas: IEmpresaView[] = [];
  sucursales: ISucursalView[] = [];
  depositos: IDeposito[] = [];
  tiposMovimientos: IMovimiento[] = [];
  // Modificar la estructura de detalles para incluir el id_articulo
  detalles: Array<{ codigo: string, codigo_articulo: string, descripcion: string, cantidad: number }> = [];

  constructor(
    private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private depositoService: DepositoService,
    private ajusteStockService: AjusteStockService,
    private movimientoService: MovimientoService,
    private articuloService: ArticuloService, // Agregar el servicio de artículos
    private detalleAjusteStockService: DetalleAjusteStockService // Agregar el servicio de detalles de ajuste de stock
    // Importar el servicio de detalles
  ) {
    this.loadEmpresas();
    this.loadTiposMovimientos();
  }

  loadEmpresas() {
    this.empresaService.getAll().subscribe(
      (data: IEmpresaView[]) => {
        this.empresas = data;
      },
      error => {
        console.error('Error al cargar las empresas', error);
      }
    );
  }

  onEmpresaChange() {
    if (this.formData.empresa !== -1) {
      this.sucursalService.getByEmpresa(this.formData.empresa).subscribe(
        (data: ISucursalView[]) => {
          this.sucursales = data;
        },
        error => {
          console.error('Error al cargar las sucursales', error);
        }
      );
    } else {
      this.sucursales = [];
      this.depositos = [];
    }
  }

  onSucursalChange() {
    if (this.formData.sucursal !== -1 && this.formData.empresa !== -1) {
      this.depositoService.getBySucursal(this.formData.empresa, this.formData.sucursal).subscribe(
        (data: IDeposito[]) => {
          this.depositos = data;
        },
        error => {
          console.error('Error al cargar los depósitos', error);
        }
      );
    } else {
      this.depositos = [];
    }
  }

  onNuevaTransaccion() {
    this.formDisabled = false;
    const token = localStorage.getItem('token');
    let usuario = '';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        usuario = payload.nombre 
          ? (payload.alias ? `${payload.nombre} (${payload.alias})` : payload.nombre)
          : (payload.alias || '');
        this.ID_USUARIO = payload.id || 0; // Asignar el ID del usuario desde el token
      } catch {
        usuario = '';
        this.ID_USUARIO = 0;
      }
    }
    this.formData.usuario = usuario;
  
    // Establecer la fecha actual
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.formData.fechaAjuste = `${year}-${month}-${day}`;
  
    // Establecer la hora actual
    const horas = today.getHours().toString().padStart(2, '0');
    const minutos = today.getMinutes().toString().padStart(2, '0');
    this.formData.horaAjuste = `${horas}:${minutos}`;
  
    // Obtener el número de comprobante
    this.ajusteStockService.getNextNumeroComprobante().subscribe(
      (response) => {
        this.formData.numeroDocumento = this.formatNumeroComprobante(response.numeroComprobante);
      },
      (error) => {
        console.error('Error al obtener el número de comprobante', error);
      }
    );
  
    //console.log('Nueva transacción agregada');
    this.loadEmpresas();
    
    // Verificar datos generales después de inicializar
    setTimeout(() => this.verificarDatosGenerales(), 100);
  }

  private formatNumeroComprobante(numero: number): string {
    return numero.toString().padStart(5, '0');
  }

  onFechaChange() {
    if (this.formData.fechaAjuste) {
      const now = new Date();
      const horas = now.getHours().toString().padStart(2, '0');
      const minutos = now.getMinutes().toString().padStart(2, '0');
      this.formData.horaAjuste = `${horas}:${minutos}`;
    } else {
      this.formData.horaAjuste = '';
    }
  }

  loadTiposMovimientos() {
    this.movimientoService.getMovimientosStock().subscribe(
      (data: IMovimiento[]) => {
        this.tiposMovimientos = data;
      },
      error => {
        console.error('Error al cargar los tipos de movimientos', error);
      }
    );
  }

  onCancelarOperacion() {
    this.formDisabled = true; // Deshabilitar el formulario
    this.formData.fechaAjuste = '';
    this.formData.horaAjuste = '';
    this.formData.numeroDocumento = '';
    this.formData.usuario = '';
    this.formData.empresa = -1;
    this.formData.sucursal = -1;
    this.formData.deposito = -1;
    this.formData.tipoMovimiento = -1;
    this.formData.observaciones = ''; // Limpiar observaciones
    this.detalles = []; // Limpiar los detalles
    
    // Resetear el estado de validación
    this.datosGeneralesCompletos = false;
    this.hayArticulosAgregados = false;
    this.mostrarAlertaDatosIncompletos = false;
  }

  // Método para buscar artículos mientras se escribe
  buscarArticulos(event: any) {
    const query = event.target.value.trim();
    
    if (query.length > 0) {
      this.articuloService.getArticulosActivos().subscribe({
        next: (articulos) => {
          // Filtrar artículos que coincidan con la búsqueda
          this.articulosBuscados = articulos.filter(art => 
            art.codigo_alfanumerico.toLowerCase().includes(query.toLowerCase()) || 
            art.descripcion.toLowerCase().includes(query.toLowerCase())
          );
          this.mostrarSugerencias = true;
        },
        error: (error) => {
          console.error('Error al buscar artículos:', error);
          this.mostrarSugerencias = false;
        }
      });
    } else {
      this.articulosBuscados = [];
      this.mostrarSugerencias = false;
    }
  }
  
  // Nuevo método para manejar la tecla Enter en el campo de filtro
  manejarTeclaEnFiltro(event: KeyboardEvent) {
    // Si se presiona Enter y hay sugerencias
    if (event.key === 'Enter' && this.articulosBuscados.length > 0) {
      event.preventDefault();
      // Seleccionar el primer artículo de la lista
      this.seleccionarArticulo(this.articulosBuscados[0]);
    }
  }
  
  // Nuevo método para manejar la tecla Enter en el campo de cantidad
  manejarTeclaEnCantidad(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Ejecutar la acción del botón agregar
      this.agregarDetalle();
    }
  }

  // Modificar el método seleccionarArticulo para guardar también el id_articulo
  seleccionarArticulo(articulo: IArticuloView) {
    this.formData.codigoArticulo = articulo.codigo_alfanumerico;
    this.formData.descripcionArticulo = articulo.descripcion;
    this.formData.cantidadArticulo = 1; // Valor por defecto
    this.formData.idArticulo = articulo.id_articulo; // Guardar el ID del artículo
    
    this.articulosBuscados = [];
    this.mostrarSugerencias = false;
    
    // Enfocar el campo de cantidad después de seleccionar un artículo
    setTimeout(() => {
      document.getElementById('cantidadArticulo')?.focus();
    }, 100);
  }
  
  // Modificar el método agregarDetalle para acumular cantidades
  agregarDetalle() {
    const { codigoArticulo, descripcionArticulo, cantidadArticulo, idArticulo } = this.formData;
    
    if (codigoArticulo && descripcionArticulo && cantidadArticulo > 0) {
      // Buscar si el artículo ya existe en la lista
      const articuloExistente = this.detalles.find(
        detalle => detalle.codigo === codigoArticulo || 
                  (idArticulo && detalle.codigo_articulo === idArticulo.toString())
      );
      
      if (articuloExistente) {
        // Si el artículo ya existe, acumular la cantidad
        articuloExistente.cantidad += cantidadArticulo;
      } else {
        // Si el artículo no existe, agregarlo como nuevo
        this.detalles.push({
          codigo: codigoArticulo,
          codigo_articulo: idArticulo ? idArticulo.toString() : '',
          descripcion: descripcionArticulo,
          cantidad: cantidadArticulo
        });
      }
      
      // Limpiar los campos después de agregar
      this.formData.codigoArticulo = '';
      this.formData.descripcionArticulo = '';
      this.formData.cantidadArticulo = 1;
      this.formData.idArticulo = undefined;
      
      // Actualizar el estado de validación
      this.hayArticulosAgregados = this.detalles.length > 0;
      
      // Limpiar el campo de filtro y enfocar nuevamente para agregar otro artículo
      const filtroArticulo = document.getElementById('filtroArticulo') as HTMLInputElement;
      if (filtroArticulo) {
        filtroArticulo.value = '';
        filtroArticulo.focus();
      }
    }
  }
  
  // Método para eliminar un detalle
  eliminarDetalle(index: number) {
    this.detalles.splice(index, 1);
    this.hayArticulosAgregados = this.detalles.length > 0;
  }
  
  // Agregar este método para navegar a la pestaña de artículos
  irAArticulos() {
  // Verificar si los datos generales están completos
  this.verificarDatosGenerales();
  
  if (this.datosGeneralesCompletos) {
  // Activar la pestaña de artículos usando Bootstrap
  const articulosTab = document.getElementById('articulos-tab');
  if (articulosTab) {
  const tab = new bootstrap.Tab(articulosTab);
  tab.show();
  }
  } else {
  this.mostrarAlertaDatosIncompletos = true;
  }
  }
  
  // Modificar el método verificarDatosGenerales para que no requiera un evento
  verificarDatosGenerales(event?: any) {
  this.datosGeneralesCompletos = 
  !!this.formData.fechaAjuste &&
  !!this.formData.horaAjuste &&
  !!this.formData.numeroDocumento &&
  this.formData.empresa !== -1 &&
  this.formData.sucursal !== -1 &&
  this.formData.deposito !== -1 &&
  this.formData.tipoMovimiento !== -1;
  
  // Si se proporcionó un evento y los datos no están completos, prevenir la navegación
  if (event && !this.datosGeneralesCompletos) {
  event.preventDefault();
  this.mostrarAlertaDatosIncompletos = true;
  }
  
  return this.datosGeneralesCompletos;
  }
  
  // Método para guardar el ajuste de stock
  guardarAjuste() {
    //console.log('Iniciando guardado de ajuste...');
    
    // Verificar que el token existe
    //const token = localStorage.getItem('token');
    //console.log('Token disponible:', token ? 'Sí' : 'No');
    
    if (!this.datosGeneralesCompletos) {
      //console.log('Datos generales incompletos');
      this.mostrarAlertaDatosIncompletos = true;
      // Activar la pestaña de datos generales
      const datosGeneralesTab = document.getElementById('cabecera-tab');
      if (datosGeneralesTab) {
        const tab = new bootstrap.Tab(datosGeneralesTab);
        tab.show();
      } else {
        // Alternativa: hacer clic en el elemento
        const tabElement = document.querySelector('button[data-bs-target="#cabecera"]');
        if (tabElement) {
          (tabElement as HTMLElement).click();
        } else {
          console.error('No se pudo encontrar la pestaña de datos generales');
        }
      }
      return;
    }
    
    if (!this.hayArticulosAgregados) {
      console.log('No hay artículos agregados');
      Swal.fire({
        title: 'Error',
        text: 'Debe agregar al menos un artículo al ajuste',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    
    // Mostrar diálogo de confirmación antes de guardar
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea guardar los datos ingresados?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Continuar con el guardado si el usuario confirma
        this.procesarGuardado();
      }
    });
  }
  
  // Nuevo método para procesar el guardado después de la confirmación
  procesarGuardado() {
    // Formatear fecha y hora en el formato que MySQL acepta: 'YYYY-MM-DD HH:MM:SS'
    const fechaObj = new Date(`${this.formData.fechaAjuste}T${this.formData.horaAjuste}`);
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    const hours = String(fechaObj.getHours()).padStart(2, '0');
    const minutes = String(fechaObj.getMinutes()).padStart(2, '0');
    const seconds = String(fechaObj.getSeconds()).padStart(2, '0');
    
    // Formato MySQL: 'YYYY-MM-DD HH:MM:SS'
    const fechaHora = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    // Crear el objeto ajuste según el modelo IAjusteStock (solo la cabecera)
    const ajuste: any = {
      fecha_hora: fechaHora,
      id_empresa: Number(this.formData.empresa),
      id_sucursal: Number(this.formData.sucursal),
      id_deposito: Number(this.formData.deposito),
      numero_comprobante: Number(this.formData.numeroDocumento),
      id_movimiento: Number(this.formData.tipoMovimiento),
      observacion: this.formData.observaciones || '',
      id_usuario: this.ID_USUARIO
    };
    
    //console.log('Objeto cabecera a enviar como JSON:', JSON.stringify(ajuste));
    
    // Enviar la cabecera al servidor
    this.ajusteStockService.create(ajuste).subscribe(
      (response: any) => {
        //console.log('Respuesta exitosa del servidor (cabecera):', response);
        
        // Verificar si se recibió un ID de ajuste
        if (response && response.id) {
          const idAjuste = response.id;
          //console.log('ID de ajuste creado:', idAjuste);
          
          // Crear un array de observables para los detalles
          const detallesObservables = this.detalles.map((detalle, index) => {
            const detalleAjuste = {
              id_ajuste: idAjuste,
              id_articulo: Number(detalle.codigo_articulo),
              numero_item: index + 1,
              cantidad: Number(detalle.cantidad)
            };
            
            //console.log(`Enviando detalle ${index + 1}:`, JSON.stringify(detalleAjuste));
            return this.detalleAjusteStockService.create(detalleAjuste);
          });
          
          // Usar forkJoin para esperar a que todos los detalles se guarden
          forkJoin(detallesObservables).subscribe(
            (detallesResponse) => {
              //console.log('Todos los detalles guardados correctamente:', detallesResponse);
              Swal.fire({
                title: 'Éxito',
                text: 'Ajuste de stock y sus detalles guardados correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then(() => {
                // Primero limpiar el formulario
                this.onCancelarOperacion();
                
                // Activar la primera pestaña de manera simple
                setTimeout(() => {
                  const datosGeneralesTab = document.getElementById('cabecera-tab');
                  if (datosGeneralesTab) {
                    const tab = new bootstrap.Tab(datosGeneralesTab);
                    tab.show();
                  } else {
                    // Alternativa: hacer clic en el elemento
                    const tabElement = document.querySelector('button[data-bs-target="#cabecera"]');
                    if (tabElement) {
                      (tabElement as HTMLElement).click();
                    } else {
                      console.error('No se pudo encontrar la pestaña de datos generales');
                    }
                  }
                }, 300);
              });
            },
            (error) => {
              console.error('Error al guardar los detalles:', error);
              Swal.fire({
                title: 'Advertencia',
                text: `El ajuste se guardó pero hubo problemas al guardar los detalles: ${error.message || 'Error desconocido'}`,
                icon: 'warning',
                confirmButtonText: 'Aceptar'
              }).then(() => {
                // Primero limpiar el formulario
                this.onCancelarOperacion();
                
                // Luego activar la primera pestaña con un pequeño retraso
                setTimeout(() => {
                  const datosGeneralesTab = document.getElementById('datos-generales-tab');
                  if (datosGeneralesTab) {
                    const tab = new bootstrap.Tab(datosGeneralesTab);
                    tab.show();
                  } else {
                    console.error('No se encontró el elemento de la pestaña de datos generales');
                  }
                }, 100);
              });
            }
          );
        } else {
          console.warn('Respuesta sin ID de ajuste:', response);
          Swal.fire({
            title: 'Advertencia',
            text: 'El ajuste se guardó pero no se recibió el ID necesario para guardar los detalles',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            // Primero limpiar el formulario
            this.onCancelarOperacion();
            
            // Luego activar la primera pestaña con un pequeño retraso
            setTimeout(() => {
              const datosGeneralesTab = document.getElementById('datos-generales-tab');
              if (datosGeneralesTab) {
                const tab = new bootstrap.Tab(datosGeneralesTab);
                tab.show();
              } else {
                console.error('No se encontró el elemento de la pestaña de datos generales');
              }
            }, 100);
          });
        }
      },
      (error) => {
        console.error('Error al guardar el ajuste de stock', error);
        // Mostrar mensaje de error más detallado
        Swal.fire({
          title: 'Error',
          text: `No se pudo guardar el ajuste de stock: ${error.message || 'Error desconocido'}`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        
        // Si el error tiene detalles adicionales, mostrarlos en la consola
        if (error.error) {
          console.error('Detalles del error:', error.error);
        }
      }
    );
  }
}
