import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment'

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [ConfirmationService]
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,private confirmationService: ConfirmationService, private router: Router, private keycloakService: KeycloakService) { }

    userIdentifier: string | undefined;

    ngOnInit(): void {
      this.keycloakService.isLoggedIn().then(isLoggedIn => {
        if (isLoggedIn) {
          this.keycloakService.loadUserProfile().then(userProfile => {
            this.userIdentifier = userProfile.username;  // Asegúrate de que el perfil está cargado
          }).catch(err => {
            console.error("Error loading user profile", err);
          });
        }
      }).catch(err => {
        console.error("Error checking if user is logged in", err);
      });
      
  }
    
    confirm1() {
      this.confirmationService.confirm({
          key: 'confirm1',
          message: 'Está seguro de Cerrar Sesión?',
          accept: () => {
            this.keycloakService.logout(environment.urlLogout);
          },
          reject: () => {
            console.log('Logout cancelled');
          }
      });
  }
}
