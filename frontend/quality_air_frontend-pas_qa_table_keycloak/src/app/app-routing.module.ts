import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { HomeComponent } from './components/home/home.component';
import { TableComponent } from './components/table/table.component';
import { TablaLechonesComponent } from './components/tabla-lechones/tabla-lechones.component';
import { TablaEngordeComponent } from './components/tabla-engorde/tabla-engorde.component';
import { HistorialEngordeComponent } from './components/historial-engorde/historial-engorde.component';
import { HistorialLechonesComponent } from './components/historial-lechones/historial-lechones.component';
import { HistorialCerdasComponent } from './components/historial-cerdas/historial-cerdas.component';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'table', component: TableComponent },
      { path: 'table-lechones', component: TablaLechonesComponent },
      { path: 'table-engorde', component: TablaEngordeComponent },
      { path: 'historial-engorde', component: HistorialEngordeComponent },
      { path: 'historial-lechones', component: HistorialLechonesComponent },
      { path: 'historial-cerdas', component: HistorialCerdasComponent },
    ]
  },
  // Ruta comodín para capturar errores de navegación
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

