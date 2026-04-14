import {ChangeDetectorRef, Component, inject, input, OnDestroy, OnInit, output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';

import {SpecializationService} from '../../../core/services/specialization.service';
import {
  CreateProtocolRequest,
  Protocol,
  ProtocolField,
  ProtocolFieldType,
  ProtocolSection, ProtocolTableColumn, ProtocolTableRow, ProtocolTargetType
} from '../../../core/model/protocol.model';
import {GenderType} from '../../../core/model/patient.model';
import {AssistantType} from '../../../core/model/assistant.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {getAssistantTypeName} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-protocol-constructor',
  imports: [
    ReactiveFormsModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    InputFieldComponent,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './protocol-constructor.component.html',
  styleUrl: './protocol-constructor.component.scss',
  standalone: true
})
export class ProtocolConstructorComponent implements OnInit, OnDestroy {
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly specializationService = inject(SpecializationService);
  protected readonly protocolFieldType = ProtocolFieldType;
  protected readonly getAssistantTypeName = getAssistantTypeName;
  protected readonly genderType = GenderType;
  protected readonly protocolTargetType = ProtocolTargetType;
  protocol = input.required<Protocol | null>();
  targetType = input.required<ProtocolTargetType>();
  onSave = output<CreateProtocolRequest>();
  onReset = output<void>();

  form = new FormGroup({
    sections: new FormArray<FormGroup>([]),
    templateFileName: new FormControl<string | null>(null),
    consultationRequired: new FormControl(false)
  })
  specializations = this.specializationService.specializations;

  constructor() {
    this.specializationService.getSpecializationCatalog()
      .subscribe();
  }

  ngOnInit() {
    if (this.protocol()?.id) {
      this.form.controls.templateFileName
        .setValue(this.protocol()?.templateFileName || null);
      this.form.controls.consultationRequired
        .setValue(this.protocol()?.consultationRequired || false);

      this.protocol()!.sections.forEach(s => {
        this.addSection(s);
      })
    }

    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.specializationService.clearState();
  }

  get fieldTypes(): ProtocolFieldType[] {
    return Object.values(ProtocolFieldType);
  }

  get assistantTypes(): AssistantType[] {
    return Object.values(AssistantType);
  }

  sections() {
    return this.form.controls.sections as FormArray;
  }

  fields(sectionIndex: number) {
    const section = this.sections().at(sectionIndex) as FormGroup;
    return section.controls['fields'] as FormArray;
  }

  options(sectionIndex: number, fieldIndex: number): FormArray {
    const field = this.fields(sectionIndex).at(fieldIndex) as FormGroup;
    return field.controls['options'] as FormArray;
  }

  tableColumns(sectionIndex: number, fieldIndex: number): FormArray {
    const field = this.fields(sectionIndex).at(fieldIndex) as FormGroup;
    return field.controls['tableColumns'] as FormArray;
  }

  tableRows(sectionIndex: number, fieldIndex: number): FormArray {
    const field = this.fields(sectionIndex).at(fieldIndex) as FormGroup;
    return field.controls['tableRows'] as FormArray;
  }

  addSection(section?: ProtocolSection) {
    this.sections().push(
      new FormGroup({
        title: new FormControl(section?.title || ''),
        titleKk: new FormControl(section?.titleKk || ''),
        titleEn: new FormControl(section?.titleEn || ''),
        fields: new FormArray<FormGroup>(
          section?.fields.map(f => this.createField(f)) || [this.createField()]
        )
      })
    )
  }

  removeSection(sectionIndex: number) {
    this.sections().removeAt(sectionIndex);
  }

  addField(sectionIndex: number) {
    this.fields(sectionIndex).push(this.createField());
  }

  removeField(sectionIndex: number, fieldIndex: number) {
    this.fields(sectionIndex).removeAt(fieldIndex);
  }

  addOption(sectionIndex: number, fieldIndex: number) {
    this.options(sectionIndex, fieldIndex).push(new FormControl('', Validators.required));
  }

  removeOption(sectionIndex: number, fieldIndex: number, optionIndex: number) {
    this.options(sectionIndex, fieldIndex).removeAt(optionIndex);
  }

  addTableColumn(sectionIndex: number, fieldIndex: number) {
    this.tableColumns(sectionIndex, fieldIndex).push(this.createTableColumn());
  }

  removeTableColumn(sectionIndex: number, fieldIndex: number, columnIndex: number) {
    this.tableColumns(sectionIndex, fieldIndex).removeAt(columnIndex);
  }

  addTableRow(sectionIndex: number, fieldIndex: number) {
    this.tableRows(sectionIndex, fieldIndex).push(this.createTableColumn());
  }

  removeTableRow(sectionIndex: number, fieldIndex: number, columnIndex: number) {
    this.tableRows(sectionIndex, fieldIndex).removeAt(columnIndex);
  }

  drop(sectionIndex: number, event: CdkDragDrop<AbstractControl[]>) {
    if (event.previousIndex === event.currentIndex) return;

    const formFields = this.fields(sectionIndex);

    const movedControl = formFields.at(event.previousIndex);
    formFields.removeAt(event.previousIndex);
    formFields.insert(event.currentIndex, movedControl);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.onSave.emit(this.form.value as CreateProtocolRequest)
  }

  private createField(field?: ProtocolField) {
    return new FormGroup({
      key: new FormControl(field?.key || '', Validators.required),
      title: new FormControl(field?.title || ''),
      titleKk: new FormControl(field?.titleKk || ''),
      titleEn: new FormControl(field?.titleEn || ''),
      gender: new FormControl(field?.gender),
      required: new FormControl(field?.required || false, Validators.required),
      type: new FormControl(field?.type ?? ProtocolFieldType.TEXT, Validators.required),
      unit: new FormControl(field?.unit || ''),
      options: new FormArray(
        field?.options.map(o => this.createFieldOption(o)) || []
      ),
      assistantType: new FormControl(field?.assistantType || null),
      doctorSpecializationId: new FormControl(field?.doctorSpecializationId || null),
      tableColumns: new FormArray<FormGroup>(
        field?.tableColumns?.map(c => this.createTableColumn(c)) || []
      ),
      tableRows: new FormArray<FormGroup>(
        field?.tableRows?.map(c => this.createTableColumn(c)) || []
      )
    });
  }

  private createFieldOption(option?: string) {
    return new FormControl(option || '', Validators.required);
  }

  private createTableColumn(c?: ProtocolTableColumn | ProtocolTableRow) {
    return new FormGroup({
      key: new FormControl(c?.key || '', Validators.required),
      title: new FormControl(c?.title || '', Validators.required),
      titleKk: new FormControl(c?.titleKk || ''),
      titleEn: new FormControl(c?.titleEn || ''),
    });
  }

}
