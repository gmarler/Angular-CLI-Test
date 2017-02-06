/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MemstatComponent } from './memstat.component';

describe('MemstatComponent', () => {
  let component: MemstatComponent;
  let fixture: ComponentFixture<MemstatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemstatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemstatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
