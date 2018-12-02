import { TestBed } from '@angular/core/testing';

import { FirestoreDatabaseService } from './firestore-database.service';

describe('FirestoreDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestoreDatabaseService = TestBed.get(FirestoreDatabaseService);
    expect(service).toBeTruthy();
  });
});
