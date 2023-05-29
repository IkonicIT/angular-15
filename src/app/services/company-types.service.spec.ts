import { TestBed, inject } from '@angular/core/testing';

import { CompanyTypesService } from './company-types.service';

describe('CompanyTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyTypesService]
    });
  });

  it('should be created', inject([CompanyTypesService], (service: CompanyTypesService) => {
    expect(service).toBeTruthy();
  }));
});
