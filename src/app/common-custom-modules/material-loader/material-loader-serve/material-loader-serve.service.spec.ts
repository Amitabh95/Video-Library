import { TestBed } from '@angular/core/testing';

import { MaterialLoaderServeService } from './material-loader-serve.service';

describe('MaterialLoaderServeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialLoaderServeService = TestBed.get(MaterialLoaderServeService);
    expect(service).toBeTruthy();
  });
});
