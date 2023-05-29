import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNoteAttachmentComponent } from './edit-note-attachment.component';

describe('EditNoteAttachmentComponent', () => {
  let component: EditNoteAttachmentComponent;
  let fixture: ComponentFixture<EditNoteAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditNoteAttachmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNoteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
