import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Classify } from 'src/app/model/classify';
import { ClassifyService } from 'src/app/service/classify.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadService } from 'src/app/service/reload.service';

@Component({
  selector: 'app-add-classify-modal',
  templateUrl: './add-classify-modal.component.html',
  styleUrls: ['./add-classify-modal.component.css']
})
export class AddClassifyModalComponent implements OnInit, OnDestroy {

  classify = new Classify();
  classifyForm!: FormGroup;

  closeResult!: string;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private classifyService: ClassifyService,
    private notificationService: NotificationService,
    private reloadService: ReloadService
    ) {

    }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initForm(): void {
    this.classifyForm = this.formBuilder.group({
      name: ''
    });
  }

  execute(): void{
    this.classify.name = this.classifyForm.controls['name'].value;

    this.subscriptions.push(this.classifyService.createClassify(this.classify).subscribe(
      resposne => {
          this.reloadService.reloadEvent.emit();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Success to add classify`);
          this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

}
