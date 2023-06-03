import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLocationNoteAttachmentsComponent } from './add-location-note-attachments.component';

describe('AddLocationNoteAttachmentsComponent', () => {
  let component: AddLocationNoteAttachmentsComponent;
  let fixture: ComponentFixture<AddLocationNoteAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLocationNoteAttachmentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocationNoteAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
