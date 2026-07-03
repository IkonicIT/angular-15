import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCraneNoteAttachmentComponent } from './add-crane-note-attachment.component';

describe('AddCraneNoteAttachmentComponent', () => {
  let component: AddCraneNoteAttachmentComponent;
  let fixture: ComponentFixture<AddCraneNoteAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCraneNoteAttachmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCraneNoteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
