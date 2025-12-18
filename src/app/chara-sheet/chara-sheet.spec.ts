import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharaSheet } from './chara-sheet';

describe('CharaSheet', () => {
  let component: CharaSheet;
  let fixture: ComponentFixture<CharaSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharaSheet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharaSheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
