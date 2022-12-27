import { Address } from "./address.model";
import { Gender } from "./gender.model";

export interface Student {
  id: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  mobile: number,
  email: string,
  genderId: string,
  gender: Gender,
  profileImageUrl: string,
  address: Address
}
