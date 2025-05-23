import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepositoService } from '../../../../../../services/tables/deposito.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { IDeposito } from '../../../../../../models/deposito.model';
import { ISucursalView } from '../../../../../../models/sucursal.model';
import { IEmpresaView } from '../../../../../../models/empresa.model';
import Swal from 'sweetalert2';
import { SucursalService } from '../../../../../../services/tables/sucursal.service';
import { EmpresaService } from '../../../../../../services/tables/empresa.service';

@Component({
  selector: 'app-deposito-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './deposito-form.component.html',
  styleUrl: './deposito-form.component.css'
})
export class DepositoFormComponent implements OnInit {
  depositoForm: FormGroup;
  isEditMode = false;
  depositoId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Deposito';
  sucursales: ISucursalView[] = [];
  empresas: IEmpresaView[] = [];
  filteredSucursales: ISucursalView[] = []; // Nueva propiedad para sucursales filtradas

  constructor(
    private fb: FormBuilder,
    private depositoService: DepositoService,
    private sucursalService: SucursalService,
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.depositoForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      id_empresa: ['', [Validators.required]], // Cambiado el orden
      id_sucursal: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadEmpresas(); // Primero cargamos empresas

    // Escuchamos cambios en la selección de empresa
    this.depositoForm.get('id_empresa')?.valueChanges.subscribe(empresaId => {
      this.updateSucursales(empresaId);
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.depositoId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Deposito';
        this.loadDepositoData(this.depositoId);
      }
    });
  }

  // Nuevo método para cargar sucursales filtradas por empresa
  updateSucursales(empresaId: number): void {
    if (empresaId) {
      // Solo mostramos loading en el campo de sucursal, no en todo el componente
      this.depositoForm.get('id_sucursal')?.disable();
      
      this.sucursalService.getByEmpresa(empresaId).subscribe({
        next: (data) => {
          // Usamos spread operator para mantener la referencia si los datos son iguales
          this.filteredSucursales = [...data];
          
          // Habilitamos el campo después de cargar
          this.depositoForm.get('id_sucursal')?.enable();
          
          // Mantenemos el valor seleccionado si existe en las nuevas sucursales
          const currentSucursalId = this.depositoForm.get('id_sucursal')?.value;
          if (currentSucursalId && !data.some(s => s.id_sucursal == currentSucursalId)) {
            this.depositoForm.get('id_sucursal')?.setValue('');
          }
        },
        error: (error) => {
          console.error('Error loading sucursales:', error);
          this.depositoForm.get('id_sucursal')?.enable();
          this.showError('Error al cargar las sucursales');
        }
      });
    } else {
      this.filteredSucursales = [];
      this.depositoForm.get('id_sucursal')?.setValue('');
      this.depositoForm.get('id_sucursal')?.disable();
    }
  }

  loadEmpresas(): void {
    this.isLoading = true;
    this.empresaService.getAll().subscribe({
      next: (data) => {
        this.empresas = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading empresas:', error);
        this.isLoading = false;
        this.showError('Error al cargar las empresas');
      }
    });
  }

  loadDepositoData(id: number): void {
    this.isLoading = true;
    this.depositoService.getById(id).subscribe({
      next: (deposito) => {
        // Establecemos empresa y sucursal juntas para evitar parpadeo
        this.depositoForm.patchValue({
          descripcion: deposito.descripcion,
          id_empresa: deposito.id_empresa,
          id_sucursal: deposito.id_sucursal
        }, { emitEvent: false }); // Importante: no emitir eventos
        
        // Forzamos la carga de sucursales sin esperar al valueChanges
        this.updateSucursales(deposito.id_empresa);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading deposito:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el deposito');
        this.router.navigate(['/sistema_general/mantenimientos/depositos']);
      }
    });
  }

  onSubmit(): void {
    if (this.depositoForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.isLoading = true;
    const depositoData = this.depositoForm.value;
  
    const operation$ = this.isEditMode && this.depositoId
      ? this.depositoService.update(this.depositoId, depositoData)
      : this.depositoService.create(depositoData);
  
    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Deposito actualizado correctamente' 
          : 'Deposito creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el deposito'
          : 'Error al crear el deposito';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.depositoForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/depositos']);
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