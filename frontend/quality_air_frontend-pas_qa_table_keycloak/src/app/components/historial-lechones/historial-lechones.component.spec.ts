import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialLechonesComponent } from './historial-lechones.component';

describe('HistorialLechonesComponent', () => {
  let component: HistorialLechonesComponent;
  let fixture: ComponentFixture<HistorialLechonesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialLechonesComponent]
    });
    fixture = TestBed.createComponent(HistorialLechonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
