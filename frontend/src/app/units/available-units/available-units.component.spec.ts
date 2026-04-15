import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableUnitsComponent } from './available-units.component';

describe('AvailableUnitsComponent', () => {
  let component: AvailableUnitsComponent;
  let fixture: ComponentFixture<AvailableUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableUnitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
