export interface Expense {
  id: string,
  type: string,
  date: string,
  expenseList: ExpenseListItem[]
  totalCost: number,
  vendorBin?: string,
  vendorName?: string,
  contactPersonName?: string,
  contactPersonPhone?: string,
  comment?: string
}

export interface ExpenseListItem {
  name: string,
  count: number,
  cost: number,
  sum: number
}

export interface CreateExpenseRequest {
  typeId: string,
  vendorId?: string,
  vendorBin?: string,
  vendorName?: string,
  contactPersonName?: string,
  contactPersonPhone?: string,
  date: string,
  expenseList: ExpenseListItem[]
  totalCost: number,
  comment?: string
}

export interface Vendor {
  id: string,
  bin: string,
  name?: string,
  contactPersonName?: string,
  contactPersonPhone?: string
}

export interface CreateVendorRequest {
  bin: string,
  name?: string,
  contactPersonName?: string,
  contactPersonPhone?: string
}

export interface ExpenseType {
  id: string,
  name: string
}

export interface CreateExpenseTypeRequest {
  name: string
}

export interface ExpenseFilterParams {
  bin: string,
  from: string,
  to: string,
  typeId: string
}
