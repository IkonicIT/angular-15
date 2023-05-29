import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNoteAttachmentComponent } from './add-note-attachment.component';

describe('AddNoteAttachmentComponent', () => {
  let component: AddNoteAttachmentComponent;
  let fixture: ComponentFixture<AddNoteAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNoteAttachmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNoteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
