import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEngordeComponent } from './tabla-engorde.component';

describe('TablaEngordeComponent', () => {
  let component: TablaEngordeComponent;
  let fixture: ComponentFixture<TablaEngordeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaEngordeComponent]
    });
    fixture = TestBed.createComponent(TablaEngordeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
