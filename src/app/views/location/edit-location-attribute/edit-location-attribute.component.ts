import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-location-attribute',
  templateUrl: './edit-location-attribute.component.html',
  styleUrls: ['./edit-location-attribute.component.scss'],
})
export class EditLocationAttributeComponent implements OnInit {
  model: any = {};
  index = 0;
  statuses: any;
  currentRole: string | null = null;
  highestRank: string | null = null;
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }
  dismissible = true;

  constructor() {}

  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');    
  }

  updateLocationAttribute(): void {
  }
}
