import {Component, inject, OnInit, signal} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';

import {SettingsService} from '../../../core/services/settings.service';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-organization-logo',
  imports: [],
  templateUrl: './organization-logo.component.html',
  styleUrl: './organization-logo.component.scss',
  standalone: true
})
export class OrganizationLogoComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly dialog = inject(MatDialog);
  private readonly settingsService = inject(SettingsService);

  logoUrl = signal<Blob | null>(null);

  ngOnInit() {
    this.settingsService.getLogo()
      .subscribe(resp => {
        if (resp.size > 0) {
          const url = URL.createObjectURL(resp);
          this.logoUrl.set(this.sanitizer.bypassSecurityTrustUrl(url) as any);
        }
      });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.settingsService.uploadLogo(file)
      .subscribe(resp => {
        const url = URL.createObjectURL(resp);
        this.logoUrl.set(this.sanitizer.bypassSecurityTrustUrl(url) as any);
      });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Вы уверены что хотите удалить логотип?'
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.settingsService.deleteLogo()
            .subscribe(_ => {
              this.logoUrl.set(null);
            })
        }
      })
  }
}
