import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocationAttributeComponent } from './add-location-attribute.component';

describe('AddLocationAttributeComponent', () => {
  let component: AddLocationAttributeComponent;
  let fixture: ComponentFixture<AddLocationAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLocationAttributeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocationAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
