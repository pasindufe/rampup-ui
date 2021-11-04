import { Observable } from 'rxjs'
import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid'
import { State } from '@progress/kendo-data-query'

import { Product } from './model'
import { EditService } from './edit.service'

import { map } from 'rxjs/operators'
import { StudentApiService } from './services/student-api-service'
import { Apollo, gql } from 'apollo-angular'

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public gridView: GridDataResult
  // public gridState: State = {
  //   sort: [],
  //   skip: 0,
  //   take: 10,
  // }
  public pageSize = 10
  public skip = 0
  public formGroup: FormGroup

  private editService: EditService
  private editedRowIndex: number
  private students: any[] = []

  constructor(
    @Inject(EditService) editServiceFactory: any,
    private studentApiService: StudentApiService,
    private apollo: Apollo,
  ) {
    this.editService = editServiceFactory()
  }

  public ngOnInit(): void {
    // this.view = this.editService.pipe(
    //   map((data) => process(data, this.gridState)),
    // )
    // this.editService.read()

    // this.studentApiService.getSuburbs().subscribe((res: GridDataResult) => {
    //   console.log(res)
    //   this.view = res
    // })
    this.getStudents()
  }

  public getStudents() {
    this.studentApiService.fetchStudents().subscribe((res: any) => {
      console.log(res)
      this.gridView = res?.data?.students
      this.students = res?.data?.students
      this.setPagination()
    })
  }

  public onStateChange(state: State) {
    //this.gridState = state

    this.editService.read()
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
    this.closeEditor(sender)

    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      gender: new FormControl(''),
      address: new FormControl(''),
      mobile: new FormControl(''),
      dob: new FormControl(''),
    })

    // this.formGroup = new FormGroup({
    //   ProductID: new FormControl(),
    //   ProductName: new FormControl('', Validators.required),
    //   UnitPrice: new FormControl(0),
    //   UnitsInStock: new FormControl(
    //     '',
    //     Validators.compose([
    //       Validators.required,
    //       Validators.pattern('^[0-9]{1,3}'),
    //     ]),
    //   ),
    //   Discontinued: new FormControl(false),
    // })

    sender.addRow(this.formGroup)
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender)

    // this.formGroup = new FormGroup({
    //   ProductID: new FormControl(dataItem.ProductID),
    //   ProductName: new FormControl(dataItem.ProductName, Validators.required),
    //   UnitPrice: new FormControl(dataItem.UnitPrice),
    //   UnitsInStock: new FormControl(
    //     dataItem.UnitsInStock,
    //     Validators.compose([
    //       Validators.required,
    //       Validators.pattern('^[0-9]{1,3}'),
    //     ]),
    //   ),
    //   Discontinued: new FormControl(dataItem.Discontinued),
    // })

    this.formGroup = new FormGroup({
      name: new FormControl(dataItem.name, Validators.required),
      gender: new FormControl(dataItem.gender),
      address: new FormControl(dataItem.address),
      mobile: new FormControl(dataItem.mobile),
      dob: new FormControl(dataItem.dob),
      age: new FormControl(dataItem.age),
    })

    this.editedRowIndex = rowIndex

    sender.editRow(rowIndex, this.formGroup)
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex)
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    const product: Product = formGroup.value

    this.editService.save(product, isNew)

    sender.closeRow(rowIndex)
  }

  public removeHandler({ dataItem }) {
    this.editService.remove(dataItem)
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex)
    this.editedRowIndex = undefined
    this.formGroup = undefined
  }
}
