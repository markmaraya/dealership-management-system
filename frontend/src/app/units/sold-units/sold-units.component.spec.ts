import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldUnitsComponent } from './sold-units.component';

describe('SoldUnitsComponent', () => {
  let component: SoldUnitsComponent;
  let fixture: ComponentFixture<SoldUnitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoldUnitsComponent]
    });
    fixture = TestBed.createComponent(SoldUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
