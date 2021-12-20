import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {

  isExpanded = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleExpanded(){
    this.isExpanded = !this.isExpanded;
  }

}