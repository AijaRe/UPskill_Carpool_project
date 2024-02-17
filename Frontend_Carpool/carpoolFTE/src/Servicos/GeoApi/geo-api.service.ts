import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GeoApiService {
  private apiUrl = 'https://json.geoapi.pt/municipios/freguesias';

  constructor(private http: HttpClient) {}

  getMunicipiosFreguesias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
