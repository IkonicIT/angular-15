import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAttachementsComponent } from './vendor-attachements.component';

describe('VendorAttachementsComponent', () => {
  let component: VendorAttachementsComponent;
  let fixture: ComponentFixture<VendorAttachementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VendorAttachementsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAttachementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
