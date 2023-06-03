import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedItemSearchReplacementComponent } from './advanced-item-search-replacement.component';

describe('AdvancedItemSearchComponent', () => {
  let component: AdvancedItemSearchReplacementComponent;
  let fixture: ComponentFixture<AdvancedItemSearchReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedItemSearchReplacementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedItemSearchReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
