import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserviceVsSpareComponent } from './inservice-vs-spare.component';

describe('InserviceVsSpareComponent', () => {
  let component: InserviceVsSpareComponent;
  let fixture: ComponentFixture<InserviceVsSpareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserviceVsSpareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserviceVsSpareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
