import {
  Component,
  ElementRef,
  computed,
  effect,
  input,
  output,
  signal,
  viewChildren,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.scss',
  standalone: true
})
export class OtpInputComponent implements AfterViewInit {
  length = input(6);
  disabled = input(false);
  label = input('');
  codeChange = output<string>();

  boxesRef = viewChildren<ElementRef<HTMLInputElement>>('box');

  boxes = computed(() => Array.from({ length: this.length() }));
  digits = signal<string[]>([]);

  constructor() {
    // пересоздаём digits когда меняется length
    effect(() => {
      const len = this.length();
      const current = this.digits();
      if (current.length !== len) {
        this.digits.set(Array.from({ length: len }, () => ''));
        this.emit();
      }
    });
  }

  ngAfterViewInit(): void {
    this.focusFirst();
  }

  setCode(code: string) {
    const len = this.length();
    const onlyDigits = (code ?? '').replace(/\D/g, '').slice(0, len);
    const arr = Array.from({ length: len }, (_, i) => onlyDigits[i] ?? '');
    this.digits.set(arr);
    this.emit();
  }

  focusFirst() {
    this.boxesRef().at(0)?.nativeElement.focus();
  }

  private emit() {
    this.codeChange.emit(this.digits().join(''));
  }

  onKeyDown(e: KeyboardEvent, index: number) {
    const key = e.key;

    if (key === 'Tab' || key === 'ArrowLeft' || key === 'ArrowRight') return;

    if (key === 'Backspace') {
      e.preventDefault();
      const arr = [...this.digits()];
      if (arr[index]) {
        arr[index] = '';
        this.digits.set(arr);
        this.emit();
        return;
      }
      if (index > 0) {
        arr[index - 1] = '';
        this.digits.set(arr);
        this.emit();
        this.focusIndex(index - 1);
      }
      return;
    }

    if (key.length === 1 && !/^\d$/.test(key)) e.preventDefault();
  }

  onInput(e: Event, index: number) {
    const inputEl = e.target as HTMLInputElement;
    const val = (inputEl.value ?? '').replace(/\D/g, '').slice(0, 1);

    const arr = [...this.digits()];
    arr[index] = val;
    this.digits.set(arr);
    this.emit();

    inputEl.value = val;

    if (val && index < this.length() - 1) this.focusIndex(index + 1);
  }

  onPaste(e: ClipboardEvent) {
    e.preventDefault();
    this.setCode(e.clipboardData?.getData('text') ?? '');

    const arr = this.digits();
    const nextEmpty = arr.findIndex(d => !d);
    this.focusIndex(nextEmpty === -1 ? this.length() - 1 : nextEmpty);
  }

  private focusIndex(i: number) {
    const el = this.boxesRef().at(i)?.nativeElement;
    el?.focus();
    el?.select();
  }
}
