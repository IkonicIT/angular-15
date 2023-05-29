import { TestBed, inject } from '@angular/core/testing';

import { CompanyStatusesService } from './company-statuses.service';

describe('CompanyStatusesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyStatusesService]
    });
  });

  it('should be created', inject([CompanyStatusesService], (service: CompanyStatusesService) => {
    expect(service).toBeTruthy();
  }));
});
