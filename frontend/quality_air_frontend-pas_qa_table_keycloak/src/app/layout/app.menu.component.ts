import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                ]
            },
            {
                label: 'Inicio',
                items: [
                    { label: 'Reproductoras', icon: 'pi pi-fw pi-table', routerLink: ['/table'] },
                    { label: 'Engorde', icon: 'pi pi-fw pi-table', routerLink: ['/table-engorde'] },
                    { label: 'Lechones', icon: 'pi pi-fw pi-table', routerLink: ['/table-lechones'] },
                ]
            },
            {
                label: 'Historial',
                items: [
                    { label: 'Historial Reproductoras', icon: 'pi pi-fw pi-table', routerLink: ['/historial-cerdas'] },
                    { label: 'Historial Engorde', icon: 'pi pi-fw pi-table', routerLink: ['/historial-engorde'] },
                    { label: 'Historial Lechones', icon: 'pi pi-fw pi-table', routerLink: ['/historial-lechones'] },
                ]
            }

        ];
    }
}
