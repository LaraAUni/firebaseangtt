import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Armoury } from './armoury';

describe('Armoury', () => {
  let component: Armoury;
  let fixture: ComponentFixture<Armoury>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Armoury]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Armoury);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
