import { TestBed } from '@angular/core/testing';

import { CandidatarService } from './candidatar.service';

describe('CandidatarService', () => {
  let service: CandidatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
