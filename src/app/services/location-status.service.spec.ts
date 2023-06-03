import { TestBed, inject } from '@angular/core/testing';
import { LocationStatusService } from './location-status.service';

describe('LocationStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationStatusService],
    });
  });

  it('should be created', inject(
    [LocationStatusService],
    (service: LocationStatusService) => {
      expect(service).toBeTruthy();
    }
  ));
});
