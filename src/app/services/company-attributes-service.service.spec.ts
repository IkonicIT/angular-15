import { TestBed, inject } from '@angular/core/testing';

import { CompanyAttributesServiceService } from './company-attributes-service.service';

describe('CompanyAttributesServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyAttributesServiceService]
    });
  });

  it('should be created', inject([CompanyAttributesServiceService], (service: CompanyAttributesServiceService) => {
    expect(service).toBeTruthy();
  }));
});
