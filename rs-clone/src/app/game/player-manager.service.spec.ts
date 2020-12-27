import { TestBed } from '@angular/core/testing';

import { PlayerManagerService } from './player-manager.service';

describe('PlayerManagerService', () => {
  let service: PlayerManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
