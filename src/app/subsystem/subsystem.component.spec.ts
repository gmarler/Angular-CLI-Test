/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubsystemComponent } from './subsystem.component';

describe('SubsystemComponent', () => {
  let component: SubsystemComponent;
  let fixture: ComponentFixture<SubsystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
