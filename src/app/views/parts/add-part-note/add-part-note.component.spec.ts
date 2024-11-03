import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartNoteComponent } from './add-part-note.component';

describe('AddPartNoteComponent', () => {
  let component: AddPartNoteComponent;
  let fixture: ComponentFixture<AddPartNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPartNoteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPartNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
