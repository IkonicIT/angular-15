import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemTransferComponent } from './item-transfer.component';



describe('AddItemComponent', () => {
  let component: ItemTransferComponent;
  let fixture: ComponentFixture<ItemTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemTransferComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
