import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCraneNoteAttachmentComponent } from './edit-crane-note-attachment.component';

describe('EditCraneNoteAttachmentComponent', () => {
  let component: EditCraneNoteAttachmentComponent;
  let fixture: ComponentFixture<EditCraneNoteAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditCraneNoteAttachmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCraneNoteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
