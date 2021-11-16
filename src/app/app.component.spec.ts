import { ComponentFixture, inject, TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { StudentService } from './services/student-api-service'
import { GridModule } from '@progress/kendo-angular-grid'
import { Observable, Observer, of } from 'rxjs'
import { AlertNotificationService } from './services/alert-notification-service'
import { WebSocketService } from './services/web-socket.service'
import { Socket } from 'ngx-socket-io'
import { NotificationService } from '@progress/kendo-angular-notification'

describe('Component:App', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let alertService: AlertNotificationService
  let webSocketIOService: WebSocketService
  let studentService: StudentService
  let testBedStudentService: StudentService

  let notificationService: NotificationService
  let testInjectableMock: AlertNotificationService = new AlertNotificationService(
    notificationService,
  )

  let socket: Socket
  let testInjectableMock1: WebSocketService = new WebSocketService(socket)

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
          useValue: testInjectableMock,
        },
        {
          provide: WebSocketService,
          useValue: testInjectableMock1,
        },
      ],

      imports: [GridModule],
    }).compileComponents()
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance

    studentService = fixture.debugElement.injector.get(StudentService)
    alertService = fixture.debugElement.injector.get(AlertNotificationService)
    webSocketIOService = fixture.debugElement.injector.get(WebSocketService)

    fixture.detectChanges()
  })

  it('should load component', () => {
    spyOn(studentService, 'fetchStudents').and.callThrough()
    component.ngOnInit()
    fixture.detectChanges()
    expect(studentService.fetchStudents).toHaveBeenCalledWith()
    expect(component.students).toEqual([{ id: 1, name: 'name' }])
  })
})
