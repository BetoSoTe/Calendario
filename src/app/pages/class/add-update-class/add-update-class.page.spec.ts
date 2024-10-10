import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateClassPage } from './add-update-class.page';

describe('AddUpdateClassPage', () => {
  let component: AddUpdateClassPage;
  let fixture: ComponentFixture<AddUpdateClassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateClassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
