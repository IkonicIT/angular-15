import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedItemSearchComponent } from './advanced-item-search.component';

describe('AdvancedItemSearchComponent', () => {
  let component: AdvancedItemSearchComponent;
  let fixture: ComponentFixture<AdvancedItemSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedItemSearchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedItemSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
