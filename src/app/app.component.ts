import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid'
import { State } from '@progress/kendo-data-query'

import { Product } from './model'

import { StudentService } from './services/student-api-service'
import { AddUpdateStudentRequest } from './types/add-student-request'
import { GenderType } from './types/gender-type'
import { AlertNotificationService } from './services/alert-notification-service'

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  gridView: GridDataResult
  pageSize = 10
  skip = 0
  formGroup: FormGroup
  genderItems: Gender[] = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
  ]
  public selectedStudent = null
  showConfirmDialog: boolean = false

  private editedRowIndex: number
  private students: any[] = []

  constructor(
    private studentService: StudentService,
    private alertService: AlertNotificationService,
  ) {}

  public ngOnInit(): void {
    // this.view = this.editService.pipe(
    //   map((data) => process(data, this.gridState)),
    // )
    // this.editService.read()

    // this.studentService.getSuburbs().subscribe((res: GridDataResult) => {
    //   console.log(res)
    //   this.view = res
    // })
    this.getStudents()
  }

  public getStudents() {
    this.studentService.fetchStudents().subscribe(
      (res: any) => {
        this.gridView = res?.data?.students
        this.students = res?.data?.students
        this.setPagination()
      },
      (error) => {
        console.log('failed to fetch students', error)
      },
    )
  }

  public onChange(event: any, dataItem: any) {
    console.log(event, dataItem)
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip
    this.setPagination()
  }

  public setPagination() {
    this.gridView = {
      data: this.students.slice(this.skip, this.skip + this.pageSize),
      total: this.students.length,
    }
  }

  public addHandler({ sender }) {
    this.selectedStudent = null
    this.closeEditor(sender)

    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      gender: new FormControl(''),
      address: new FormControl(''),
      mobile: new FormControl(''),
      dob: new FormControl(''),
    })
    sender.addRow(this.formGroup)
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.selectedStudent = dataItem
    this.closeEditor(sender)

    this.formGroup = new FormGroup({
      name: new FormControl(dataItem.name, Validators.required),
      gender: new FormControl(dataItem.gender),
      address: new FormControl(dataItem.address),
      mobile: new FormControl(dataItem.mobile),
      dob: new FormControl(dataItem.dob),
    })
    this.editedRowIndex = rowIndex
    sender.editRow(rowIndex, this.formGroup)
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex)
  }

  public saveHandler({ sender, rowIndex, formGroup }) {
    const student: AddUpdateStudentRequest = formGroup.value
    !this.selectedStudent
      ? this.createStudent(student, sender, rowIndex)
      : this.updateStudent(this.selectedStudent.id, student, sender, rowIndex)
  }

  private createStudent(student, sender, rowIndex) {
    this.studentService.addStudent(student).subscribe(
      (res: any) => {
        if (res.data?.addStudent?.id > 0) {
          this.getStudents()
          sender.closeRow(rowIndex)
          this.alertService.showNotification(
            'Student saved successfully!',
            { type: 'slide', duration: 400 },
            { style: 'success', icon: true },
          )
        }
      },
      (error) => {
        console.log('Failed to save student', error)
        this.alertService.showNotification(
          'Failed to save student!',
          { type: 'slide', duration: 400 },
          { style: 'error', icon: true },
        )
      },
    )
  }

  private updateStudent(id, student, sender, rowIndex) {
    const payload: AddUpdateStudentRequest = {
      name: 'kamal',
      gender: GenderType.Female,
      address: 'moratuwa',
      mobile: '075',
      dob: new Date('1999-08-19'),
    }
    this.studentService.updateStudent(id, payload).subscribe(
      (res: any) => {
        if (res.data?.updateStudent?.id > 0) {
          this.getStudents()
          sender.closeRow(rowIndex)
          this.alertService.showNotification(
            'Student updated successfully!',
            { type: 'slide', duration: 400 },
            { style: 'success', icon: true },
          )
        }
      },
      (error) => {
        console.log('Failed to update student', error)
        this.alertService.showNotification(
          'Failed to update student!',
          { type: 'slide', duration: 400 },
          { style: 'error', icon: true },
        )
      },
    )
  }

  public removeHandler({ dataItem }) {
    this.selectedStudent = dataItem
    this.showConfirmDialog = true
  }

  public closeDialog() {
    this.selectedStudent = null
    this.showConfirmDialog = false
  }

  public confirmRemove() {
    this.studentService.deleteStudent(this.selectedStudent.id).subscribe(
      (res: any) => {
        if (res.data?.deleteStudent) {
          this.showConfirmDialog = false
          this.getStudents()
          this.alertService.showNotification(
            'Student deleted successfully!',
            { type: 'slide', duration: 400 },
            { style: 'success', icon: true },
          )
        }
      },
      (error) => {
        this.showConfirmDialog = false
        console.log('Failed to delete student', error)
        this.alertService.showNotification(
          'Failed to delete student!',
          { type: 'slide', duration: 400 },
          { style: 'error', icon: true },
        )
      },
    )
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex)
    this.editedRowIndex = undefined
    this.formGroup = undefined
  }
}
