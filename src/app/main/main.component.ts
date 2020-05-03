import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { IToDoItem } from "../interfaces/toDoItem";
import { MatDialog } from "@angular/material/dialog";
import { AddTodoitemDialogComponent } from "../add-todoitem-dialog/add-todoitem-dialog.component";
import { IUser } from "../interfaces/User";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  toDos: IToDoItem[];
  userIdAndBoolean: [number, boolean][] = [];

  constructor(private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getToDos();
    this.setUserIdAndBoolean();
  }

  getToDos(): void {
    this.dataService.getToDos().subscribe((data: IToDoItem[]) => {
      this.toDos = data;
    });
  }

  getToDoAuthorName(id: number): string {
    return this.dataService.getUserNameById(id);
  }

  deleteItem(id: number): void {
    let index = this.toDos.findIndex((x) => x.id == id);
    this.toDos.splice(index, 1);
    this.saveChanges();
  }

  setUserIdAndBoolean(): void {
    this.userIdAndBoolean = this.dataService
      .getUsers()
      .map((x) => [x.id, false]);
  }

  filterToDos(readiness?: string): void {
    this.getToDos();

    this.toDos = this.toDos.filter(
      (x) => !!this.userIdAndBoolean.find((z) => z[0] == x.userId && z[1])
    );

    if (this.userIdAndBoolean.every((x) => !x[1])) {
      this.getToDos();
    }

    if (readiness == "done") this.toDos = this.toDos.filter((x) => x.completed);
    if (readiness == "incomplete")
      this.toDos = this.toDos.filter((x) => !x.completed);
  }

  openDialogAddToDo() {
    const dialogRef = this.dialog.open(AddTodoitemDialogComponent, {
      width: "400px",
    });

    console.log(this.getNextId());

    dialogRef.beforeClosed().subscribe((data) => {
      if (data) {
        this.getToDos(); //????
        this.toDos.unshift({
          ...data,
          createdAt: new Date(),
          completed: false,
          userId: this.dataService.currentUser.id,
          id: this.getNextId(),
        });
        this.saveChanges();
      }
      console.log(data);
    });
  }

  getNextId(): number {
    return Math.max(...this.toDos.map((x) => x.id)) + 1;
  }

  saveChanges(): void {
    this.dataService.saveToDos(this.toDos);
  }
}
