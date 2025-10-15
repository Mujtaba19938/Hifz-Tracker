export interface Student {
    id: string;
    name: string;
    urduName: string;
    class: string;
    section: string;
  }
  
  export const MOCK_STUDENTS: Student[] = [
    { id: '1', name: 'Ahmed Ali', urduName: 'احمد علی', class: 'Hifz 1', section: 'A' },
    { id: '2', name: 'Muhammad Hassan', urduName: 'محمد حسن', class: 'Hifz 1', section: 'A' },
    { id: '3', name: 'Fatima Zahra', urduName: 'فاطمہ زہرا', class: 'Hifz 2', section: 'B' },
    { id: '4', name: 'Aisha Khan', urduName: 'عائشہ خان', class: 'Hifz 2', section: 'B' },
    { id: '5', name: 'Omar Farooq', urduName: 'عمر فاروق', class: 'Hifz 3', section: 'A' },
  ];
  
  export const CLASSES = ['Hifz 1', 'Hifz 2', 'Hifz 3', 'Hifz 4', 'Hifz 5'];
  export const SECTIONS = ['A', 'B', 'C'];
  