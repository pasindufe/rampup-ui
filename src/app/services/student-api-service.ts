import { Injectable } from '@angular/core'
import { baseConfig } from './config'
import { HttpClient } from '@angular/common/http'
import { Apollo, gql } from 'apollo-angular'
import { AddUpdateStudentRequest } from '../types/add-student-request'
import { BehaviorSubject, Observable } from 'rxjs'
import { tap, map } from 'rxjs/operators'

@Injectable()
export class StudentService extends BehaviorSubject<any[]> {
  constructor(private apollo: Apollo, private http: HttpClient) {
    super([])
  }

  private data: any[] = []

  public fetch() {
    if (this.data.length) {
      return super.next(this.data)
    }
    this.fetchStudents()
      .pipe(
        tap((res: any) => {
          this.data = res.data?.students
        }),
      )
      .subscribe((res: any) => {
        super.next(res.data?.students)
      })
  }

  private reset() {
    this.data = []
  }

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

  public update(id: number, data: any) {
    this.reset()

    this.updateStudent(id, data).subscribe(
      () => this.fetch(),
      () => this.fetch(),
    )
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
