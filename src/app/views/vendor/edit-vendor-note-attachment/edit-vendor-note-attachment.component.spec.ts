import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVendorNoteAttachmentComponent } from './edit-vendor-note-attachment.component';

describe('AddVendorAttachmentComponent', () => {
  let component: EditVendorNoteAttachmentComponent;
  let fixture: ComponentFixture<EditVendorNoteAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditVendorNoteAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVendorNoteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
