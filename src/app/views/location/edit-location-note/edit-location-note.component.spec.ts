import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLocationNoteComponent } from './edit-location-note.component';

describe('EditLocationNoteComponent', () => {
  let component: EditLocationNoteComponent;
  let fixture: ComponentFixture<EditLocationNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditLocationNoteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocationNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
