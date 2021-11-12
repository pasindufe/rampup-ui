import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { StudentService } from './services/student-api-service'
import { GridModule } from '@progress/kendo-angular-grid'
import { of } from 'rxjs'
import { AlertNotificationService } from './services/alert-notification-service'
import { WebSocketService } from './services/web-socket.service'
import { Socket } from 'ngx-socket-io'

class MockMyService {}

describe('Component:App', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let alertService: AlertNotificationService
  let webSocketService = new WebSocketService(new Socket(null))
  let studentService: StudentService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        {
          provide: StudentService,
          useValue: {
            fetchStudents: () => of([{ id: 1, name: 'name' }]),
          },
        },
        {
          provide: AlertNotificationService,
          useValue: alertService,
        },
        {
          provide: WebSocketService,
          useValue: webSocketService,
        },
      ],
      imports: [GridModule],
    }).compileComponents()
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance

    studentService = TestBed.get(StudentService)
    // alertService = TestBed.get(AlertNotificationService)
    // webSocketService = TestBed.get(WebSocketService)

    fixture.detectChanges()
  })

  it('should load product detail', () => {
    spyOn(studentService, 'fetchStudents').and.callThrough()
    component.ngOnInit()
    fixture.detectChanges()
    expect(studentService.fetchStudents).toHaveBeenCalledWith()
    expect(component.students).toEqual([{ id: 1, name: 'name' }])
  })
})
