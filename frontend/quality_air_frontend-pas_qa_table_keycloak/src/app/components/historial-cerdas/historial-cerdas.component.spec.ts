import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCerdasComponent } from './historial-cerdas.component';

describe('HistorialCerdasComponent', () => {
  let component: HistorialCerdasComponent;
  let fixture: ComponentFixture<HistorialCerdasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialCerdasComponent]
    });
    fixture = TestBed.createComponent(HistorialCerdasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
