import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorNoteAttachmentComponent } from './add-vendor-note-attachment.component';

describe('AddVendorNoteAttachmentComponent', () => {
  let component: AddVendorNoteAttachmentComponent;
  let fixture: ComponentFixture<AddVendorNoteAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVendorNoteAttachmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVendorNoteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
