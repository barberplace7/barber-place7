export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
} as const;

export const TRANSACTION_TYPES = {
  SERVICE: 'SERVICE',
  PRODUCT: 'PRODUCT',
  EXPENSE: 'EXPENSE',
  ALL: 'ALL'
} as const;

export const PAYMENT_METHODS = {
  CASH: 'CASH',
  QRIS: 'QRIS'
} as const;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  KASIR: 'KASIR'
} as const;

export const VISIT_STATUS = {
  ONGOING: 'ONGOING',
  DONE: 'DONE',
  CANCELED: 'CANCELED'
} as const;

export const SERVICE_CATEGORY = {
  HAIRCUT: 'HAIRCUT',
  TREATMENT: 'TREATMENT'
} as const;

export const EXPENSE_CATEGORY = {
  OPERASIONAL: 'OPERASIONAL',
  TAMBAHAN: 'TAMBAHAN',
  LAINNYA: 'LAINNYA'
} as const;
