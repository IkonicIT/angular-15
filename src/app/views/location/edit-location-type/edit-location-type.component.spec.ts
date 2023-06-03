import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLocationTypeComponent } from './edit-location-type.component';

describe('EditLocationTypeComponent', () => {
  let component: EditLocationTypeComponent;
  let fixture: ComponentFixture<EditLocationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditLocationTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
