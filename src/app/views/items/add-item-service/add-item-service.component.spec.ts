import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemServiceComponent } from './add-item-service.component';

describe('AddItemServiceComponent', () => {
  let component: AddItemServiceComponent;
  let fixture: ComponentFixture<AddItemServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemServiceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
