import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogContent} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs';

import {ProtocolService} from '../../../core/services/protocol.service';
import {
  CreateProtocolRequest,
  Protocol,
  ProtocolConstructorDialogData,
} from '../../../core/model/protocol.model';
import {ProtocolConstructorComponent} from '../protocol-constructor/protocol-constructor.component';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-protocol-constructor-dialog',
  imports: [
    MatDialogContent,
    ProtocolConstructorComponent,
  ],
  templateUrl: './protocol-constructor-dialog.component.html',
  styleUrl: './protocol-constructor-dialog.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtocolConstructorDialogComponent implements OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly protocolService = inject(ProtocolService);
  data = inject<ProtocolConstructorDialogData>(MAT_DIALOG_DATA);

  protocol = signal<Protocol | null>(null);
  loading = signal(false);

  constructor() {
    this.getProtocol();
  }

  ngOnDestroy() {
    this.protocolService.clearState();
  }

  save(req: CreateProtocolRequest) {
    this.protocolService.createProtocol(
      this.data.targetType,
      this.data.targetId,
      req,
    )
      .subscribe(() => {
        this.matSnackBar.open('Протокол сохранен', '', { panelClass: 'snackbar-success' });
        this.getProtocol();
      });
  }

  resetProtocol() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        subtitle: 'Вы уверены что хотите cбросить протокол?'
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.protocolService.resetProtocolToTemplate(
            this.data.targetType,
            this.data.targetId,
          )
            .subscribe(() => {
              this.matSnackBar.open('Протокол сброшен', '', { panelClass: 'snackbar-success' });
              this.getProtocol();
            })
        }
      });
  }

  private getProtocol() {
    this.loading.set(true);
    this.protocolService.getActiveProtocol(
      this.data.targetType,
      this.data.targetId,
    )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(resp => this.protocol.set(resp));
  }

}
