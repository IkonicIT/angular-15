import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyNotesComponent } from './add-company-notes.component';

describe('AddCompanyNotesComponent', () => {
  let component: AddCompanyNotesComponent;
  let fixture: ComponentFixture<AddCompanyNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompanyNotesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
