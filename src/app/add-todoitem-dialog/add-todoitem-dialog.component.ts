import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { IToDoItem } from "../interfaces/toDoItem";

@Component({
  selector: "app-add-todoitem-dialog",
  templateUrl: "./add-todoitem-dialog.component.html",
  styleUrls: ["./add-todoitem-dialog.component.scss"],
})
export class AddTodoitemDialogComponent implements OnInit {
  load: IToDoItem;
  addToDoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddTodoitemDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.addToDoForm = this.fb.group({
      title: [
        "Food",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
    });
  }
  onSubmit() {
    //this.load = new Load(title, )
    //console.log(this.load);
    this.dialogRef.close(this.addToDoForm.value);
  }
}
