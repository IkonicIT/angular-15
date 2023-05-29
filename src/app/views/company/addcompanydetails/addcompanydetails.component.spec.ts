import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcompanydetailsComponent } from './addcompanydetails.component';

describe('AddcompanydetailsComponent', () => {
  let component: AddcompanydetailsComponent;
  let fixture: ComponentFixture<AddcompanydetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddcompanydetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcompanydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
