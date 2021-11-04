import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { baseConfig } from './config'
import { Apollo, gql } from 'apollo-angular'

@Injectable()
export class StudentApiService {
  constructor(private apollo: Apollo) {}

  fetchStudents = () => {
    return this.apollo.watchQuery({
      query: gql`
        {
          students {
            id
            name
            dob
            age
            address
            gender
          }
        }
      `,
    }).valueChanges
  }
}
