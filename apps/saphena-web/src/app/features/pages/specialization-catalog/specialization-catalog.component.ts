import {Component, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import {OrganizationProcedureService} from '../../../core/services/organization-procedure.service';
import {Specialization} from '../../../core/model/specialization.model';
import {
  SelectProceduresDialogComponent
} from '../../procedures/select-procedures-dialog/select-procedures-dialog.component';

@Component({
  selector: 'app-specialization-catalog',
  imports: [
    FormsModule,
    RouterLink,
  ],
  templateUrl: './specialization-catalog.component.html',
  styleUrl: './specialization-catalog.component.scss',
  standalone: true
})
export class SpecializationCatalogComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly organizationProcedureService = inject(OrganizationProcedureService);

  specializations = signal<Specialization[]>([]);

  ngOnInit() {
    this.getSpecializations();
  }

  openAddSpecializationPanel() {
    const dialogRef = this.dialog.open(SelectProceduresDialogComponent,
      {
        maxWidth: '1600px',
        width: '90vw',
        height: '95vh',
      }
    );

    dialogRef.afterClosed()
      .subscribe(added => {
        if (added) {
          this.getSpecializations();
        }
      })
  }

  private getSpecializations() {
    this.organizationProcedureService.getSpecializations()
      .subscribe(resp => this.specializations.set(resp));
  }

}
