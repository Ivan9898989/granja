import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialEngordeComponent } from './historial-engorde.component';

describe('HistorialEngordeComponent', () => {
  let component: HistorialEngordeComponent;
  let fixture: ComponentFixture<HistorialEngordeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialEngordeComponent]
    });
    fixture = TestBed.createComponent(HistorialEngordeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
