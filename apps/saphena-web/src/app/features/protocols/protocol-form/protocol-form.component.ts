import {Component, computed, input, OnChanges, output} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {Protocol, ProtocolField, ProtocolFieldType, ProtocolSection} from '../../../core/model/protocol.model';
import {
  CreateProtocolDataRequest,
  ProtocolDataForm,
  ProtocolDataFormSection,
  ProtocolDataFormSectionField
} from '../../../core/model/protocol-data.model';
import {DoctorAssistant} from '../../../core/model/doctor-assistant.model';
import {ProtocolInputFieldComponent} from '../protocol-input-field/protocol-input-field.component';
import {ProtocolMkb10InputFieldComponent} from '../protocol-mkb10-input-field/protocol-mkb10-input-field.component';
import {
  ProtocolProvidedProceduresInputFieldComponent
} from '../protocol-provided-procedures-input-field/protocol-provided-procedures-input-field.component';
import {
  ProtocolAssistantSelectFieldComponent
} from '../protocol-assistant-select-field/protocol-assistant-select-field.component';
import {
  ProtocolDoctorSelectFieldComponent
} from '../protocol-doctor-select-field/protocol-doctor-select-field.component';
import {ProtocolRangeInputFieldComponent} from '../protocol-range-input-field/protocol-range-input-field.component';
import {GenderType} from '../../../core/model/patient.model';
import {ProtocolTextareaFieldComponent} from '../protocol-textarea-field/protocol-textarea-field.component';
import {ProtocolCheckboxFieldComponent} from '../protocol-checkbox-field/protocol-checkbox-field.component';
import {ProtocolTableFieldComponent} from '../protocol-table-field/protocol-table-field.component';
import {getFullname} from '../../../shared/utils/name.util';
import {nonEmptyObjectValidator} from '../../../shared/utils/custom-validators.util';

@Component({
  selector: 'app-protocol-form',
  imports: [
    ProtocolInputFieldComponent,
    FormsModule,
    ReactiveFormsModule,
    ProtocolMkb10InputFieldComponent,
    ProtocolProvidedProceduresInputFieldComponent,
    ProtocolAssistantSelectFieldComponent,
    ProtocolDoctorSelectFieldComponent,
    ProtocolRangeInputFieldComponent,
    ProtocolTextareaFieldComponent,
    ProtocolCheckboxFieldComponent,
    ProtocolTableFieldComponent,
  ],
  templateUrl: './protocol-form.component.html',
  styleUrl: './protocol-form.component.scss',
  standalone: true
})
export class ProtocolFormComponent implements OnChanges {
  protected readonly protocolFieldType = ProtocolFieldType;
  protected readonly getFullname = getFullname;
  protocol = input.required<Protocol>();
  patientId = input.required<string>();
  procedureId = input<string>();
  patientGender = input<GenderType>();
  doctorAssistants = input<DoctorAssistant[]>([]);
  loading = input<boolean>(false);
  onSave = output<CreateProtocolDataRequest>();

  form = new FormGroup<ProtocolDataForm>({
    data: new FormArray<FormGroup<ProtocolDataFormSection>>([]),
    doctorAssistantId: new FormControl('')
  });


  assistants = computed(() => this.doctorAssistants().map(a => a.assistant));

  ngOnChanges() {
    this.setProtocolDataForm();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.onSave.emit({
      protocolId: this.protocol().id,
      patientId: this.patientId(),
      ...this.form.value
    } as CreateProtocolDataRequest);
  }

  private setProtocolDataForm() {
    const sections = this.protocol().sections
      .map(section => this.mapSection(section));

    this.form.setControl('data', new FormArray(sections));
  }

  private mapSection(section?: ProtocolSection) {
    return new FormGroup<ProtocolDataFormSection>({
      title: new FormControl(section?.title),
      titleKk: new FormControl(section?.titleKk),
      titleEn: new FormControl(section?.titleEn),
      fields: this.mapFields(section?.fields)
    });
  }

  private mapFields(fields?: ProtocolField[]) {
    return new FormArray<FormGroup>(
      fields?.map(f => {
        return new FormGroup<ProtocolDataFormSectionField>({
          key: new FormControl(f.key),
          type: new FormControl(f.type),
          title: new FormControl(f.title),
          titleKk: new FormControl(f.titleKk),
          titleEn: new FormControl(f.titleEn),
          assistantType: new FormControl(f.assistantType),
          doctorSpecializationId: new FormControl(f.doctorSpecializationId),
          unit: new FormControl(f.unit),
          value: new FormControl('', this.getValueValidators(f.type, f.required)),
          from: new FormControl('', this.getRangeValidators(f.type, f.required)),
          to: new FormControl('', this.getRangeValidators(f.type, f.required)),
          diagnosis: new FormControl([], this.getDiagnosisValidators(f.type, f.required)),
          assistantIds: new FormControl([], this.getAssistantIdsValidators(f.type, f.required)),
          doctorIds: new FormControl([], this.getDoctorIdsValidators(f.type, f.required)),
          providedProcedures: new FormControl([]),
          tableColumns: new FormControl(f.tableColumns || []),
          tableRows: new FormControl(f.tableRows || []),
          tableData: new FormControl<Record<string, string>>({}, this.getTableDataValidators(f.type, f.required)),
        })
      }) || []
    );
  }

  private getValueValidators(type: ProtocolFieldType, required?: boolean) {
    return (type !== ProtocolFieldType.DIAGNOSIS_MKB &&
      type !== ProtocolFieldType.ASSISTANT_SELECT &&
      type !== ProtocolFieldType.DOCTOR_SELECT &&
      type !== ProtocolFieldType.RANGE &&
      type !== ProtocolFieldType.PROCEDURE_LIST &&
      type !== ProtocolFieldType.SUBTITLE &&
      type !== ProtocolFieldType.TABLE) && required ? Validators.required : [];
  }

  private getDiagnosisValidators(type: ProtocolFieldType, required?: boolean) {
    return type === ProtocolFieldType.DIAGNOSIS_MKB && required ? Validators.required : [];
  }

  private getAssistantIdsValidators(type: ProtocolFieldType, required?: boolean) {
    return type === ProtocolFieldType.ASSISTANT_SELECT && required ? Validators.required : [];
  }

  private getDoctorIdsValidators(type: ProtocolFieldType, required?: boolean) {
    return type === ProtocolFieldType.DOCTOR_SELECT && required ? Validators.required : [];
  }

  private getRangeValidators(type: ProtocolFieldType, required?: boolean) {
    return type === ProtocolFieldType.RANGE && required ? Validators.required : [];
  }

  private getTableDataValidators(type: ProtocolFieldType, required?: boolean) {
    return type === ProtocolFieldType.TABLE && required ? nonEmptyObjectValidator() : [];
  }

}
