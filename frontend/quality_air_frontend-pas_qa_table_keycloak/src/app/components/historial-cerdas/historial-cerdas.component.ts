import { Component, OnInit } from '@angular/core';
import { CerdasService } from 'src/app/services/historial-cerdas.service';
import { HistorialCerdas } from 'src/app/models/historial-cerdas';

@Component({
  selector: 'app-historial-cerdas',
  templateUrl: './historial-cerdas.component.html',
  styleUrls: ['./historial-cerdas.component.scss']
})
export class HistorialCerdasComponent implements OnInit{
  historial: HistorialCerdas[] = [];
  idLechonAMover: number | null = null;
  mensaje: string = '';

  constructor(private cerdaService: CerdasService) {}

  ngOnInit(): void {
    this.obtenerHistorial();
  }

  obtenerHistorial(): void {
    this.cerdaService.getUsers().subscribe({
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
      this.cerdaService.moverLechonAlHistorial(this.idLechonAMover).subscribe({
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
