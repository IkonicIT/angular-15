import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemRepairsComponent } from './edit-item-repairs.component';

describe('EditItemRepairsComponent', () => {
  let component: EditItemRepairsComponent;
  let fixture: ComponentFixture<EditItemRepairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditItemRepairsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemRepairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
