import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartNoteComponent } from './edit-part-note.component';

describe('EditPartNoteComponent', () => {
  let component: EditPartNoteComponent;
  let fixture: ComponentFixture<EditPartNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPartNoteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPartNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
