import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemChangeLogComponent } from './item-change-log.component';

describe('ItemChangeLogComponent', () => {
  let component: ItemChangeLogComponent;
  let fixture: ComponentFixture<ItemChangeLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemChangeLogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemChangeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
