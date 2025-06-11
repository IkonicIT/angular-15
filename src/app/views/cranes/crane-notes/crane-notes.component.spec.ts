import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CraneNotesComponent } from './crane-notes.component';

describe('CraneNotesComponent', () => {
  let component: CraneNotesComponent;
  let fixture: ComponentFixture<CraneNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CraneNotesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CraneNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
