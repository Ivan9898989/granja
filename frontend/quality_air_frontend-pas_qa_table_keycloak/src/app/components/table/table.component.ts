import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service'; 
import { Cerda } from '../../models/cerda';
import { MessageService } from 'primeng/api';  
import { Table } from 'primeng/table';
import { CerdasService } from 'src/app/services/historial-cerdas.service'; // Asegúrate de que este servicio esté correctamente importado

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [MessageService] 
})

export class TableComponent implements OnInit {
  userDialog: boolean= false;
  deleteUserDialog: boolean = false;
  deleteUsersDialog:  boolean = false;
  activityValues: number[] = [0, 100];
  cerdas: Cerda[] = [];
  berracos = [
  { label: 'Duroc', value: 'Duroc' },
  { label: 'Belga', value: 'Belga' },
  { label: 'York', value: 'York' },
  { label: 'Pietrain', value: 'Pietrain' },
  { label: 'Landra', value: 'Landra' },
  { label: 'Pancho', value: 'Pancho' },
  { label: 'Hercules', value: 'Hercules' }
  ];

  cerda: Cerda={
    id: null,
    nombre: '',
    fecha_inseminacion: null,
    berraco: '',
    fecha_parto: null,
    progreso: null,
    dias_transcurridos: null
  };
  confirmPassword: string='';
  selectedUsers: Cerda[]=[];
  submitted: boolean=false;
  cols: any[]=[]
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  loading: boolean = false;
 

  constructor(
    private userService: UserService, 
    private messageService: MessageService,
    private cerdasService: CerdasService 
   ){}

  mover(id: number): void {
    if (typeof id === 'number') {
      this.cerdasService.moverLechonAlHistorial(id).subscribe({
        next: () => {
          console.log('Lechón movido al historial');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error al mover lechón:', err);
        }
      });
    } else {
      console.warn('Debe proporcionar un ID válido. ID actual:', id);
    }
  }

  ngOnInit() {
    this.loadUsers();

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'fecha_inseminacion', header: 'Fecha de Inseminación' },
      { field: 'fecha_parto', header: 'Fecha de Parto' },
      { field: 'progreso', header: 'Progreso' }
  ];
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log(data); 
        this.cerdas = data; 
        this.cerdas.forEach(cerda => this.verificarEstadoCerda(cerda)); 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.loading = false;
      }
    });
  }

  openNew() {
    this.cerda = {
      id: null,
      nombre: '',
      fecha_inseminacion: null,
      berraco: '',
      fecha_parto: null,
      progreso: null,
      dias_transcurridos: null

    };
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelectUsers(){
    this.deleteUsersDialog = true;
  }

  editUser(cerda: Cerda){
    this.cerda = {...cerda }
    this.userDialog = true;
  }

  deleteUser(cerda: Cerda){
    this.deleteUserDialog = true;
    this.cerda = {...cerda}
  }

  confirmDeleteSelected() {
    this.deleteUsersDialog = false;
  
    if (this.selectedUsers.length > 0) {
      const updateRequests = this.selectedUsers.map(selectedUser => {
        const updatedUser = { ...selectedUser}; 
        return this.userService.deleteCerda(updatedUser).toPromise(); // Convierte a promesa
      });
  
      // Espera a que todas las solicitudes se completen
      Promise.all(updateRequests).then(() => {
        // Actualiza la lista local de usuarios
        this.selectedUsers.forEach(selectedUser => {
          const index = this.findIndexById(selectedUser.id!); // Asegúrate de que selectedUser.id no sea null
          if (index !== -1) {
            this.cerdas[index] = { ...this.cerdas[index]}; // Actualiza el status en la lista
          }
        });

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users deactivated successfully', life: 3000 });
        this.loadUsers(); // Vuelve a cargar los usuarios
      }).catch(err => {
        console.error('Error al desactivar usuarios', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to deactivate users', life: 3000 });
      });
  
      // Limpia la selección de usuarios después de que se complete la actualización
      this.selectedUsers = [];
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No users selected', life: 3000 });
    }
  }
  


  confirmDelete() {
  this.deleteUserDialog = false;

  if (this.cerda.id) {

    this.userService.deleteCerda(this.cerda).subscribe({
      next: () => {
        if (this.cerda.id !== null) {
          const index = this.findIndexById(this.cerda.id);
    
          if (index !== -1) {
            this.cerdas[index] = { ...this.cerdas[index] }; // Actualiza el status en la lista
          }
          
        }
        
        
        // Muestra un mensaje de éxito
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Registro de la cerda eliminada', life: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al desactivar usuario', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar a la cerda', life: 3000 });
      }
    });
  }

  // Reinicia el objeto usuario
  this.cerda = {
    id: null,
    nombre: '',
    fecha_inseminacion: null,
    berraco: '',
    fecha_parto: null,
    progreso: null,
    dias_transcurridos: null
  };
}

  

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  verificarEstadoCerda(cerda: Cerda) {
    if (cerda.dias_transcurridos === 21) {
      const confirmacion = confirm(`¿La cerda ${cerda.nombre} quedó embarazada?`);
      if (!confirmacion) {
        this.eliminarRegistro(cerda);
      }
    }
  }

  eliminarRegistro(cerda: Cerda) {
    this.cerdas = this.cerdas.filter(c => c.id !== cerda.id);
    this.userService.deleteCerda(cerda).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: `Registro de ${cerda.nombre} eliminado`, life: 3000 }),
      error: (err) => console.error('Error al eliminar la cerda', err)
    });
  }

  saveUser() {
    this.submitted = true;
  

  
    if (this.cerda.nombre?.trim()) {
      if (this.cerda.id) {
        this.userService.updateUser(this.cerda).subscribe({
          next: (updatedUser) => {
            if (this.cerda.id !== null) {
              const index = this.findIndexById(this.cerda.id);
              if (index !== -1) {
                this.cerdas[index] = updatedUser;
              }
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Datos de la cerda actualizada', life: 3000 });
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error al actualizar cerda', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la cerda', life: 3000 });
          }
        });
      } else {
        this.userService.addUser(this.cerda).subscribe({
          next: (newUser) => {
            this.cerdas.push(newUser);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cerda Creada', life: 3000 });
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error al ingresar la cerda', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la cerda', life: 3000 });
          }
        });
      }
  
      this.userDialog = false;
      this.confirmPassword = '';
      this.cerda = {
        id: null,
        nombre: '',
        fecha_inseminacion: null,
        berraco: '',
        fecha_parto: null,
        progreso: null,
        dias_transcurridos: null
      };
    }
  }
  
  
  

  findIndexById(id: number): number {
    let index = -1;
    for(let i = 0; i < this.cerdas.length; i++) {
        if(this.cerdas[i].id === id) {
          index = i;
          break;
      }
    }
    return index;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
