import { Component, OnInit } from '@angular/core';
import { LocationAttributeService } from "../../../services/location-attribute.service";

@Component({
  selector: 'app-add-location-attribute',
  templateUrl: './add-location-attribute.component.html',
  styleUrls: ['./add-location-attribute.component.scss']
})
export class AddLocationAttributeComponent implements OnInit {

  model: any = {};
  index: number = 0;
  statuses: any;
  dismissible = true;
  constructor(private locationAttributeService: LocationAttributeService) { }

  ngOnInit() {
  }

  saveLocationAttribute() {
    window.scroll(0, 0);
  }

}
