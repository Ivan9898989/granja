import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/historial-lechones.service';
import { HistorialLechon } from 'src/app/models/historial-lechones';

@Component({
  selector: 'app-historial-lechones',
  templateUrl: './historial-lechones.component.html',
  styleUrls: ['./historial-lechones.component.scss']
})
export class HistorialLechonesComponent implements OnInit{
  historial: HistorialLechon[] = [];
  idLechonAMover: number | null = null;
  mensaje: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.obtenerHistorial();
  }

  obtenerHistorial(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.historial = data;
      },
      error: (err) => {
        console.error('Error al obtener historial:', err);
      }
    });
  }

  moverAlHistorial(): void {
    if (this.idLechonAMover != null) {
      this.userService.moverLechonAlHistorial(this.idLechonAMover).subscribe({
        next: () => {
          this.mensaje = `Lechón con ID ${this.idLechonAMover} movido al historial.`;
          this.idLechonAMover = null;
          this.obtenerHistorial();
        },
        error: (err) => {
          console.error('Error al mover lechón:', err);
          this.mensaje = 'Error al mover lechón al historial.';
        }
      });
    }
  }
}
