import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVendorAttachmentComponent } from './edit-vendor-attachment.component';

describe('EditVendorAttachmentComponent', () => {
  let component: EditVendorAttachmentComponent;
  let fixture: ComponentFixture<EditVendorAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditVendorAttachmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVendorAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
