import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestPlayerComponent } from './best-player.component';

describe('BestPlayerComponent', () => {
  let component: BestPlayerComponent;
  let fixture: ComponentFixture<BestPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
