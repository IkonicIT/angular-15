import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLocationNoteComponent } from './add-location-note.component';

describe('AddLocationNoteComponent', () => {
  let component: AddLocationNoteComponent;
  let fixture: ComponentFixture<AddLocationNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLocationNoteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocationNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
