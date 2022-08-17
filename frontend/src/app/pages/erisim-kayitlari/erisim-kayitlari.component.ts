import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-erisim-kayitlari',
  templateUrl: './erisim-kayitlari.component.html',
  styleUrls: ['./erisim-kayitlari.component.css']
})
export class ErisimKayitlariComponent implements OnInit {

  constructor(private service: ApiService) {
  }

  erisim_kayitlari: any;

  successMsg: any
  dataExist: boolean

  ngOnInit(): void {
    this.service.getErisimKayitlari().subscribe((res) => {
      this.erisim_kayitlari = res.data;

      this.dataExist = this.erisim_kayitlari == undefined
    })
  }

  deleteErisimKayit(id: any) {
    this.service.deleteErisimKayit(id).subscribe(res => {
      this.service.getErisimKayitlari().subscribe(res => {
        this.erisim_kayitlari = res.data;
        this.successMsg = "Kayıt Başarıyla Silindi";
      })
    })

    this.successMsg = "";
  }

  searchForm = new FormGroup({
    "searchTerm": new FormControl(""),
    "filter": new FormControl("")
  })

  searchErisimKayit() {
    this.service.searchErisimKayit(this.searchForm.value).subscribe(res => {
      this.erisim_kayitlari = res.data
    })
  }

}
