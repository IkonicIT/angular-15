import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLocationAttributeComponent } from './edit-location-attribute.component';

describe('EditLocationAttributeComponent', () => {
  let component: EditLocationAttributeComponent;
  let fixture: ComponentFixture<EditLocationAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditLocationAttributeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocationAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
