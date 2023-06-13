import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWarrantyTypeComponent } from './edit-warranty-type.component';

describe('EditWarrantyTypeComponent', () => {
  let component: EditWarrantyTypeComponent;
  let fixture: ComponentFixture<EditWarrantyTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditWarrantyTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWarrantyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
