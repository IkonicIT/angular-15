import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLocationTypeComponent } from './add-location-type.component';

describe('AddLocationTypeComponent', () => {
  let component: AddLocationTypeComponent;
  let fixture: ComponentFixture<AddLocationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLocationTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
