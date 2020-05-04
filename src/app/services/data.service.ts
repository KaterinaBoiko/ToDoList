import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { IToDoItem } from "../interfaces/toDoItem";
import { users } from "../data/users";
import { IUser } from "../interfaces/user";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private _toDos = new BehaviorSubject<IToDoItem[]>([]);
  toDos = this._toDos.asObservable();
  currentUser: IUser = users[0];

  constructor(private http: HttpClient) {
    if (!localStorage.getItem("toDos"))
      this.setInitialToDos().subscribe(
        (data) => {
          this.saveToDos(data.map((x) => ({ ...x, createdAt: new Date() })));
          console.log(JSON.parse(localStorage.getItem("toDos")));
        },
        (error) => console.log(error)
      );
    else this._toDos.next(JSON.parse(localStorage.getItem("toDos")));
  }

  getToDos(): Observable<IToDoItem[]> {
    return this.toDos;
  }

  setInitialToDos(): Observable<IToDoItem[]> {
    return this.http.get<IToDoItem[]>(
      "https://jsonplaceholder.typicode.com/todos?_limit=200"
    );
  }

  saveToDos(toDos: IToDoItem[]): void {
    localStorage.setItem("toDos", JSON.stringify(toDos));
    this._toDos.next(toDos);
  }

  getUserNameById(id: number): string {
    return users.find((x) => x.id == id).name;
  }

  getUsers(): IUser[] {
    return users;
  }
}
