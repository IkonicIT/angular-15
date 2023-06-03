import { TestBed, inject } from '@angular/core/testing';

import { WarrantyManagementService } from './warranty-management.service';

describe('WarrantyManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WarrantyManagementService]
    });
  });

  it('should be created', inject([WarrantyManagementService], (service: WarrantyManagementService) => {
    expect(service).toBeTruthy();
  }));
});
