import { Component, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { NotificationModel } from "../../models/notification.model";
import { NotificationsService } from "../../services/notifications.service";

@Component({
	selector: "Notifications",
	imports: [],
	styleUrl: "./notifications.component.css",
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="notifications-container" #container>
			<!-- 			<div class="notification"> -->
			<!-- 				<p>Я крутое уведомление</p> -->
			<!-- 				<div class="callback-action"> -->
			<!-- 					<p>Отмена</p> -->
			<!-- 				</div> -->
			<!-- 			</div> -->
		</div>
	`,
})
export class NotificationsComponent {
	@ViewChild("container") container!: ElementRef<HTMLDivElement>;

	constructor(
		private notificationService: NotificationsService,
	) {
		this.notificationService.queue.subscribe(queue => {
			if (queue.length === 0) return;
			this.addNotification(queue[queue.length - 1]);
			this.notificationService.popBack();
		});
	}

	addNotification(notification: NotificationModel) {
		const container = document.createElement("div");

		const message = document.createElement("p");
		message.innerText = notification.message;
		container.appendChild(message);

		const cancel = document.createElement("p");
		cancel.innerText = "Отмена";
		cancel.onclick = this.clickHandler.bind({}, this, notification);

		container.appendChild(cancel);

		container.setAttribute("notification-id", notification.id!);

		this.container.nativeElement.appendChild(container);

		setTimeout(() => {
			container.style.transform = "translateX(0%)";
			container.style.opacity = "1";
		});

		setTimeout(() => this.removeNotification(notification), notification.timeOut);
	}

	async removeNotification(notification: NotificationModel) {
		const container = this.container.nativeElement;
		for (let i = 0; i < container.children.length; i++) {
			const child = container.children.item(i)!;
			if (child.getAttribute("notification-id") === notification.id) {
				//@ts-ignore
				child.style.transform = "translateX(100%)";
				//@ts-ignore
				child.style.opacity = "0";
				setTimeout(() => {
					container.removeChild(child);
				}, 300);
			}
		}
	}

	clickHandler(that: any, notification: NotificationModel) {
		that.removeNotification(notification).then(() => {
			if (notification.callback !== undefined)
				notification.callback();
		});
	}
}
