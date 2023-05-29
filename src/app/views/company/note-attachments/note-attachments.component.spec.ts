import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteAttachmentsComponent } from './note-attachments.component';

describe('NoteAttachmentsComponent', () => {
  let component: NoteAttachmentsComponent;
  let fixture: ComponentFixture<NoteAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteAttachmentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
