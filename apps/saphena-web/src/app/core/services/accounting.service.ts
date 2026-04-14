import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {Page, Pageable} from '../model/page.model';
import {
  CreateExpenseRequest,
  CreateExpenseTypeRequest, CreateVendorRequest,
  Expense,
  ExpenseType, Vendor
} from '../model/accounting.model';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  private readonly http = inject(HttpClient);

  #expenses = signal<Page<Expense>>({} as Page<Expense>);
  #expenseTypes = signal<ExpenseType[]>([]);
  #vendors = signal<Page<Vendor>>({} as Page<Vendor>);

  expenseTypes = this.#expenseTypes.asReadonly();
  expenses = this.#expenses.asReadonly();
  vendors = this.#vendors.asReadonly();
  filter = signal({
    bin: '',
    from: '',
    to: '',
    typeId: ''
  });
  vendorSearch = signal('');

  getExpenses(pageable?: Pageable) {
    return this.http.get<Page<Expense>>('/api/accounting/expenses',
      { params: { ...pageable, ...this.filter() }})
      .pipe(
        tap(resp => this.#expenses.set(resp))
      );
  }

  getExpense(id: string) {
    return this.http.get<Expense>(`/api/accounting/expenses/${id}`);
  }

  createExpense(request: CreateExpenseRequest) {
    return this.http.post<void>('/api/accounting/expenses', request);
  }

  getExpenseTypes() {
    return this.http.get<ExpenseType[]>('/api/accounting/expense-types')
      .pipe(
        tap(resp => this.#expenseTypes.set(resp))
      );
  }

  createExpenseType(request: CreateExpenseTypeRequest) {
    return this.http.post<void>('/api/accounting/expense-types', request);
  }

  deleteExpenseType(id: string) {
    return this.http.delete<void>(`/api/accounting/expense-types/${id}`);
  }

  getVendors(pageable?: Pageable) {
    return this.http.get<Page<Vendor>>(`/api/accounting/vendors`,
      { params: { ...pageable, 'search': this.vendorSearch() }})
      .pipe(
        tap(resp => this.#vendors.set(resp))
      );
  }

  getVendorById(id: string) {
    return this.http.get<Vendor>(`/api/accounting/vendors/${id}`);
  }

  createVendor(req: CreateVendorRequest) {
    return this.http.post<void>(`/api/accounting/vendors`, req);
  }

  updateVendor(id: string, req: CreateVendorRequest) {
    return this.http.put<void>(`/api/accounting/vendors/${id}`, req);
  }

  getVendorByBin(bin: string) {
    return this.http.get<Vendor | null>(`/api/accounting/vendors/bin/${bin}`);
  }

  clearState() {
    this.#expenses.set({} as Page<Expense>);
    this.#expenseTypes.set([]);
    this.#vendors.set({} as Page<Vendor>);
  }
}
