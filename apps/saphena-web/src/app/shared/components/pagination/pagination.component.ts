import {Component, input, output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [
    NgClass
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  standalone: true
})
export class PaginationComponent {
  totalPages = input.required<number>();
  number = input.required<number>();
  last = input.required<boolean>()
  pageChanged = output<number>();

  get visiblePages(): number[] {
    const pages = [];
    const start = Math.max(1, this.number() - 1);
    const end = Math.min(this.totalPages(), start + 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
