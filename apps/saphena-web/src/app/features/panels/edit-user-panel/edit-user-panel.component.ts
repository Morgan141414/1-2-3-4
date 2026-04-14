import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router'
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, map, pipe, switchMap} from 'rxjs';

import {PanelService} from '../../../core/services/panel.service';
import {UserService} from '../../../core/services/user.service';
import {UpdateUserRequest, User} from '../../../core/model/user.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

;

@Component({
  selector: 'app-edit-user-panel',
  imports: [
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-user-panel.component.html',
  styleUrl: './edit-user-panel.component.scss',
  standalone: true
})
export class EditUserPanelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly userService = inject(UserService);
  private readonly panelService = inject(PanelService);
  id = input.required<string>();

  user = signal<User | null>(null);
  form = new FormGroup({
    password: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => params["id"]),
        switchMap(id => this.userService.getUser(id))
      )
      .subscribe(user => this.user.set(user));
  }

  onSubmit() {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      this.form.disable();
      this.userService.updateUser(this.id(), this.form.value as UpdateUserRequest)
        .pipe(
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: _ => {
            this.matSnackBar.open('Пользователь обновлен', '', { panelClass: 'snackbar-success' });
            this.panelService.closePanel();
          }
        })
    }

}
