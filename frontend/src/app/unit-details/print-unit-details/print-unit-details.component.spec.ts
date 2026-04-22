import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintUnitDetailsComponent } from './print-unit-details.component';

describe('PrintUnitDetailsComponent', () => {
  let component: PrintUnitDetailsComponent;
  let fixture: ComponentFixture<PrintUnitDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintUnitDetailsComponent]
    });
    fixture = TestBed.createComponent(PrintUnitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
