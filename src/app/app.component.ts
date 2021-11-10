import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'

import {
  DataBindingDirective,
  GridDataResult,
} from '@progress/kendo-angular-grid'

import { StudentService } from './services/student-api-service'
import { AddUpdateStudentRequest } from './types/add-student-request'
import { GenderType } from './types/gender-type'
import { AlertNotificationService } from './services/alert-notification-service'

import * as moment from 'moment'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { State, process } from '@progress/kendo-data-query'
import { WebSocketService } from './services/web-socket.service'
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  formGroup: FormGroup
  genderItems: Gender[] = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
  ]
  public selectedStudent = null
  showConfirmDialog: boolean = false

  private editedRowIndex: number
  private inputFile: File = null
  public isValidFile = true
  public isLoading = false

  public view: Observable<GridDataResult>
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 50,
  }

  constructor(
    private studentService: StudentService,
    private alertService: AlertNotificationService,
    private webSocketService: WebSocketService,
  ) {}

  @ViewChild('fileInputRef', { static: false })
  fileInputRef: ElementRef

  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective

  private gridData: any[] = []

  public ngOnInit(): void {
    this.view = this.studentService.pipe(
      map((data) => process(data, this.gridState)),
    )
    this.studentService.fetch()
    this.getWebSocketResponse()
  }

  private getWebSocketResponse() {
    this.webSocketService.receiveResponse().subscribe((res: any) => {
      res.succeed
        ? this.alertService.showNotification(
            res.message,
            { type: 'slide', duration: 400 },
            { style: 'success', icon: true },
            { horizontal: 'right', vertical: 'top' },
          )
        : this.alertService.showNotification(
            res.message,
            { type: 'slide', duration: 400 },
            { style: 'error', icon: true },
            { horizontal: 'right', vertical: 'top' },
          )
      setInterval(() => location.reload(), 3000)
    })
  }

  public onStateChange(state: State) {
    this.gridState = state
    this.studentService.fetch()
  }

  public addHandler({ sender }) {
    this.selectedStudent = null
    this.closeEditor(sender)

    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      gender: new FormControl(GenderType.Male),
      address: new FormControl(''),
      mobile: new FormControl(''),
      dob: new FormControl('', Validators.required),
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
      dob: new FormControl(new Date(dataItem.dob)),
    })
    this.editedRowIndex = rowIndex
    sender.editRow(rowIndex, this.formGroup)
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex)
  }

  public getGender(id: number): any {
    return this.genderItems.find((x) => x.id === id)
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
          sender.closeRow(rowIndex)
          this.alertService.showNotification(
            'Student saved successfully!',
            { type: 'slide', duration: 400 },
            { style: 'success', icon: true },
          )
        }
      },
      (error) => {
        this.alertService.showNotification(
          'Failed to save student!',
          { type: 'slide', duration: 400 },
          { style: 'error', icon: true },
        )
      },
    )
  }

  private async updateStudent(id, student, sender, rowIndex) {
    // await this.studentService.update(id, student)
    // sender.closeRow(rowIndex)
    this.studentService.updateStudent(id, student).subscribe(
      (res: any) => {
        if (res.data?.updateStudent?.id > 0) {
          sender.closeRow(rowIndex)
          this.alertService.showNotification(
            'Student updated successfully!',
            { type: 'slide', duration: 400 },
            { style: 'success', icon: true },
          )
        }
      },
      (error) => {
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
          this.alertService.showNotification(
            'Student deleted successfully!',
            { type: 'slide', duration: 400 },
            { style: 'success', icon: true },
          )
        }
      },
      (error) => {
        this.showConfirmDialog = false
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

  public selectFile(event) {
    const files = event.target.files
    if (files.length > 0) {
      this.inputFile = event.target.files[0]
      const data = this.inputFile.name.split('.')
      const ext = data[data.length - 1]
      this.isValidFile = ext == 'xls' || ext == 'xlsx'
    }
  }

  public uploadFile() {
    if (this.inputFile) {
      this.isLoading = true
      const formData = new FormData()
      formData.append('file', this.inputFile)
      this.studentService.uploadExcelFile(formData).subscribe(
        (res: any) => {
          this.isLoading = false
          if (res && res.completed) {
            this.alertService.showNotification(
              'Student file uploaded successfully!',
              { type: 'slide', duration: 400 },
              { style: 'success', icon: true },
            )
            this.fileInputRef.nativeElement.value = null
            this.inputFile = null
          } else {
            this.alertService.showNotification(
              'Failed to upload file!',
              { type: 'slide', duration: 400 },
              { style: 'error', icon: true },
            )
          }
        },
        (error) => {
          this.isLoading = false
          this.alertService.showNotification(
            'Failed to upload file!',
            { type: 'slide', duration: 400 },
            { style: 'error', icon: true },
          )
        },
      )
    }
  }
}
