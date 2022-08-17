import { Component, OnInit } from '@angular/core';
import { Chart } from "chart.js";
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-istatistikler',
  templateUrl: './istatistikler.component.html',
  styleUrls: ['./istatistikler.component.css']
})
export class IstatistiklerComponent implements OnInit {

  chart: any

  constructor(private srv: ApiService) {
  }

  ngOnInit() {

    this.srv.getIstatistikler().subscribe(res => {
      /**
       * params:
       * res.data : arr -> [izin_verilen_veri:array, izin_verilmeyen_veri:array]
       */
      this.chart.data.datasets[0].data = res.data[0];
      this.chart.data.datasets[1].data = res.data[1];
      this.chart.update();
    })

      this.chart = new Chart('canvas', {
        type: 'bar',
        options: {
          responsive: true
        },
        data: {
          labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
          datasets: [
            {
              type: 'bar',
              label: "İzin Verildi",
              data: [10, 3, 6, 11, 38, 5, 6],
              backgroundColor: '#008000'
            },
            {
              type: 'bar',
              label: "İzin Verilmedi",
              data: [10, 3, 6, 11, 38, 5, 6],
              backgroundColor: '#FF0000'
            }
          ]
        }
      });

  }

}
