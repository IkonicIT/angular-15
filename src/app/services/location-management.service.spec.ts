import { TestBed, inject } from '@angular/core/testing';
import { LocationManagementService } from './location-management.service';

describe('LocationManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationManagementService],
    });
  });

  it('should be created', inject(
    [LocationManagementService],
    (service: LocationManagementService) => {
      expect(service).toBeTruthy();
    }
  ));
});
