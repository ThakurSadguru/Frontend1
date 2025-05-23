// Client type definitions

// Contact interface for alternate contacts
export interface Contact {
  name: string;
  contactNo: string;
  jobTitle: string;
}

// Main client interface
export interface Client {
  _id?: string;
  clientName: string;
  hqCountry: string;
  clientCode: string;
  clientContactNo: string;
  clientMail: string;
  chatId: string;
  alternateContacts: Contact[];
  createdAt?: string;
} 