import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeLocationsComponent } from './merge-locations.component';

describe('MergeLocationsComponent', () => {
  let component: MergeLocationsComponent;
  let fixture: ComponentFixture<MergeLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MergeLocationsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
