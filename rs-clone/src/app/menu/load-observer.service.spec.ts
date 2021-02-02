import { TestBed } from '@angular/core/testing';

import { LoadObserverService } from './load-observer.service';

describe('LoadObserverService', () => {
  let service: LoadObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
