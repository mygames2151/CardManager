export interface AppState {
  isAuthenticated: boolean;
  currentPage: string;
  darkMode: boolean;
  pin: string;
}

export interface FilterOptions {
  city?: string;
  identity?: string;
  gender?: string;
  maritalStatus?: string;
}

export interface SortOptions {
  field: 'name' | 'id';
  direction: 'asc' | 'desc';
}
