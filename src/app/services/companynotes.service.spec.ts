import { TestBed, inject } from '@angular/core/testing';

import { CompanynotesService } from './companynotes.service';

describe('CompanynotesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanynotesService]
    });
  });

  it('should be created', inject([CompanynotesService], (service: CompanynotesService) => {
    expect(service).toBeTruthy();
  }));
});
