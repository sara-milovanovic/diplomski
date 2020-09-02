import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationrequestsComponent } from './registrationrequests.component';

describe('RegistrationrequestsComponent', () => {
  let component: RegistrationrequestsComponent;
  let fixture: ComponentFixture<RegistrationrequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationrequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
