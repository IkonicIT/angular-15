import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemStatusComponent } from './add-item-status.component';

describe('AddItemStatusComponent', () => {
  let component: AddItemStatusComponent;
  let fixture: ComponentFixture<AddItemStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemStatusComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
