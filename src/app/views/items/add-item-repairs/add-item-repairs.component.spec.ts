import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemRepairsComponent } from './add-item-repairs.component';

describe('AddItemRepairsComponent', () => {
  let component: AddItemRepairsComponent;
  let fixture: ComponentFixture<AddItemRepairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemRepairsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemRepairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
