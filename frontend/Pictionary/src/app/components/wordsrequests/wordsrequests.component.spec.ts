import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsrequestsComponent } from './wordsrequests.component';

describe('WordsrequestsComponent', () => {
  let component: WordsrequestsComponent;
  let fixture: ComponentFixture<WordsrequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordsrequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
