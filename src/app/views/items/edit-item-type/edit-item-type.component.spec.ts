import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemTypeComponent } from './edit-item-type.component';

describe('EditItemTypeComponent', () => {
  let component: EditItemTypeComponent;
  let fixture: ComponentFixture<EditItemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditItemTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
