import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: HttpClient) {}

  createOrganizationAndAdmin(createOrganizationDto) {
    return this.http.post(
      `${environment.apiUrl}/user/assignManager`,
      createOrganizationDto
    );
  }

  isAttributeValid(payload: {
    label: string;
    value: string;
  }) {
    return this.http.post(
      `${environment.apiUrl}/organization/isValid`,
      payload
    );
  }
}
