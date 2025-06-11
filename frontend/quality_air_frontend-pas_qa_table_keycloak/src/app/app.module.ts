import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppLayoutModule } from './layout/app.layout.module';
import { AppRoutingModule } from './app-routing.module';


/* PrimeNG */
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog'; 
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';



import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TableComponent } from './components/table/table.component';
import keycloakConfig from './keycloak/keycloak.conf';
import { TablaLechonesComponent } from './components/tabla-lechones/tabla-lechones.component';
import { TablaEngordeComponent } from './components/tabla-engorde/tabla-engorde.component';
import { HistorialCerdasComponent } from './components/historial-cerdas/historial-cerdas.component';
import { HistorialLechonesComponent } from './components/historial-lechones/historial-lechones.component';
import { HistorialEngordeComponent } from './components/historial-engorde/historial-engorde.component';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: keycloakConfig,
      initOptions: {
        onLoad: 'login-required', // Other options: 'check-sso', 'login-required'
        checkLoginIframe: true,
      },
      enableBearerInterceptor:true
    });
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TableComponent,
    TablaLechonesComponent,
    TablaEngordeComponent,
    HistorialCerdasComponent,
    HistorialLechonesComponent,
    HistorialEngordeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule,
    ChartModule,
    ButtonModule,
    DropdownModule,
    ProgressBarModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    MessagesModule, 
    MessageModule,
    ToastModule,
    TableModule,
    SliderModule,
    DialogModule,
    ToolbarModule,
    RatingModule,
    KeycloakAngularModule
  ],
  providers: [MessageService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
