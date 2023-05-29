import { TestBed, inject } from '@angular/core/testing';

import { CompanyStatusService } from './company-status.service';

describe('CompanyStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyStatusService]
    });
  });

  it('should be created', inject([CompanyStatusService], (service: CompanyStatusService) => {
    expect(service).toBeTruthy();
  }));
});
