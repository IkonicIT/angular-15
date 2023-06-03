import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemStatusComponent } from './edit-item-status.component';

describe('EditItemStatusComponent', () => {
  let component: EditItemStatusComponent;
  let fixture: ComponentFixture<EditItemStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditItemStatusComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
