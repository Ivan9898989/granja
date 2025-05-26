import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaLechonesComponent } from './tabla-lechones.component';

describe('TablaLechonesComponent', () => {
  let component: TablaLechonesComponent;
  let fixture: ComponentFixture<TablaLechonesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaLechonesComponent]
    });
    fixture = TestBed.createComponent(TablaLechonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
