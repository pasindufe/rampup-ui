import { Injectable } from '@angular/core'
import { baseConfig } from './config'
import { HttpClient } from '@angular/common/http'
import { Apollo, gql } from 'apollo-angular'
import { AddUpdateStudentRequest } from '../types/add-student-request'

@Injectable()
export class StudentService {
  constructor(private apollo: Apollo, private http: HttpClient) {}

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
            mobile
            gender
          }
        }
      `,
    }).valueChanges
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

  updateStudent = (id: number, payload: AddUpdateStudentRequest) => {
    console.log(id, payload)
    const UPDATE_STUDENT = gql`
      mutation updateStudent($student: AddUpdateStudentRequest!, $id: Float!) {
        updateStudent(student: $student, id: $id) {
          id
          name
        }
      }
    `
    return this.apollo.mutate({
      mutation: UPDATE_STUDENT,
      variables: {
        student: payload,
        id: id,
      },
    })
  }

  deleteStudent = (id: number) => {
    console.log(id)
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
      `${baseConfig(process.env.NODE_ENV as string).apiUrl}students/upload`,
      payload,
    )
  }
}
