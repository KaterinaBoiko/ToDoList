import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "searchPipe",
})
export class SearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();

    return value.filter((item) => item.title.toLowerCase().includes(args));
  }
}
