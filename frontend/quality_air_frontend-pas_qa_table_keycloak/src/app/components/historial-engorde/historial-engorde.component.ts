import { Component, OnInit } from '@angular/core';
import { EngordeService } from 'src/app/services/historial-engorde.service';
import { HistorialEngorde } from 'src/app/models/historial-engorde';


@Component({
  selector: 'app-historial-engorde',
  templateUrl: './historial-engorde.component.html',
  styleUrls: ['./historial-engorde.component.scss']
})
export class HistorialEngordeComponent implements OnInit{
  historial: HistorialEngorde[] = [];
  idLechonAMover: number | null = null;
  mensaje: string = '';

  constructor(private userService: EngordeService) {}

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
