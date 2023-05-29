import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyAtrributeComponent } from './add-company-atrribute.component';

describe('AddCompanyAtrributeComponent', () => {
  let component: AddCompanyAtrributeComponent;
  let fixture: ComponentFixture<AddCompanyAtrributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompanyAtrributeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyAtrributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
