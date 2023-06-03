import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLocationDetailsComponent } from './edit-location-details.component';

describe('EditLocationDetailsComponent', () => {
  let component: EditLocationDetailsComponent;
  let fixture: ComponentFixture<EditLocationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditLocationDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
