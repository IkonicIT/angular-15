import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyTypeComponent } from './add-company-type.component';

describe('AddCompanyTypeComponent', () => {
  let component: AddCompanyTypeComponent;
  let fixture: ComponentFixture<AddCompanyTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompanyTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
