import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLocationNoteAttachmentsComponent } from './edit-location-note-attachments.component';

describe('EditLocationNoteAttachmentsComponent', () => {
  let component: EditLocationNoteAttachmentsComponent;
  let fixture: ComponentFixture<EditLocationNoteAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditLocationNoteAttachmentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocationNoteAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
