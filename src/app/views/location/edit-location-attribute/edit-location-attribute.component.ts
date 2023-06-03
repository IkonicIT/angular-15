import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-location-attribute',
  templateUrl: './edit-location-attribute.component.html',
  styleUrls: ['./edit-location-attribute.component.scss'],
})
export class EditLocationAttributeComponent implements OnInit {
  model: any = {};
  index: any;
  statuses: any;
  currentRole: any;
  highestRank: any;
  dismissible = true;
  constructor() {}

  ngOnInit() {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }

  updateLocationAttribute() {}
}
