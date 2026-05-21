import { TestBed } from '@angular/core/testing';

import { IconsNames } from './icons-names';

describe('IconsNames', () => {
  let service: IconsNames;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconsNames);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
