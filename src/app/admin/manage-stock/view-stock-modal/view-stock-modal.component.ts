import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Classify } from 'src/app/model/classify';
import { Tstock } from 'src/app/model/tstock';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadService } from 'src/app/service/reload.service';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-view-stock-modal',
  templateUrl: './view-stock-modal.component.html',
  styleUrls: ['./view-stock-modal.component.css']
})
export class ViewStockModalComponent implements OnInit, OnDestroy {

  @Input('selectedStock')
  selectedStock!: Tstock;
  @Input('classifies')
  classifies!: Array<Classify>;
  stockForm!: FormGroup;
  closeResult!: string;
  private subscriptions: Subscription[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private stockService: StockService,
    private notificationService: NotificationService,
    private reloadService: ReloadService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  execute(): void{
    this.selectedStock.name = this.stockForm.controls['name'].value;
    this.selectedStock.classify = this.stockForm.controls['classify'].value;
    this.subscriptions.push(this.stockService.updateStock(this.selectedStock).subscribe(
      resposne => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Update stock detials successfully`);
          this.reloadService.reloadEvent.emit();
          this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

  private initForm(): void {
    this.stockForm = this.formBuilder.group({
      id: this.selectedStock.id,
      name: this.selectedStock.name,
      symbol: this.selectedStock.symbol,
      classify: this.selectedStock.classify
    });
  }
}
