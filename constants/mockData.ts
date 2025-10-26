export interface Student {
    id: string;
    name: string;
    urduName: string;
    class: string;
    section: string;
  }
  
  export const MOCK_STUDENTS: Student[] = [
    // Hifz 1 - Section A
    { id: '1', name: 'Ahmed Ali', urduName: 'احمد علی', class: 'Hifz 1', section: 'A' },
    { id: '2', name: 'Muhammad Hassan', urduName: 'محمد حسن', class: 'Hifz 1', section: 'A' },
    { id: '3', name: 'Ibrahim Khan', urduName: 'ابراہیم خان', class: 'Hifz 1', section: 'A' },
    { id: '4', name: 'Yusuf Ahmed', urduName: 'یوسف احمد', class: 'Hifz 1', section: 'A' },
    
    // Hifz 1 - Section B
    { id: '5', name: 'Ali Raza', urduName: 'علی رضا', class: 'Hifz 1', section: 'B' },
    { id: '6', name: 'Hassan Ali', urduName: 'حسن علی', class: 'Hifz 1', section: 'B' },
    { id: '7', name: 'Usman Khan', urduName: 'عثمان خان', class: 'Hifz 1', section: 'B' },
    { id: '8', name: 'Zaid Ahmed', urduName: 'زید احمد', class: 'Hifz 1', section: 'B' },
    
    // Hifz 1 - Section C
    { id: '9', name: 'Hamza Ali', urduName: 'حمزہ علی', class: 'Hifz 1', section: 'C' },
    { id: '10', name: 'Bilal Khan', urduName: 'بلال خان', class: 'Hifz 1', section: 'C' },
    { id: '11', name: 'Saad Ahmed', urduName: 'سعد احمد', class: 'Hifz 1', section: 'C' },
    { id: '12', name: 'Tariq Ali', urduName: 'طارق علی', class: 'Hifz 1', section: 'C' },
    
    // Hifz 2 - Section A
    { id: '13', name: 'Abdullah Khan', urduName: 'عبداللہ خان', class: 'Hifz 2', section: 'A' },
    { id: '14', name: 'Umar Farooq', urduName: 'عمر فاروق', class: 'Hifz 2', section: 'A' },
    { id: '15', name: 'Khalid Ahmed', urduName: 'خالد احمد', class: 'Hifz 2', section: 'A' },
    { id: '16', name: 'Salman Ali', urduName: 'سلمان علی', class: 'Hifz 2', section: 'A' },
    
    // Hifz 2 - Section B
    { id: '17', name: 'Fatima Zahra', urduName: 'فاطمہ زہرا', class: 'Hifz 2', section: 'B' },
    { id: '18', name: 'Aisha Khan', urduName: 'عائشہ خان', class: 'Hifz 2', section: 'B' },
    { id: '19', name: 'Maryam Ali', urduName: 'مریم علی', class: 'Hifz 2', section: 'B' },
    { id: '20', name: 'Khadija Ahmed', urduName: 'خدیجہ احمد', class: 'Hifz 2', section: 'B' },
    
    // Hifz 2 - Section C
    { id: '21', name: 'Zainab Khan', urduName: 'زینب خان', class: 'Hifz 2', section: 'C' },
    { id: '22', name: 'Ruqayya Ali', urduName: 'رقّیہ علی', class: 'Hifz 2', section: 'C' },
    { id: '23', name: 'Safiya Ahmed', urduName: 'صفیہ احمد', class: 'Hifz 2', section: 'C' },
    { id: '24', name: 'Hafsa Khan', urduName: 'حفصہ خان', class: 'Hifz 2', section: 'C' },
    
    // Hifz 3 - Section A
    { id: '25', name: 'Muhammad Ali', urduName: 'محمد علی', class: 'Hifz 3', section: 'A' },
    { id: '26', name: 'Ibrahim Hassan', urduName: 'ابراہیم حسن', class: 'Hifz 3', section: 'A' },
    { id: '27', name: 'Yusuf Khan', urduName: 'یوسف خان', class: 'Hifz 3', section: 'A' },
    { id: '28', name: 'Ismail Ahmed', urduName: 'اسماعیل احمد', class: 'Hifz 3', section: 'A' },
    
    // Hifz 3 - Section B
    { id: '29', name: 'Abdul Rahman', urduName: 'عبدالرحمن', class: 'Hifz 3', section: 'B' },
    { id: '30', name: 'Abdul Aziz', urduName: 'عبدالعزیز', class: 'Hifz 3', section: 'B' },
    { id: '31', name: 'Abdul Malik', urduName: 'عبدالملک', class: 'Hifz 3', section: 'B' },
    { id: '32', name: 'Abdul Qadir', urduName: 'عبدالقادر', class: 'Hifz 3', section: 'B' },
    
    // Hifz 3 - Section C
    { id: '33', name: 'Taha Ali', urduName: 'طہٰ علی', class: 'Hifz 3', section: 'C' },
    { id: '34', name: 'Yasin Khan', urduName: 'یٰسین خان', class: 'Hifz 3', section: 'C' },
    { id: '35', name: 'Mansoor Ahmed', urduName: 'منصور احمد', class: 'Hifz 3', section: 'C' },
    { id: '36', name: 'Nadeem Ali', urduName: 'ندیم علی', class: 'Hifz 3', section: 'C' },
    
    // Hifz 4 - Section A
    { id: '37', name: 'Haroon Khan', urduName: 'ہارون خان', class: 'Hifz 4', section: 'A' },
    { id: '38', name: 'Musa Ahmed', urduName: 'موسیٰ احمد', class: 'Hifz 4', section: 'A' },
    { id: '39', name: 'Dawood Ali', urduName: 'داود علی', class: 'Hifz 4', section: 'A' },
    { id: '40', name: 'Sulaiman Khan', urduName: 'سلیمان خان', class: 'Hifz 4', section: 'A' },
    
    // Hifz 4 - Section B
    { id: '41', name: 'Ayub Ahmed', urduName: 'ایوب احمد', class: 'Hifz 4', section: 'B' },
    { id: '42', name: 'Yunus Ali', urduName: 'یونس علی', class: 'Hifz 4', section: 'B' },
    { id: '43', name: 'Zakariya Khan', urduName: 'زکریا خان', class: 'Hifz 4', section: 'B' },
    { id: '44', name: 'Yahya Ahmed', urduName: 'یحییٰ احمد', class: 'Hifz 4', section: 'B' },
    
    // Hifz 4 - Section C
    { id: '45', name: 'Isa Ali', urduName: 'عیسیٰ علی', class: 'Hifz 4', section: 'C' },
    { id: '46', name: 'Idris Khan', urduName: 'ادریس خان', class: 'Hifz 4', section: 'C' },
    { id: '47', name: 'Hud Ahmed', urduName: 'ہود احمد', class: 'Hifz 4', section: 'C' },
    { id: '48', name: 'Saleh Ali', urduName: 'صالح علی', class: 'Hifz 4', section: 'C' },
    
    // Hifz 5 - Section A
    { id: '49', name: 'Shuaib Khan', urduName: 'شعیب خان', class: 'Hifz 5', section: 'A' },
    { id: '50', name: 'Lut Ahmed', urduName: 'لوط احمد', class: 'Hifz 5', section: 'A' },
    { id: '51', name: 'Ibrahim Ali', urduName: 'ابراہیم علی', class: 'Hifz 5', section: 'A' },
    { id: '52', name: 'Ismail Khan', urduName: 'اسماعیل خان', class: 'Hifz 5', section: 'A' },
    
    // Hifz 5 - Section B
    { id: '53', name: 'Ishaq Ahmed', urduName: 'اسحاق احمد', class: 'Hifz 5', section: 'B' },
    { id: '54', name: 'Yaqub Ali', urduName: 'یعقوب علی', class: 'Hifz 5', section: 'B' },
    { id: '55', name: 'Yusuf Khan', urduName: 'یوسف خان', class: 'Hifz 5', section: 'B' },
    { id: '56', name: 'Ayyub Ahmed', urduName: 'ایوب احمد', class: 'Hifz 5', section: 'B' },
    
    // Hifz 5 - Section C
    { id: '57', name: 'Shuayb Ali', urduName: 'شعیب علی', class: 'Hifz 5', section: 'C' },
    { id: '58', name: 'Musa Khan', urduName: 'موسیٰ خان', class: 'Hifz 5', section: 'C' },
    { id: '59', name: 'Haroon Ahmed', urduName: 'ہارون احمد', class: 'Hifz 5', section: 'C' },
    { id: '60', name: 'Dawood Ali', urduName: 'داود علی', class: 'Hifz 5', section: 'C' },
  ];
  
  export const CLASSES = ['Hifz 1', 'Hifz 2', 'Hifz 3', 'Hifz 4', 'Hifz 5'];
  export const SECTIONS = ['A', 'B', 'C'];
  