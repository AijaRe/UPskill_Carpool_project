import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VerOfertasBoleiasService {
  private carpoolUrl: string = environment.carpoolUrl;

  constructor(private verOfertasBoleiaService: HttpClient) {}

  getOfertasBoleia(
    partidaMunicipio: string,
    destinoMunicipio: string,
    data: string
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('partidaMunicipio', partidaMunicipio)
      .set('destinoMunicipio', destinoMunicipio)
      .set('data', data);

    const options = { params: params };
    return this.verOfertasBoleiaService.get<any[]>(
      `${this.carpoolUrl}/ofertaBoleia/local`,
      options
    );
  }

  getTodasOfertas(): Observable<any> {
    return this.verOfertasBoleiaService.get<any[]>(
      `${this.carpoolUrl}/ofertaBoleia/todas`
    );
  }
}
