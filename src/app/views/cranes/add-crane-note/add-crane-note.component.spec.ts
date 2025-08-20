import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCraneNoteComponent } from './add-crane-note.component';

describe('AddCraneNoteComponent', () => {
  let component: AddCraneNoteComponent;
  let fixture: ComponentFixture<AddCraneNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCraneNoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCraneNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
