import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorAttachmentComponent } from './add-vendor-attachment.component';

describe('AddVendorAttachmentComponent', () => {
  let component: AddVendorAttachmentComponent;
  let fixture: ComponentFixture<AddVendorAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddVendorAttachmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
