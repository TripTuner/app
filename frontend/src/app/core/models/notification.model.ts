export interface NotificationModel {
	id?: string;
	message: string;
	timeOut: number;
	callback?: () => {};
}
