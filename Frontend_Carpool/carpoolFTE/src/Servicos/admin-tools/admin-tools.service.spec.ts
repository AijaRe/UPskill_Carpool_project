import { TestBed } from '@angular/core/testing';

import { AdminToolsService } from './admin-tools.service';

describe('AdminToolsService', () => {
  let service: AdminToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
