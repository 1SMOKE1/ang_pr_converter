import { Component, OnInit } from '@angular/core';

import { valuteI } from 'src/app/interfaces/valuteI';
import { ValutService } from 'src/app/services/valute.service';

@Component({
  selector: 'avc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  valute: valuteI[] = [];

  constructor(private valuteService: ValutService) {

   }

  ngOnInit(): void {
    this.valuteService.getValuteData().subscribe((data: valuteI[]) => this.valute = data)
  }

}
