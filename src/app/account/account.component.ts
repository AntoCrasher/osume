import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  code: string | null = null;

  register_login() {
    window.open('https://osu.ppy.sh/oauth/authorize?client_id=33395&response_type=code&redirect_uri=http://localhost:4200', "_self");
  }

  ngOnInit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let code = urlParams.get('code');
    if (code != null) {
      this.code = code;

      let url = 'http://localhost:80/v1/account/register';
      let headers = {
        'Accept': 'application/json'
      };

      this.http.post(url, { 'code': code }, { headers }).subscribe((ret: any) => {
        console.log(ret);
        window.open(ret['redirect'], '_self');
      });
    }
  }

  constructor(private http: HttpClient) {}
}