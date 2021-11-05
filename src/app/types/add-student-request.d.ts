import { GenderType } from './gender-type'

export class AddUpdateStudentRequest {
  name: string
  gender: GenderType
  address: string
  mobile: string
  dob: Date
}
