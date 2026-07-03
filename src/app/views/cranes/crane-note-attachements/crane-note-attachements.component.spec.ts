import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CraneNoteAttachementsComponent } from './crane-note-attachements.component';

describe('CraneNoteAttachementsComponent', () => {
  let component: CraneNoteAttachementsComponent;
  let fixture: ComponentFixture<CraneNoteAttachementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CraneNoteAttachementsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CraneNoteAttachementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
