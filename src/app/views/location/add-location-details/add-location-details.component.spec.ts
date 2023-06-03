import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLocationDetailsComponent } from './add-location-details.component';

describe('AddLocationDetailsComponent', () => {
  let component: AddLocationDetailsComponent;
  let fixture: ComponentFixture<AddLocationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLocationDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
