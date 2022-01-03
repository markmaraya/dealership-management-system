import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesImageUploadComponent } from './sales-image-upload.component';

describe('SalesImageUploadComponent', () => {
  let component: SalesImageUploadComponent;
  let fixture: ComponentFixture<SalesImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesImageUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
