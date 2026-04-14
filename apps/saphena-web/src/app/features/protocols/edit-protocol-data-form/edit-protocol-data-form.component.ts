import {Component, computed, input, OnInit, output} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

import {Protocol, ProtocolFieldType} from '../../../core/model/protocol.model';
import {
  ProtocolData, ProtocolDataForm,
  ProtocolDataFormSection, ProtocolDataFormSectionField, ProtocolFieldData, ProtocolSectionData,
  UpdateProtocolDataRequest
} from '../../../core/model/protocol-data.model';
import {DoctorAssistant} from '../../../core/model/doctor-assistant.model';
import {
  ProtocolAssistantSelectFieldComponent
} from '../protocol-assistant-select-field/protocol-assistant-select-field.component';
import {
  ProtocolDoctorSelectFieldComponent
} from '../protocol-doctor-select-field/protocol-doctor-select-field.component';
import {ProtocolInputFieldComponent} from '../protocol-input-field/protocol-input-field.component';
import {ProtocolMkb10InputFieldComponent} from '../protocol-mkb10-input-field/protocol-mkb10-input-field.component';
import {
  ProtocolProvidedProceduresInputFieldComponent
} from '../protocol-provided-procedures-input-field/protocol-provided-procedures-input-field.component';
import {ProtocolRangeInputFieldComponent} from '../protocol-range-input-field/protocol-range-input-field.component';
import {ProtocolTextareaFieldComponent} from '../protocol-textarea-field/protocol-textarea-field.component';
import {getAssistantTypeName, getFullname} from '../../../shared/utils/name.util';
import {ProtocolCheckboxFieldComponent} from "../protocol-checkbox-field/protocol-checkbox-field.component";
import {ProtocolTableFieldComponent} from "../protocol-table-field/protocol-table-field.component";

@Component({
  selector: 'app-edit-protocol-data-form',
    imports: [
        ProtocolAssistantSelectFieldComponent,
        ProtocolDoctorSelectFieldComponent,
        ProtocolInputFieldComponent,
        ProtocolMkb10InputFieldComponent,
        ProtocolProvidedProceduresInputFieldComponent,
        ReactiveFormsModule,
        FormsModule,
        ProtocolRangeInputFieldComponent,
        ProtocolTextareaFieldComponent,
        ProtocolCheckboxFieldComponent,
        ProtocolTableFieldComponent
    ],
  templateUrl: './edit-protocol-data-form.component.html',
  styleUrl: './edit-protocol-data-form.component.scss',
  standalone: true
})
export class EditProtocolDataFormComponent implements OnInit {
  protected readonly protocolFieldType = ProtocolFieldType;
  protected readonly getFullname = getFullname;
  protected readonly getAssistantTypeName = getAssistantTypeName;
  protocol = input.required<Protocol>();
  protocolData = input.required<ProtocolData>();
  procedureId = input<string>();
  doctorAssistants = input<DoctorAssistant[]>([]);
  loading = input<boolean>(false);
  onEdit = output<UpdateProtocolDataRequest>();

  assistants = computed(() => this.doctorAssistants().map(a => a.assistant));

  form = new FormGroup<ProtocolDataForm>({
    data: new FormArray<FormGroup<ProtocolDataFormSection>>([]),
    doctorAssistantId: new FormControl('')
  });

  ngOnInit() {
    this.setProtocolDataForm();
  }

  edit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.onEdit.emit(this.form.value as UpdateProtocolDataRequest)
  }

  private setProtocolDataForm() {
    this.form.controls.doctorAssistantId?.setValue(this.protocolData().doctorAssistantId)

    this.protocolData().data
      .forEach(section => {
        this.form.controls.data
          .push(this.mapSection(section));
      });
  }

  private mapSection(section: ProtocolSectionData) {
    return new FormGroup<ProtocolDataFormSection>({
      title: new FormControl(section.title),
      titleKk: new FormControl(section.titleKk),
      titleEn: new FormControl(section.titleEn),
      fields: this.mapFields(section.fields)
    });
  }

  private mapFields(fields: ProtocolFieldData[]) {
    return new FormArray<FormGroup>(
      fields.map(f => {
        return new FormGroup<ProtocolDataFormSectionField>({
          key: new FormControl(f.key),
          type: new FormControl(f.type),
          title: new FormControl(f.title),
          titleKk: new FormControl(f.titleKk),
          titleEn: new FormControl(f.titleEn),
          assistantType: new FormControl(f.assistantType),
          doctorSpecializationId: new FormControl(f.doctorSpecializationId),
          unit: new FormControl(f.unit),
          value: new FormControl(f.value),
          from: new FormControl(f.from),
          to: new FormControl(f.to),
          diagnosis: new FormControl(f.diagnosis),
          assistantIds: new FormControl(f.assistantIds),
          doctorIds: new FormControl(f.doctorIds),
          providedProcedures: new FormControl(f.providedProcedures),
          tableColumns: new FormControl(f.tableColumns),
          tableRows: new FormControl(f.tableRows),
          tableData: new FormControl(f.tableData),
        })
      }) || []
    );
  }
}
