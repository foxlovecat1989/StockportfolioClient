import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Classify } from 'src/app/model/classify';
import { Tstock } from 'src/app/model/tstock';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ClassifyService } from 'src/app/service/classify.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadService } from 'src/app/service/reload.service';
import { StockService } from 'src/app/service/stock.service';
import { AddStockModalComponent } from './add-stock-modal/add-stock-modal.component';
import { ViewStockModalComponent } from './view-stock-modal/view-stock-modal.component';

@Component({
  selector: 'app-manage-stock',
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.css']
})
export class ManageStockComponent implements OnInit, OnDestroy {
  user!: User;
  stocks!: Array<Tstock>;
  selectedStock!: Tstock;
  classifies!: Array<Classify>;
  closeResult!: string;
  modalOptions: NgbModalOptions;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private stockService: StockService,
    private modalService: NgbModal,
    private classifyService: ClassifyService,
    private reloadService: ReloadService
  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  }

  ngOnInit(): void {
    this.listenToReloadEvent();
    this.checkAndSetUser();
    this.loadingData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  add(): void{
    this.openAdd();
  }

  view(stock: Tstock): void{
    this.selectedStock = stock;
    this.openView();
  }

  searchStocks(searchTerm: string): void {
    const results = new Array<Tstock>();
    for (const stock of this.stockService.getStocksFromLocalCache()!) {
      if (
        stock.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        stock.symbol.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        ){
          results.push(stock);
        }
    this.stocks = results;
    if (results.length === 0 || !searchTerm)
      this.stocks = this.stockService.getStocksFromLocalCache()!;
     }
  }

  private loadingData(): void{
    this.subscriptions.push(this.classifyService.getClassifies().subscribe(next => this.classifies = next));
    this.subscriptions.push(this.stockService.getStocks().subscribe(
      (response: Array<Tstock>) => {
        this.stocks = response;
        this.stockService.addStocksToLocalCache(response);
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to load stocks');
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  private checkAndSetUser(): void {
    const isLogin = this.authService.isUserLoggedIn();
    if (isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  private openView(): void {
    const modalRef = this.modalService.open(ViewStockModalComponent);
    modalRef.componentInstance.selectedStock = this.selectedStock;
    modalRef.componentInstance.classifies = this.classifies;
  }

  private openAdd(): void {
    const modalRef = this.modalService.open(AddStockModalComponent);
    modalRef.componentInstance.classifies = this.classifies;
  }

  private listenToReloadEvent(): void {
    this.subscriptions.push(this.reloadService.reloadEvent.subscribe(
      response => this.loadingData()
    ));
  }

}
