import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVendorNoteAttachmentComponent } from './manage-vendor-note-attachment.component';

describe('AddVendorAttachmentComponent', () => {
  let component: ManageVendorNoteAttachmentComponent;
  let fixture: ComponentFixture<ManageVendorNoteAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageVendorNoteAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVendorNoteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
