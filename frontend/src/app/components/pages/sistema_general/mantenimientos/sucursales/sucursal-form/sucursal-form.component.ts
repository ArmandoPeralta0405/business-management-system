import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SucursalService } from '../../../../../../services/tables/sucursal.service';
import { EmpresaService } from '../../../../../../services/tables/empresa.service';
import { CiudadService } from '../../../../../../services/tables/ciudad.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ISucursal } from '../../../../../../models/sucursal.model';
import { IEmpresaView } from '../../../../../../models/empresa.model';
import { ICiudadView } from '../../../../../../models/ciudad.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sucursal-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sucursal-form.component.html',
  styleUrl: './sucursal-form.component.css'
})
export class SucursalFormComponent implements OnInit {
  
  sucursalForm: FormGroup;
  isEditMode = false;
  idEmpresa: number | null = null;
  idSucursal: number | null = null;
  isLoading = false;
  formTitle: string = 'Nueva Sucursal';
  empresas: IEmpresaView[] = [];
  ciudades: ICiudadView[] = [];

  constructor(
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private empresaService: EmpresaService,
    private ciudadService: CiudadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sucursalForm = this.fb.group({
      id_sucursal: [null],
      id_empresa: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', [Validators.maxLength(200)]],
      telefono: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      id_ciudad: ['', [Validators.required]],
      casa_central: [false],
      estado: [true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadEmpresas();
    this.loadCiudades();
    
    this.route.paramMap.subscribe(params => {
      const idEmpresa = params.get('id_empresa');
      const idSucursal = params.get('id_sucursal');
      
      if (idEmpresa && idSucursal) {
        this.idEmpresa = +idEmpresa;
        this.idSucursal = +idSucursal;
        this.isEditMode = true;
        this.formTitle = 'Editar Sucursal';
        this.loadSucursalData(this.idEmpresa, this.idSucursal);
      } else if (idEmpresa) {
        this.idEmpresa = +idEmpresa;
        this.sucursalForm.patchValue({ id_empresa: this.idEmpresa });
      }
    });
  }

  loadEmpresas(): void {
    this.empresaService.getAll().subscribe({
      next: (data) => {
        this.empresas = data;
      },
      error: (error) => {
        console.error('Error loading empresas:', error);
        this.showError('Error al cargar las empresas');
      }
    });
  }

  loadCiudades(): void {
    this.ciudadService.getAll().subscribe({
      next: (data) => {
        this.ciudades = data;
      },
      error: (error) => {
        console.error('Error loading ciudades:', error);
        this.showError('Error al cargar las ciudades');
      }
    });
  }

  loadSucursalData(idEmpresa: number, idSucursal: number): void {
    this.isLoading = true;
    this.sucursalService.getById(idEmpresa, idSucursal).subscribe({
      next: (sucursal) => {
        this.sucursalForm.patchValue({
          id_sucursal: sucursal.id_sucursal,
          id_empresa: sucursal.id_empresa,
          descripcion: sucursal.descripcion,
          direccion: sucursal.direccion,
          telefono: sucursal.telefono,
          email: sucursal.email,
          id_ciudad: sucursal.id_ciudad,
          casa_central: sucursal.casa_central,
          estado: sucursal.estado
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sucursal:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar la sucursal');
        this.router.navigate(['/sistema_general/mantenimientos/sucursales']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.sucursalForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.isLoading = true;
    const sucursalData = this.sucursalForm.value;

    const operation$ = this.isEditMode && this.idEmpresa && this.idSucursal
      ? this.sucursalService.update(this.idEmpresa, this.idSucursal, sucursalData)
      : this.sucursalService.create(sucursalData);
  
    operation$.subscribe({
      next: () => {
        this.isLoading = false;
        const message = this.isEditMode 
          ? 'Sucursal actualizada correctamente' 
          : 'Sucursal creada correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar la sucursal'
          : 'Error al crear la sucursal';
        this.showError(message + ': ' + (error.error?.message || error.message));
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.sucursalForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      timer: 2000
    }).then(() => {
      this.router.navigate(['/sistema_general/mantenimientos/sucursales']);
    });
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33'
    });
  }
}