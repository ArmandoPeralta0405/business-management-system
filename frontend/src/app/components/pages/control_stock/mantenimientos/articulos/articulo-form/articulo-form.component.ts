import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ArticuloService } from '../../../../../../services/tables/articulo.service';
import { CategoriaService } from '../../../../../../services/tables/categoria.service';
import { LineaService } from '../../../../../../services/tables/linea.service';
import { MarcaService } from '../../../../../../services/tables/marca.service';
import { TipoArticuloService } from '../../../../../../services/tables/tipo_articulo.service';
import { UnidadMedidaService } from '../../../../../../services/tables/unidad_medida.service';
import { ImpuestoService } from '../../../../../../services/tables/impuesto.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IArticulo } from '../../../../../../models/articulo.model';
import Swal from 'sweetalert2';
import { CodigoBarraService } from '../../../../../../services/tables/codigo_barra.service';
import { ICodigoBarraView, ICodigoBarra } from '../../../../../../models/codigo_barra.model';
import { TipoBarraService } from '../../../../../../services/tables/tipo_barra.service';
import { ITipoBarra } from '../../../../../../models/tipo_barra.model';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-articulo-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './articulo-form.component.html',
  styleUrl: './articulo-form.component.css'
})
export class ArticuloFormComponent implements OnInit {

  // Propiedad para controlar la visibilidad del modal
  showCodigosBarrasModal = false;

  articuloForm: FormGroup;
  isEditMode = false;
  articuloId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Artículo';

  Math = Math;

  categorias: any[] = [];
  lineas: any[] = [];
  marcas: any[] = [];
  tipos: any[] = [];
  unidades: any[] = [];
  impuestos: any[] = [];
  codigosBarras: ICodigoBarraView[] = [];
  selectedCodigoBarra: ICodigoBarra | null = null;
  tiposBarra: ITipoBarra[] = [];

  codigoBarraData = {
    codigo_barra: '',
    id_tipo: 0,
    estado: true
  };

  p: number = 1;
  itemsPerPage: number = 5;

  searchText: string = '';

  constructor(
    private fb: FormBuilder,
    private articuloService: ArticuloService,
    private categoriaService: CategoriaService,
    private lineaService: LineaService,
    private marcaService: MarcaService,
    private tipoArticuloService: TipoArticuloService,
    private unidadMedidaService: UnidadMedidaService,
    private impuestoService: ImpuestoService,
    private codigoBarraService: CodigoBarraService,
    private tipoBarraService: TipoBarraService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.articuloForm = this.fb.group({
      id_articulo: [null],
      codigo_alfanumerico: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      id_categoria: [null, [Validators.required]],
      id_linea: [null, [Validators.required]],
      id_marca: [null, [Validators.required]],
      id_tipo: [null, [Validators.required]],
      id_unidad: [null, [Validators.required]],
      id_impuesto: [null, [Validators.required]],
      estado: [true] // Valor inicial true (Activo)
    });
  }

