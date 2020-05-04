import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { IToDoItem } from "../interfaces/toDoItem";
import { MatDialog } from "@angular/material/dialog";
import { AddTodoitemDialogComponent } from "../add-todoitem-dialog/add-todoitem-dialog.component";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  toDos: IToDoItem[];
  toDosOnPage: IToDoItem[];
  userIdAndBoolean: [number, boolean][] = [];
  filterByReadiness: string = "all";
  sortBy: string = "descDate";
  search: string;

  constructor(private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataService.getToDos().subscribe((data: IToDoItem[]) => {
      this.toDos = data;
      this.getToDos();
    });
    this.setUserIdAndBoolean();
  }

  getToDos(): void {
    this.toDosOnPage = this.toDos;
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

  filterToDos(): void {
    this.getToDos();

    this.toDosOnPage = this.toDos.filter(
      (x) => !!this.userIdAndBoolean.find((z) => z[0] == x.userId && z[1])
    );

    if (this.userIdAndBoolean.every((x) => !x[1])) {
      this.getToDos();
    }

    if (this.filterByReadiness == "done")
      this.toDosOnPage = this.toDosOnPage.filter((x) => x.completed);

    if (this.filterByReadiness == "incomplete")
      this.toDosOnPage = this.toDosOnPage.filter((x) => !x.completed);

    this.sortToDos();
  }

  sortToDos(): void {
    if (this.sortBy == "descDate")
      this.toDosOnPage.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    if (this.sortBy == "ascDate")
      this.toDosOnPage.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

    if (this.sortBy == "alphTitle")
      this.toDosOnPage.sort((a, b) =>
        a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
      );

    if (this.sortBy == "unalphTitle")
      this.toDosOnPage.sort((a, b) =>
        a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1
      );
  }

  openDialogAddToDo() {
    const dialogRef = this.dialog.open(AddTodoitemDialogComponent, {
      width: "400px",
    });

    dialogRef.beforeClosed().subscribe((data) => {
      if (data) {
        this.toDos.unshift({
          ...data,
          createdAt: new Date(),
          completed: false,
          userId: this.dataService.currentUser.id,
          id: this.getNextId(),
        });
        this.saveChanges();
        this.filterToDos();
      }
    });
  }

  getNextId(): number {
    return Math.max(...this.toDos.map((x) => x.id)) + 1;
  }

  saveChanges(): void {
    this.dataService.saveToDos(this.toDos);
  }
}
