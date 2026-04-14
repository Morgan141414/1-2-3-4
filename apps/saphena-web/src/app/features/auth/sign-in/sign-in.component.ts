import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize} from 'rxjs';

import {AuthService} from '../../../core/services/auth.service';
import {SignInRequest} from '../../../core/model/auth.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-sign-in',
  imports: [
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  standalone: true
})
export class SignInComponent {
  private readonly authService = inject(AuthService);
  showError = signal(false);

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  hidePassword = signal(true);

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.authService.signIn(this.form.value as SignInRequest)
      .pipe(
        finalize(() => {
          this.form.enable();
        })
      )
      .subscribe({
        error: _ => {
          this.showError.set(true);
        }
      })
  }

}
