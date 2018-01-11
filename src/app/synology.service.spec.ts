import { TestBed, inject } from '@angular/core/testing';

import { SynologyService } from './synology.service';

describe('SynologyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SynologyService]
    });
  });

  it('should be created', inject([SynologyService], (service: SynologyService) => {
    expect(service).toBeTruthy();
  }));
});
