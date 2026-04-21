import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnitDetailsComponent } from './edit-unit-details.component';

describe('EditUnitDetailsComponent', () => {
  let component: EditUnitDetailsComponent;
  let fixture: ComponentFixture<EditUnitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUnitDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUnitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
