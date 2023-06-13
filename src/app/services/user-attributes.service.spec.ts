import { TestBed, inject } from '@angular/core/testing';

import { UserAttributesService } from './user-attributes.service';

describe('UserAttributesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAttributesService]
    });
  });

  it('should be created', inject([UserAttributesService], (service: UserAttributesService) => {
    expect(service).toBeTruthy();
  }));
});
