import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemRepairItemsComponent } from './edit-item-repair-items.component';

describe('ItemRepairItemsComponent', () => {
  let component: EditItemRepairItemsComponent;
  let fixture: ComponentFixture<EditItemRepairItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditItemRepairItemsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemRepairItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
