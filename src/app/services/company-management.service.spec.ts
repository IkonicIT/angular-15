import { TestBed, inject } from '@angular/core/testing';

import { CompanyManagementService } from './company-management.service';

describe('CompanyManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyManagementService]
    });
  });

  it('should be created', inject([CompanyManagementService], (service: CompanyManagementService) => {
    expect(service).toBeTruthy();
  }));
});
