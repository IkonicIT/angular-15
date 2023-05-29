import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanystatusesComponent } from './companystatuses.component';

describe('CompanystatusesComponent', () => {
  let component: CompanystatusesComponent;
  let fixture: ComponentFixture<CompanystatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanystatusesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanystatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
