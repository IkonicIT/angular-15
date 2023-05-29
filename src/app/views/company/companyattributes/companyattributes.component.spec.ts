import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyattributesComponent } from './companyattributes.component';

describe('CompanyattributesComponent', () => {
  let component: CompanyattributesComponent;
  let fixture: ComponentFixture<CompanyattributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyattributesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyattributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
