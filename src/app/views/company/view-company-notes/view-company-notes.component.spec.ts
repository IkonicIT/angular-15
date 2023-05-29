import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyNotesComponent } from './view-company-notes.component';

describe('ViewCompanyNotesComponent', () => {
  let component: ViewCompanyNotesComponent;
  let fixture: ComponentFixture<ViewCompanyNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCompanyNotesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
