import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyNotesComponent } from './edit-company-notes.component';

describe('EditCompanyNotesComponent', () => {
  let component: EditCompanyNotesComponent;
  let fixture: ComponentFixture<EditCompanyNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditCompanyNotesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
