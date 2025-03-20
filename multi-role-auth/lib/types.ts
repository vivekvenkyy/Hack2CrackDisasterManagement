export interface User {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    password: string;
    country: string;
    city: string;
    pinCode: string;
  }
  
  export interface Admin {
    id: string;
    name: string;
    email: string;
    password: string;
  }
  
  export interface Volunteer {
    id: string;
    name: string;
    email: string;
    password: string;
    locality: string;
    transport: string;
  }
  
  export interface Agency {
    id: string;
    agencyName: string;
    agencyId: string;
    agencyProof: string;
    agencyContact: string;
    agencyLocation: string;
  }
  
  export interface Database {
    users: User[];
    admins: Admin[];
    volunteers: Volunteer[];
    agencies: Agency[];
  }
  
  export type Role = 'user' | 'admin' | 'volunteer' | 'agency';