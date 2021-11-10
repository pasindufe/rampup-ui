import { Injectable } from '@angular/core'
import { NotificationService } from '@progress/kendo-angular-notification'

@Injectable()
export class AlertNotificationService {
  constructor(private notificationService: NotificationService) {}

  showNotification = (
    content,
    animation,
    type,
    position: any = { horizontal: 'center', vertical: 'top' },
    hideAfter = 3000,
  ) => {
    this.notificationService.show({
      content: content,
      cssClass: 'button-notification',
      animation: animation,
      position: position,
      type: type,
      hideAfter: hideAfter,
    })
  }
}
