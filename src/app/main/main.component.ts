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
    this.dataService.getToDos().subscribe((data: IToDoItem[]) => {
      this.toDos = data;
    });
    this.setUserIdAndBoolean();
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
    if (this.userIdAndBoolean.every((x) => !x[1])) {
      this.dataService.getToDos().subscribe((data: IToDoItem[]) => {
        this.toDos = data;
      });
    }

    if (readiness == "done") this.toDos = this.toDos.filter((x) => x.completed);
    if (readiness == "all") this.toDos = this.toDos;
    if (readiness == "incomplete")
      this.toDos = this.toDos.filter((x) => !x.completed);
  }

  openDialogAddToDo() {
    const dialogRef = this.dialog.open(AddTodoitemDialogComponent, {
      width: "400px",
    });

    dialogRef.beforeClosed().subscribe((data) => {
      // if (!data) return;
      // const { title, width, length, height, payload } = data;
      // const load = new Load(
      //   title,
      //   this.currShipper._id,
      //   { width: width, length: length, height: height },
      //   payload
      // );
      // this.shipperService
      //   .addLoad(load)
      //   .then(() => this.createdLoads.push(load))
      //   .catch((error) => this.openSnackBar(error.error));
      console.log(data);
    });
  }

  saveChanges(): void {
    this.dataService.saveToDos(this.toDos);
  }
}
