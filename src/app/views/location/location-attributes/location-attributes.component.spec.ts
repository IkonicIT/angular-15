import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationAttributesComponent } from './location-attributes.component';

describe('LocationAttributesComponent', () => {
  let component: LocationAttributesComponent;
  let fixture: ComponentFixture<LocationAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationAttributesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
