import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartNotesComponent } from './part-notes.component';

describe('PartNotesComponent', () => {
  let component: PartNotesComponent;
  let fixture: ComponentFixture<PartNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartNotesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
