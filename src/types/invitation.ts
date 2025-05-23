
export type UserRole = 'ADMIN'| "CO_ADMIN"| 'USER'|'SUPERVISOR'| 'DESIGNER'| 'DATA_ENGINEER'

export interface invitationType{
    email: string,
    role: UserRole | any
}

export interface Invitation {
  _id: string;
  email: string;
  role: string;
  status: string;
}

export interface invitationPropType{
     setShowModal:(show:boolean)=>boolean | any;
}

