import {Component, inject, OnInit, signal} from '@angular/core';
import {finalize} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Mkb10Service} from '../../../core/services/mkb10.service';
import {Mkb10} from '../../../core/model/mkb10.model';

@Component({
  selector: 'app-mkb10-page',
  imports: [],
  templateUrl: './mkb10-page.component.html',
  styleUrl: './mkb10-page.component.scss',
  standalone: true
})
export class Mkb10PageComponent implements OnInit {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly mkb10Service = inject(Mkb10Service);

  dictionary = signal<Mkb10[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.getDictionary();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);

    this.loading.set(true);

    this.mkb10Service.uploadMkb10Dictionary(formData)
      .subscribe({
        next: () => {
          this.matSnackBar.open('Организация обновлена', '', { panelClass: 'snackbar-success' });
          this.getDictionary();
        },
        error: () => this.loading.set(false)
      });
  }

  private getDictionary() {
    this.mkb10Service.getMkb10Dictionary()
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe(resp => this.dictionary.set(resp));
  }
}
