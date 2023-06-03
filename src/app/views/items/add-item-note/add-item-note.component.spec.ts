import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemNoteComponent } from './add-item-note.component';

describe('AddItemNoteComponent', () => {
  let component: AddItemNoteComponent;
  let fixture: ComponentFixture<AddItemNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemNoteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
