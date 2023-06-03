import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocationStatusComponent } from './add-location-status.component';

describe('AddLocationStatusComponent', () => {
  let component: AddLocationStatusComponent;
  let fixture: ComponentFixture<AddLocationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLocationStatusComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
