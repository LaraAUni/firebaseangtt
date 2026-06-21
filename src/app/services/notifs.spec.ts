import { TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/services/sharedrules.spec.ts
import { Sharedrules } from './sharedrules';

describe('Sharedrules', () => {
  let service: Sharedrules;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sharedrules);
========
import { Notifs } from './notifs';

describe('Notifs', () => {
  let service: Notifs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Notifs);
>>>>>>>> 00422dddfd8ef81a258aa8cd1997fa18ea9fc23d:src/app/services/notifs.spec.ts
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
