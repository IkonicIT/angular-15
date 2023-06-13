import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyTypeManagementComponent } from './warranty-type-management.component';

describe('WarrantyTypeManagementComponent', () => {
  let component: WarrantyTypeManagementComponent;
  let fixture: ComponentFixture<WarrantyTypeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarrantyTypeManagementComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
