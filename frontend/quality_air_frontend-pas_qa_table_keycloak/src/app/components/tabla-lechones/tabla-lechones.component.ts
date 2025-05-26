import { Component, OnInit } from '@angular/core';
import { UserService as LechonService } from '../../services/lechones.service'; 
import { Lechon } from '../../models/lechon';
import { MessageService } from 'primeng/api'; 
import { Table } from 'primeng/table';

@Component({
  selector: 'app-tabla-lechones',
  templateUrl: './tabla-lechones.component.html',
  styleUrls: ['./tabla-lechones.component.scss'],
  providers: [MessageService]
})
export class TablaLechonesComponent implements OnInit{
  userDialog: boolean= false;
  deleteUserDialog: boolean = false;
  deleteUsersDialog:  boolean = false;
  activityValues: number[] = [0, 100];
  lechones: Lechon[] = [];
  lechon: Lechon={
    id: null,
    nombre: '',
    fecha_nacimiento: null,
    fecha_salida: null,
    fecha_destete: null,
    progreso_salida: null,
    progreso_destete: null,
  };
  confirmPassword: string='';
  selectedUsers: Lechon[]=[];
  submitted: boolean=false;
  cols: any[]=[]
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  loading: boolean = false;
 

  constructor(private userService: LechonService, private messageService: MessageService ){}

  ngOnInit(): void {
    this.loadUsers();

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'fecha_nacimiento', header: 'fecha_nacimiento' },
      { field: 'fecha_destete', header: 'fecha_destete' },
      { field: 'fecha_salida', header: 'fecha_salida' }
  ];
  }
  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log(data); 
        this.lechones = data; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.loading = false;
      }
    });
  }

  openNew() {
    this.lechon = {
      id: null,
      nombre: '',
      fecha_nacimiento: null,
      fecha_salida: null,
      fecha_destete: null,
      progreso_salida: null,
      progreso_destete: null,
    };
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelectUsers(){
    this.deleteUsersDialog = true;
  }

  editUser(cerda: Lechon){
    this.lechon = {...cerda }
    this.userDialog = true;
  }

  deleteUser(cerda: Lechon){
    this.deleteUserDialog = true;
    this.lechon = {...cerda}
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
            this.lechones[index] = { ...this.lechones[index]}; // Actualiza el status en la lista
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

  if (this.lechon.id) {

    this.userService.deleteCerda(this.lechon).subscribe({
      next: () => {
        if (this.lechon.id !== null) {
          const index = this.findIndexById(this.lechon.id);
    
          if (index !== -1) {
            this.lechones[index] = { ...this.lechones[index] }; // Actualiza el status en la lista
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
  this.lechon = {
    id: null,
    nombre: '',
    fecha_nacimiento: null,
    fecha_salida: null,
    fecha_destete: null,
    progreso_salida: null,
    progreso_destete: null,
  };
}

  

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;
  

  
    if (this.lechon.nombre?.trim()) {
      if (this.lechon.id) {
        this.userService.updateUser(this.lechon).subscribe({
          next: (updatedUser) => {
            if (this.lechon.id !== null) {
              const index = this.findIndexById(this.lechon.id);
              if (index !== -1) {
                this.lechones[index] = updatedUser;
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
        this.userService.addUser(this.lechon).subscribe({
          next: (newUser) => {
            this.lechones.push(newUser);
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
      this.lechon = {
        id: null,
        nombre: '',
        fecha_nacimiento: null,
        fecha_salida: null,
        fecha_destete: null,
        progreso_salida: null,
        progreso_destete: null,
      };
    }
  }
  
  
  

  findIndexById(id: number): number {
    let index = -1;
    for(let i = 0; i < this.lechones.length; i++) {
        if(this.lechones[i].id === id) {
          index = i;
          break;
      }
    }
    return index;
  }

  createId(): number {
    return Math.floor(Math.random() * 100000); // Generates a random number as ID
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
