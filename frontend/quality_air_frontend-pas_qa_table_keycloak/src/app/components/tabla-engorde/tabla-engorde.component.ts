import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/engorde.service'; 
import { Engorde } from '../../models/engorde';
import { MessageService } from 'primeng/api'; 
import { Table } from 'primeng/table';
import { EngordeService } from 'src/app/services/historial-engorde.service';

@Component({
  selector: 'app-tabla-engorde',
  templateUrl: './tabla-engorde.component.html',
  styleUrls: ['./tabla-engorde.component.scss'],
  providers: [MessageService]
})
export class TablaEngordeComponent implements OnInit {
  
  userDialog: boolean= false;
  deleteUserDialog: boolean = false;
  deleteUsersDialog:  boolean = false;
  activityValues: number[] = [0, 100];
  engordes: Engorde[] = [];
  engorde: Engorde={
    id: null,
    nombre: '',
    fecha_compra: null,
    fecha_vitamina:null,
    fecha_salida: null,
    progreso: null
  };
  confirmPassword: string='';
  selectedUsers: Engorde[]=[];
  submitted: boolean=false;
  cols: any[]=[]
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  loading: boolean = false;
 

  constructor(private userService: UserService, private engordeService: EngordeService ,private messageService: MessageService ){}

  mover(id: number): void {
    if (typeof id === 'number') {
      this.engordeService.moverLechonAlHistorial(id).subscribe({
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

  
  ngOnInit(): void {
    this.loadUsers();

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'fecha_compra', header: 'fecha_compra' },
      { field: 'fecha_salida', header: 'fecha_salida' },
      { field: 'progreso', header: 'progreso' }
  ];  
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log(data); 
        this.engordes = data; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.loading = false;
      }
    });
  }

  openNew() {
    this.engorde = {
      id: null,
      nombre: '',
      fecha_compra: null,
      fecha_vitamina:null,
      fecha_salida: null,
      progreso: null
    };
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelectUsers(){
    this.deleteUsersDialog = true;
  }

  editUser(cerda: Engorde){
    this.engorde = {...cerda }
    this.userDialog = true;
  }

  deleteUser(cerda: Engorde){
    this.deleteUserDialog = true;
    this.engorde = {...cerda}
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
            this.engordes[index] = { ...this.engordes[index]}; // Actualiza el status en la lista
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

  if (this.engorde.id) {

    this.userService.deleteCerda(this.engorde).subscribe({
      next: () => {
        if (this.engorde.id !== null) {
          const index = this.findIndexById(this.engorde.id);
    
          if (index !== -1) {
            this.engordes[index] = { ...this.engordes[index] }; // Actualiza el status en la lista
          }
          
        }
        
        
        // Muestra un mensaje de éxito
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User deactivated successfully', life: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al desactivar usuario', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to deactivate user', life: 3000 });
      }
    });
  }

  // Reinicia el objeto usuario
  this.engorde = {
    id: null,
    nombre: '',
    fecha_compra: null,
    fecha_vitamina:null,
    fecha_salida: null,
    progreso: null
  };
}

  

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;
  

  
    if (this.engorde.nombre?.trim()) {
      if (this.engorde.id) {
        this.userService.updateUser(this.engorde).subscribe({
          next: (updatedUser) => {
            if (this.engorde.id !== null) {
              const index = this.findIndexById(this.engorde.id);
              if (index !== -1) {
                this.engordes[index] = updatedUser;
              }
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error al actualizar usuario', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user', life: 3000 });
          }
        });
      } else {
        this.userService.addUser(this.engorde).subscribe({
          next: (newUser) => {
            this.engordes.push(newUser);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error al crear usuario', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user', life: 3000 });
          }
        });
      }
  
      this.userDialog = false;
      this.confirmPassword = '';
      this.engorde = {
        id: null,
        nombre: '',
        fecha_compra: null,
        fecha_vitamina: null,
        fecha_salida: null,
        progreso: null
      };
    }
  }
  
  
  

  findIndexById(id: number): number {
    let index = -1;
    for(let i = 0; i < this.engordes.length; i++) {
        if(this.engordes[i].id === id) {
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
