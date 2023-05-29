import { TestBed, inject } from '@angular/core/testing';

import { CompanydocumentsService } from './companydocuments.service';

describe('CompanydocumentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanydocumentsService]
    });
  });

  it('should be created', inject([CompanydocumentsService], (service: CompanydocumentsService) => {
    expect(service).toBeTruthy();
  }));
});
