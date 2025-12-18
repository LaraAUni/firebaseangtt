import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnoSheet } from './abno-sheet';

describe('AbnoSheet', () => {
  let component: AbnoSheet;
  let fixture: ComponentFixture<AbnoSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbnoSheet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbnoSheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
