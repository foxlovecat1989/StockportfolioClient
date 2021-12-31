import { formatDate } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationType } from '../../enum/notification-type.enum';
import { UserRole } from '../../enum/user-role';
import { FileUploadStatus } from '../../model/file-upload.status';
import { Trade } from '../../model/trade';
import { User } from '../../model/user';
import { AuthenticationService } from '../../service/authentication.service';
import { NotificationService } from '../../service/notification.service';
import { TradeService } from '../../service/trade.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent implements OnInit, OnDestroy {

  user!: User;
  recentTrades!: Array<Trade>;
  fileName!: string;
  userForm!: FormGroup;
  profileImage!: File;
  keysOfRole = Object.keys(UserRole);
  private subscriptions: Subscription[] = [];
  public fileStatus = new FileUploadStatus();
  imageUrl!: string;
  closeResult!: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private tradeService: TradeService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.checkAndSetUser();
    this.loadingRecentTrades();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  resetPassword(){

  }


  execute(){
    this.notificationService.sendNotification(NotificationType.INFO, `Proccessing...`);
    this.user.username = this.userForm.controls['username'].value;
    this.user.email = this.userForm.controls['email'].value;

    this.subscriptions.push(this.userService.updateUserNameOrEmail(this.user).subscribe(
      resposne => {
          this.authenticationService.addUserToLocalCache(this.user)
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Update user detials successfully`);
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName =  fileName;
    this.profileImage = profileImage;
  }

  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage!);
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.fileStatus.status = 'done';
        },
        () => this.authenticationService.addUserToLocalCache(this.user)
      )
    );
  }

  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total!);
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.notificationService.sendNotification(NotificationType.SUCCESS, `${event.body.firstName}\'s profile image updated successfully`);
          this.fileStatus.status = 'done';
          break;
        } else {
          this.notificationService.sendNotification(NotificationType.ERROR, `Unable to upload image. Please try again`);
          break;
        }
      default:
        `Finished all processes`;
    }
  }

  private checkAndSetUser() {
    const isLogin = this.authenticationService.checkUserLoggedIn();
    if (isLogin)
      this.user = this.authenticationService.getUserFromLocalCache();
  }

  private loadingRecentTrades() {
    this.subscriptions.push(this.tradeService.getRecentTrades(this.user.userNumber).subscribe(
      response => {
        this.recentTrades = response;
        this.notificationService.sendNotification(
              NotificationType.SUCCESS,
              `Succuess to get recent trades by ${this.user.userNumber}`);
      },
      (errorResponse: HttpErrorResponse) =>
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  private initForm() {
    this.userForm = this.formBuilder.group({
      userNumber: this.user.userNumber,
      username: this.user.username,
      email: this.user.email,
      joinDate: formatDate(this.user.joinDate, 'MMM-dd', 'en-Us'),
      lastLoginDateDisplay: formatDate(this.user.joinDate, 'MM-dd HH:mm', 'en-Us'),
      userRole: this.user.userRole.substring(5)
    });
  }
}