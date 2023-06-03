import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemTypeComponent } from './add-item-type.component';

describe('AddItemTypeComponent', () => {
  let component: AddItemTypeComponent;
  let fixture: ComponentFixture<AddItemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
