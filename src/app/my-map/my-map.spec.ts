import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMap } from './my-map';

describe('MyMap', () => {
  let component: MyMap;
  let fixture: ComponentFixture<MyMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
