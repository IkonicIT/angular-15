import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcompanydetailsComponent } from './editcompanydetails.component';

describe('EditcompanydetailsComponent', () => {
  let component: EditcompanydetailsComponent;
  let fixture: ComponentFixture<EditcompanydetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditcompanydetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcompanydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
