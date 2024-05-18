import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from 'src/app/services/auth.service';
import {UserService} from 'src/app/services/user.service';

@Component({
  selector: 'e-login',
  templateUrl: './e-login.component.html',
  styleUrls: ['./e-login.component.scss']
})
export class ELoginComponent implements OnInit {
  authForm:FormGroup;
  showToast: boolean = false;
  titleToast:string = 'Prueba';
  messageToast:string = 'PruebamessageToast';
  positionToast:string='top-end';
  colorToast:string='top-end';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createAuthForm()
  }
  createAuthForm() {
    this.authForm = this.fb.group({
      email:new FormControl('test1@mail.com', [Validators.required, Validators.email]),
      pass:new FormControl('123456', Validators.required)
    })

  }
  setLogin() {
    if(this.authForm.valid) {
      this.authService.login(this.authForm.value).then((resp:any) => {
        if(resp) {
          const {ok, user, parking, token} = resp;
          if(ok == true) {
            this.showToast = true;
            this.titleToast = 'Correcto!';
            this.colorToast = 'success';
            this.messageToast = `Ingresó correctamente`
            this.userService.changeUser(user);
            const url = user.role == 'client' ? `client/${user.parking_id}/dashboard` : '/dashboard'
            // this.router.navigateByUrl(url)
            this.router.navigate([`./${url}`])
          }
        }
      }).catch(err => {
        this.showToast = true;
        this.titleToast = 'Error';
        this.colorToast = 'danger';
        this.messageToast = `Ocurrió un error al ingresar: ${err.message}`
        console.log('Error de credenciales', err)
      })
    }

  }

}
