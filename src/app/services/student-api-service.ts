import { Injectable } from '@angular/core'
import { baseConfig } from './config'
import { HttpClient } from '@angular/common/http'
import { Apollo, gql } from 'apollo-angular'
import { AddUpdateStudentRequest } from '../types/add-student-request'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class StudentService {
  constructor(private apollo: Apollo, private http: HttpClient) {}

  fetchStudents = (): Observable<any[]> => {
    return this.apollo
      .watchQuery({
        query: gql`
          {
            students {
              id
              name
              dob
              age
              address
              mobile
              gender
            }
          }
        `,
      })
      .valueChanges.pipe(map((res: any) => res))
  }

  addStudent = (payload: AddUpdateStudentRequest) => {
    const ADD_STUDENT = gql`
      mutation addStudent($student: AddUpdateStudentRequest!) {
        addStudent(student: $student) {
          id
          name
        }
      }
    `
    return this.apollo.mutate({
      mutation: ADD_STUDENT,
      variables: {
        student: payload,
      },
    })
  }

  updateStudent = (
    id: number,
    payload: AddUpdateStudentRequest,
  ): Observable<any[]> => {
    const UPDATE_STUDENT = gql`
      mutation updateStudent($student: AddUpdateStudentRequest!, $id: Float!) {
        updateStudent(student: $student, id: $id) {
          id
          name
        }
      }
    `
    return this.apollo
      .mutate({
        mutation: UPDATE_STUDENT,
        variables: {
          student: payload,
          id: id,
        },
      })
      .pipe(map((res: any) => res))
  }

  deleteStudent = (id: number) => {
    const DELETE_STUDENT = gql`
      mutation deleteStudent($id: Float!) {
        deleteStudent(id: $id)
      }
    `
    return this.apollo.mutate({
      mutation: DELETE_STUDENT,
      variables: {
        id: id,
      },
    })
  }

  uploadExcelFile = (payload) => {
    return this.http.post<any>(
      `${baseConfig(process.env.NODE_ENV as string).restApiUrl}students/upload`,
      payload,
    )
  }
}
