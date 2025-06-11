import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCraneNoteComponent } from './edit-crane-note.component';

describe('EditCraneNoteComponent', () => {
  let component: EditCraneNoteComponent;
  let fixture: ComponentFixture<EditCraneNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditCraneNoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCraneNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
