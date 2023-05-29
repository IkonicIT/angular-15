import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcompanydetailsComponent } from './viewcompanydetails.component';

describe('ViewcompanydetailsComponent', () => {
  let component: ViewcompanydetailsComponent;
  let fixture: ComponentFixture<ViewcompanydetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewcompanydetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcompanydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
