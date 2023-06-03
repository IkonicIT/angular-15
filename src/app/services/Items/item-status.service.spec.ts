import { TestBed, inject } from '@angular/core/testing';
import { ItemStatusService } from './item-status.service';

describe('ItemStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemStatusService]
    });
  });

  it('should be created', inject([ItemStatusService], (service: ItemStatusService) => {
    expect(service).toBeTruthy();
  }));
});
