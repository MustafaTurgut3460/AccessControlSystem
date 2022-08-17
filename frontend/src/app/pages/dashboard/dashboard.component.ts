import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  counts = {
    countAccess: 0,
    countAccessPoint: 0,
    countCard: 0
  }

  accessData = {
    kart_sahibi: "",
    kart_id: "",
    zaman: "",
    kapi_mac: "",
    kapi_ismi: "",
    durum: false,
    mesaj: ""
  }



  gosterilenPanel = 0; // 1->yeşil  2->sarı  3->kırmızı

  text: string

  constructor(private service: ApiService, private socketSrv: SocketService) {
  }

  ngOnInit(): void {
    this.service.getDashboard().subscribe((res) => {
      this.counts = res.data;
    })

    this.service.getDashboard().subscribe((res) => {
      this.counts = res.data;
    })

    this.socketSrv.listen("new_access").subscribe((res: any) => {
      this.accessData = res;

      if (res.mesaj != "") {
        // mesaj bos değil ise bir sıkıntı var kayıt yok
        this.gosterilenPanel = 2;
        if (res.mesaj == "kart") {
          // kart kayitli değil
          this.accessData.mesaj = "Lütfen Kartınızı Sisteme Kayıt Ediniz."
        }
        else if(res.mesaj == "kapi") {
          // kapi kayitli değil
          this.accessData.mesaj = "Lütfen Kapıyı Sisteme Kayıt Ediniz."
        }
      }
      else {
        // mesaj kısmı boş yani bir sıkıntı yok izin verilip verilmedigi kontrol edilecek
        if (this.accessData.durum) {
          // izin verilmi
          console.log(this.accessData.durum)
          this.gosterilenPanel = 1;
          this.service.getDashboard().subscribe((res:any) => {
            this.counts = res.data;
          })
        }
        else {
          // izin verilmemiş
          this.gosterilenPanel = 3;
        }
      }
    })
  }

}
