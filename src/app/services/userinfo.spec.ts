import { TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/services/userinfo.spec.ts
import { Userinfo } from './userinfo';

describe('Userinfo', () => {
  let service: Userinfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Userinfo);
========
import { Sharedrules } from './sharedrules';

describe('Sharedrules', () => {
  let service: Sharedrules;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sharedrules);
>>>>>>>> 00422dddfd8ef81a258aa8cd1997fa18ea9fc23d:src/app/services/sharedrules.spec.ts
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
