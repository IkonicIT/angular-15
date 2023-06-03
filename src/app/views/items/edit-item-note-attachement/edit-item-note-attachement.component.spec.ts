import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemNoteAttachementComponent } from './edit-item-note-attachement.component';

describe('EditItemNoteAttachementComponent', () => {
  let component: EditItemNoteAttachementComponent;
  let fixture: ComponentFixture<EditItemNoteAttachementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditItemNoteAttachementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemNoteAttachementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
