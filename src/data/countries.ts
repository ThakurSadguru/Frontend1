export interface Country {
  _id: string;
  name: string;
  value: string;
  label: string;
}

export const countries: Country[] = [
  { _id: '1', name: 'United States', value: '1', label: 'United States' },
  { _id: '2', name: 'Germany', value: '2', label: 'Germany' },
  { _id: '3', name: 'Japan', value: '3', label: 'Japan' },
  { _id: '4', name: 'Sweden', value: '4', label: 'Sweden' },
  { _id: '5', name: 'United Arab Emirates', value: '5', label: 'United Arab Emirates' },
  { _id: '6', name: 'India', value: '6', label: 'India' },
  { _id: '7', name: 'United Kingdom', value: '7', label: 'United Kingdom' },
  { _id: '8', name: 'Canada', value: '8', label: 'Canada' },
]; 