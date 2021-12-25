import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Classify } from 'src/app/model/classify';
import { Watchlist } from 'src/app/model/watchlist';
import { ClassifyService } from 'src/app/service/classify.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { WatchlistService } from 'src/app/service/watchlist.service';

@Component({
  selector: 'app-delete-classify-modal',
  templateUrl: './delete-classify-modal.component.html',
  styleUrls: ['./delete-classify-modal.component.css']
})
export class DeleteClassifyModalComponent implements OnInit {

  @Input('deleteClassify')
  deleteClassify!: Classify;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService,
    private reloadFormService: ReloadFormService,
    private classifyService: ClassifyService
    ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {

  }

  executeDelete(deleteClassify: Classify){
    this.subscriptions.push(this.classifyService.deleteClassify(deleteClassify.name).subscribe(
      response => {
        this.reloadFormService.reloadEvent.emit();
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success to delete ${deleteClassify.name}`);
        this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

}
