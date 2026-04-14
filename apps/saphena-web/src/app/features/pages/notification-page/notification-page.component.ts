import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgxQrcodeStylingComponent, Options} from 'ngx-qrcode-styling';
import {catchError, EMPTY, finalize, interval, startWith, Subscription, switchMap, tap} from 'rxjs';

import {NotificationService} from '../../../core/services/notification.service';
import {WhatsAppClientStatus} from '../../../core/model/notification.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-notification-page',
  imports: [
    NgxQrcodeStylingComponent,
    NgClass
  ],
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.scss',
  standalone: true
})
export class NotificationPageComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  #pollingSubscription?: Subscription;

  config: Options = {
    width: 300,
    height: 300
  };
  status = signal<null | WhatsAppClientStatus>(null)
  qr = signal<string>('');
  loading = signal(false);

  ngOnInit() {
    this.startPolling();
  }

  createClient() {
    this.loading.set(true);

    this.notificationService.createWhatsAppClient()
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe(_ => this.startPolling());
  }

  deleteClient() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Вы уверены что хотите отвязать клиент WhatsApp?',
        subtitle: 'ВАЖНО!!! Не забудьте закочить сессию в приложении WhatsApp на телефоне'
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.loading.set(true);

          this.notificationService.deleteWhatsAppClient()
            .pipe(
              finalize(() => this.loading.set(false))
            )
            .subscribe(_ => {
              this.qr.set('');
              this.status.set(null);
              this.matSnackBar.open('Клиент удален', '', {panelClass: 'snackbar-success'});
              this.getStatus();
            });
        }
      })
  }

  private startPolling() {
    if (this.#pollingSubscription?.closed === false) return;

    this.#pollingSubscription = interval(5000)
      .pipe(
        startWith(0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(_ => this.getStatus())
  }

  private getStatus() {
    this.notificationService.getWhatsAppClientStatus()
      .pipe(
        tap(status => this.status.set(status)),
        switchMap(status => {
          if (status.success && !status.connected) {
            return this.notificationService.getWhatsAppQR()
              .pipe(
                tap(qr => this.qr.set(qr)),
                catchError(_ => EMPTY)
              )
          }
          else if (status.success && status.connected) {
            this.qr.set('');
          }
          return EMPTY;
        }),
        catchError(_ => {
          this.#pollingSubscription?.unsubscribe();
          return EMPTY;
        })
      )
      .subscribe();
  }
}
