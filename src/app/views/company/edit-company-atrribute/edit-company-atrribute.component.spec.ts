import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyAtrributeComponent } from './edit-company-atrribute.component';

describe('EditCompanyAtrributeComponent', () => {
  let component: EditCompanyAtrributeComponent;
  let fixture: ComponentFixture<EditCompanyAtrributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditCompanyAtrributeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyAtrributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
