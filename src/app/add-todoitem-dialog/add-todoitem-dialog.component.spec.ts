import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTodoitemDialogComponent } from './add-todoitem-dialog.component';

describe('AddTodoitemDialogComponent', () => {
  let component: AddTodoitemDialogComponent;
  let fixture: ComponentFixture<AddTodoitemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTodoitemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoitemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
