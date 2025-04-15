import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModuloService } from '../../../../../../services/tables/modulo.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IModulo } from '../../../../../../models/modulo.model';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modulo-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './modulo-form.component.html',
  styleUrl: './modulo-form.component.css'
})
export class ModuloFormComponent implements OnInit {
  
  moduloForm: FormGroup;
  isEditMode = false;
  moduloId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Módulo';

  // Lista de iconos FontAwesome (versión 6)
  faIcons: { name: string, class: string }[] = [
    { name: 'Carrito de compras', class: 'fa-shopping-cart' },
    { name: 'Tienda', class: 'fa-store' },
    { name: 'Caja registradora', class: 'fa-cash-register' },
    { name: 'Tarjeta de crédito', class: 'fa-credit-card' },
    { name: 'Billete de dinero', class: 'fa-money-bill-wave' },
    { name: 'Recibo', class: 'fa-receipt' },
    { name: 'Caja', class: 'fa-box' },
    { name: 'Camión de entrega', class: 'fa-truck' },
    { name: 'Etiquetas', class: 'fa-tags' },
    { name: 'Acuerdo', class: 'fa-handshake' },
    { name: 'Factura', class: 'fa-file-invoice' },
    { name: 'Factura con símbolo de dólar', class: 'fa-file-invoice-dollar' },
    { name: 'Calculadora', class: 'fa-calculator' },
    { name: 'Billetera', class: 'fa-wallet' },
    { name: 'Monedas', class: 'fa-coins' },
    { name: 'Gráfico de línea', class: 'fa-chart-line' },
    { name: 'Gráfico circular', class: 'fa-chart-pie' },
    { name: 'Lista', class: 'fa-list' },
    { name: 'Lista alternativa', class: 'fa-list-alt' },
    { name: 'Tabla', class: 'fa-table' },
    { name: 'Columnas', class: 'fa-columns' },
    { name: 'Carpeta', class: 'fa-folder' },
    { name: 'Carpeta abierta', class: 'fa-folder-open' },
    { name: 'Usuario', class: 'fa-user' },
    { name: 'Usuario con escudo', class: 'fa-user-shield' },
    { name: 'Candado', class: 'fa-lock' },
    { name: 'Llave', class: 'fa-key' },
    { name: 'Escudo', class: 'fa-shield-alt' },
    { name: 'Usuarios', class: 'fa-users' },
    { name: 'Usuario con configuración', class: 'fa-user-cog' },
    { name: 'Engranajes', class: 'fa-cogs' },
    { name: 'Portapapeles', class: 'fa-clipboard' },
    { name: 'Lista en portapapeles', class: 'fa-clipboard-list' },
    { name: 'Archivo', class: 'fa-file' },
    { name: 'Archivo alternativo', class: 'fa-file-alt' },
    { name: 'Editar', class: 'fa-edit' },
    { name: 'Eliminar', class: 'fa-trash' },
    { name: 'Guardar', class: 'fa-save' },
    { name: 'Campana', class: 'fa-bell' },
    { name: 'Círculo de exclamación', class: 'fa-exclamation-circle' },
    { name: 'Círculo de información', class: 'fa-info-circle' },
    { name: 'Círculo de verificación', class: 'fa-check-circle' },
    { name: 'Inicio', class: 'fa-home' },
    { name: 'Flecha derecha', class: 'fa-arrow-right' },
    { name: 'Flecha izquierda', class: 'fa-arrow-left' },
    { name: 'Sincronizar', class: 'fa-sync' },
    { name: 'Buscar', class: 'fa-search' }
  ];

  constructor(
    private fb: FormBuilder,
    private moduloService: ModuloService,
    private http: HttpClient, // Agregado para consumir los iconos
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.moduloForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      icono: ['folder', [Validators.required]],
      orden: [0, [Validators.required, Validators.min(0)]],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.moduloId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Módulo';
        this.loadModuloData(this.moduloId);
      }
    });
    this.loadIcons(); // Cargar iconos dinámicamente
  }

  loadModuloData(id: number): void {
    this.isLoading = true;
    this.moduloService.getById(id).subscribe({
      next: (modulo) => {
        this.moduloForm.patchValue({
          descripcion: modulo.descripcion,
          icono: modulo.icono,
          orden: modulo.orden,
          estado: modulo.estado
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading modulo:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el módulo');
        this.router.navigate(['/sistema_general/mantenimientos/modulos']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.moduloForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.isLoading = true;
    const moduloData = this.moduloForm.value;
  
    const operation$ = this.isEditMode && this.moduloId
      ? this.moduloService.update(this.moduloId, moduloData)
      : this.moduloService.create(moduloData);
  
    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Módulo actualizado correctamente' 
          : 'Módulo creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el módulo'
          : 'Error al crear el módulo';
        this.showError(message);
      }
    });
  }

  loadIcons(): void {
    const fontAwesomeUrl = 'https://api.fontawesome.com/icons'; // URL de ejemplo
    this.http.get<{ name: string, class: string }[]>(fontAwesomeUrl).subscribe({
      next: (data) => {
        this.faIcons = data;
      },
      error: (error) => {
        console.error('Error al cargar los iconos:', error);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.moduloForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/modulos']);
    });
  }

  private showError(message: string): void {
    this.isLoading = false;
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#7D161A'
    });
  }
}