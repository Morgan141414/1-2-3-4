export interface Page<T> {
  content: T[],
  totalPages: number,
  number: number,
  last: boolean
}

export interface Pageable {
  page?: number,
  size?: number,
  sort?: string[],
  direction?: string
}
