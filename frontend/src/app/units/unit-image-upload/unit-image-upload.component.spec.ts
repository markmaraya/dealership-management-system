import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitImageUploadComponent } from './unit-image-upload.component';

describe('UnitImageUploadComponent', () => {
  let component: UnitImageUploadComponent;
  let fixture: ComponentFixture<UnitImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitImageUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
