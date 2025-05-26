import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { HomeComponent } from './components/home/home.component';
import { TableComponent } from './components/table/table.component';
import { TablaLechonesComponent } from './components/tabla-lechones/tabla-lechones.component';
import { TablaEngordeComponent } from './components/tabla-engorde/tabla-engorde.component';

const routes: Routes = [
  {
    path: '', component:AppLayoutComponent,
    children:[
      {
        path:'', component: HomeComponent,
      },
      {
        path: 'table', component: TableComponent,
      },  
      {
        path: 'table-lechones', component: TablaLechonesComponent,
      },  
      {
        path: 'table-engorde', component: TablaEngordeComponent,
      }
    ]
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