  ngOnInit(): void {
    this.loadReferenciales();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.articuloId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Artículo';
        this.loadArticuloData(this.articuloId);
      }
    });

    this.loadCodigosBarras();
    this.loadTiposBarra();
  }

  loadReferenciales(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => this.categorias = data,
      error: (error) => console.error('Error al cargar categorías:', error)
    });

    this.lineaService.getAll().subscribe({
      next: (data) => this.lineas = data,
      error: (error) => console.error('Error al cargar líneas:', error)
    });

    this.marcaService.getAll().subscribe({
      next: (data) => this.marcas = data,
      error: (error) => console.error('Error al cargar marcas:', error)
    });

    this.tipoArticuloService.getAll().subscribe({
      next: (data: any) => this.tipos = data,
      error: (error: any) => console.error('Error al cargar tipos de artículo:', error)
    });

    this.unidadMedidaService.getAll().subscribe({
      next: (data: any) => this.unidades = data,
      error: (error: any) => console.error('Error al cargar unidades de medida:', error)
    });

    this.impuestoService.getAll().subscribe({
      next: (data) => this.impuestos = data,
      error: (error) => console.error('Error al cargar impuestos:', error)
    });
  }

  loadArticuloData(id: number): void {
    this.isLoading = true;
    this.articuloService.getById(id).subscribe({
      next: (articulo) => {
        this.articuloForm.patchValue(articulo);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading articulo:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el artículo');
        this.router.navigate(['/control_stock/mantenimientos/articulos']);
      }
    });
  }

  loadCodigosBarras(): void {
    if (!this.articuloId) return;

    this.codigoBarraService.getAll().subscribe({
        next: (data) => {
            this.codigosBarras = data.filter(codigo => codigo.id_articulo === this.articuloId);
        },
        error: (error) => {
            console.error('Error al cargar códigos de barras:', error);
        }
    });
  }

  loadTiposBarra(): void {
    this.tipoBarraService.getAll().subscribe({
        next: (data) => {
            this.tiposBarra = data;
        },
        error: (error) => {
            console.error('Error al cargar tipos de barra:', error);
        }
    });
  }

  addCodigoBarra(codigoBarraData: Omit<ICodigoBarra, 'id_codigo'>): void {
    this.codigoBarraService.create(codigoBarraData).subscribe({
        next: (newCodigoBarra) => {
            this.loadCodigosBarras();
        },
        error: (error) => {
            console.error('Error al agregar código de barras:', error);
        }
    });
  }

  updateCodigoBarra(id_codigo: number, codigoBarraData: Partial<ICodigoBarra>): void {
    if (!this.articuloId) return;

    this.codigoBarraService.update(id_codigo, this.articuloId, codigoBarraData).subscribe({
        next: () => {
            this.loadCodigosBarras();
        },
        error: (error) => {
            console.error('Error al actualizar código de barras:', error);
        }
    });
  }

  removeCodigoBarra(id_codigo: number): void {
    if (!this.articuloId) return;

    this.codigoBarraService.delete(id_codigo, this.articuloId).subscribe({
        next: () => {
            this.loadCodigosBarras();
        },
        error: (error) => {
            console.error('Error al eliminar código de barras:', error);
        }
    });
  }

  loadCodigoBarraData(id_codigo: number, id_articulo: number): void {
    this.codigoBarraService.getById(id_codigo, id_articulo).subscribe({
        next: (codigoBarra) => {
            this.codigoBarraData = {
                codigo_barra: codigoBarra.codigo_barra,
                id_tipo: codigoBarra.id_tipo,
                estado: codigoBarra.estado
            };
            this.selectedCodigoBarra = codigoBarra;
        },
        error: (error) => {
            console.error('Error al cargar el código de barras:', error);
        }
    });
}

  onSubmitCodigoBarra(): void {
    if (this.selectedCodigoBarra) {
        this.updateCodigoBarra(this.selectedCodigoBarra.id_codigo!, {
            codigo_barra: this.codigoBarraData.codigo_barra,
            id_tipo: this.codigoBarraData.id_tipo ?? undefined,
            estado: this.codigoBarraData.estado ?? true
        });
    } else {
        this.addCodigoBarra({
            id_articulo: this.articuloId!,
            codigo_barra: this.codigoBarraData.codigo_barra,
            id_tipo: this.codigoBarraData.id_tipo ?? 0,
            estado: this.codigoBarraData.estado ?? true
        });
    }

    this.codigoBarraData = {
        codigo_barra: '',
        id_tipo: 0,
        estado: true
    };
    this.selectedCodigoBarra = null;
}

onEditCodigoBarra(codigo: ICodigoBarraView): void {
    this.codigoBarraService.getById(codigo.id_codigo!, codigo.id_articulo).subscribe({
        next: (data) => {
            this.selectedCodigoBarra = data;
            this.codigoBarraData = {
                codigo_barra: data.codigo_barra,
                id_tipo: data.id_tipo,
                estado: data.estado
            };
        },
        error: (error) => {
            console.error('Error al cargar el código de barras:', error);
        }
    });
}

  onSubmit(): void {
    if (this.articuloForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const articuloData = {
      ...this.articuloForm.value,
      estado: this.articuloForm.value.estado ? 1 : 0 // Convertir true/false a 1/0
    };

    const operation$ = this.isEditMode && this.articuloId
      ? this.articuloService.update(this.articuloId, articuloData)
      : this.articuloService.create(articuloData);

    operation$.subscribe({
      next: () => {
        this.isLoading = false;
        const message = this.isEditMode 
          ? 'Artículo actualizado correctamente' 
          : 'Artículo creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el artículo'
          : 'Error al crear el artículo';
        this.showError(message + ': ' + (error.error?.message || error.message));
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.articuloForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#7D161A',
      timer: 2000
    }).then(() => {
      this.router.navigate(['/control_stock/mantenimientos/articulos']);
    });
  }

  private showError(message: string): void {
    this.isLoading = false;
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#7D161A',
      footer: 'Verifique la consola para más detalles'
    });
  }

  get filteredCodigosBarras(): ICodigoBarraView[] {
    if (!this.searchText) {
        return this.codigosBarras;
    }

    const searchTextLower = this.searchText.toLowerCase();

    return this.codigosBarras.filter(codigo => {
        return (
            codigo.codigo_barra.toLowerCase().includes(searchTextLower) ||
            codigo.tipo_barra_descripcion.toLowerCase().includes(searchTextLower) ||
            codigo.estado.toLowerCase().includes(searchTextLower)
        );
    });
  }
}