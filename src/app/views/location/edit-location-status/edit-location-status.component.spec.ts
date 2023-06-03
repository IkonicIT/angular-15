import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLocationStatusComponent } from './edit-location-status.component';

describe('EditLocationStatusComponent', () => {
  let component: EditLocationStatusComponent;
  let fixture: ComponentFixture<EditLocationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditLocationStatusComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
