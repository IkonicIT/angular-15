import { TestBed, inject } from '@angular/core/testing';

import { CompanyDocumentsService } from './company-documents.service';

describe('CompanyDocumentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyDocumentsService]
    });
  });

  it('should be created', inject([CompanyDocumentsService], (service: CompanyDocumentsService) => {
    expect(service).toBeTruthy();
  }));
});
