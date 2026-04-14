import {Component, output, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {eachYearOfInterval} from 'date-fns';

@Component({
  selector: 'app-year-month-filter',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './year-month-filter.component.html',
  styleUrl: './year-month-filter.component.scss',
  standalone: true
})
export class YearMonthFilterComponent {
  private readonly CURRENT_YEAR = new Date().getFullYear();
  protected readonly years = eachYearOfInterval({
    start: new Date(2025, 0, 1),
    end: new Date(this.CURRENT_YEAR, 0, 1)
  }).map(d => d.getFullYear())
    .reverse();
  searchClicked = output<{ year: string, month?: string }>();
  year = signal(this.CURRENT_YEAR);
  month = signal('');

  search() {
    this.searchClicked.emit({
      year: this.year().toString(),
      month: this.month().toString()
    })
  }

}
