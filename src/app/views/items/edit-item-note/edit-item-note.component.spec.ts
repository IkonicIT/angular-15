import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemNoteComponent } from './edit-item-note.component';

describe('EditItemNoteComponent', () => {
  let component: EditItemNoteComponent;
  let fixture: ComponentFixture<EditItemNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditItemNoteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
