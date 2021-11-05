import { Injectable } from '@angular/core'
import { NotificationService } from '@progress/kendo-angular-notification'

@Injectable()
export class AlertNotificationService {
  constructor(private notificationService: NotificationService) {}

  showNotification = (content, animation, type) => {
    this.notificationService.show({
      content: content,
      cssClass: 'button-notification',
      animation: animation,
      position: { horizontal: 'center', vertical: 'top' },
      type: type,
      closable: true,
    })
  }
}
