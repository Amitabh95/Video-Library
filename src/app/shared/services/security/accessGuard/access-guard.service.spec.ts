import { TestBed } from '@angular/core/testing';

import { AccessGuardService } from './access-guard.service';

describe('AccessGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccessGuardService = TestBed.get(AccessGuardService);
    expect(service).toBeTruthy();
  });
});
