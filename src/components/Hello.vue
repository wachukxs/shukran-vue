<template hello-body>
    <div class="get-in">
       <nav class="uk-navbar uk-navbar-container uk-margin">
    <div class="uk-navbar-left">
     <router-link class="uk-navbar-item uk-padding-remove-left uk-logo" to="/">Shukran</router-link>
    </div>
    </nav>
    <div>
      
    
    
  



 
 

    <div class="uk-card uk-card-default uk-margin-bottom fit uk-margin-auto uk-width-1-2@m uk-box-shadow-large uk-padding signup-card">
     
     <!-- <div class="uk-card-header">
        <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-expand" >
              
                <h3 class="uk-card-title uk-margin-remove-bottom uk-text-center">Sign up</h3>
            </div>
        </div>
        
    </div> -->
    <ul class="uk-child-width-expand" uk-tab uk-switcher="connect: .login-signup;"><!-- maybe auto choose -->
                  <li><a href="#">Sign up</a></li>
                  <li class="uk-active"><a href="#">Login</a></li>
              </ul>

      <ul class="uk-switcher login-signup">
      <li>
         <div class="uk-card-body">
      <div class="uk-margin">
        <input v-on:keyup.enter="signup" class="uk-input uk-border-rounded uk-form" data-uk-tooltip title="" v-model="username" type="text" placeholder="Username">
        <span class="uk-text-meta">
          Basically your brand name. What name do your content consumers recognise you with, <span class="uk-text-emphasis">please no spaces</span>
        </span>
      </div>
      <div class="uk-margin">
         <input v-on:keyup.enter="signup" class="uk-input uk-border-rounded uk-form" v-model="fullname" type="text" placeholder="Fullname">
         <span class="uk-text-meta">
          KYC requires us to know this. No one else sees it so...
        </span>
      </div>
      <div class="uk-margin">
         <input v-on:keyup.enter="signup" class="uk-input uk-border-rounded uk-form" v-model="email" type="email" placeholder="Email">
        <span class="uk-text-meta">
          That email you open often
        </span>
      </div>
      <div class="uk-margin">
        <div class="uk-inline">
         <input v-on:keyup.enter="signup" class="uk-input uk-border-rounded uk-form-width-large" :type="signupPasswordFieldType" v-model="password" placeholder="Password">
         <a class="uk-form-icon uk-form-icon-flip" href="#!" v-bind:uk-icon="signupPasswordIcon" @click="switchSignupVisibility"></a>
        </div>
        <span class="uk-text-meta">
          A memorable secure password
        </span>
      </div>

      <div class="uk-margin">
          <p style="color: #ff5976;">{{issue}}</p>
        <button class="uk-button uk-border-rounded uk-button-default uk-width-1-1" @click="signup">{{signupbtn}}</button>
        
      </div>
      
    </div>

      </li>

      <li>
        <div class="uk-card-body">
      <div class="uk-margin">
        <input class="uk-input uk-border-rounded" name="username" v-on:keyup.enter="login" v-model="username" type="text" placeholder="Username">
        <span class="uk-text-meta">
          Your username, NOT email.
        </span>
      </div>
      <div class="uk-margin">
        <div class="uk-inline">
         <input v-on:keyup.enter="login" name="password" class="uk-input uk-border-rounded uk-form-width-large" v-model="password" :type="loginPasswordFieldType" placeholder="Password">
         <a class="uk-form-icon uk-form-icon-flip" href="#!" v-bind:uk-icon="loginPasswordIcon" @click="switchLoginVisibility"></a>
        </div>
      </div>

      <div class="uk-margin">
         <p style="color: #ff5976;">{{issue}}</p>
        <button class="uk-button uk-border-rounded uk-button-default uk-width-1-1" @click="login">{{loginbtn}}</button>
      </div>
    </div>
    <div class="uk-card-footer uk-text-center" >
        <router-link to="/resetpassword">Reset Password</router-link>
    </div>
      </li>
    </ul>

   

    </div>

    
      

  
    </div>
  </div>
</template>

<script>
import axios from 'axios'
var md5 = require('md5')
export default {
  name: 'Hello',
  data () {
    return {
      loginbutton: true,
      username:'',
      password:'',
      loginbtn:'Login',
      fullname: '',
      signupbtn: 'Signup',
      issue: '',
      email: '',
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      loginPasswordFieldType: 'password',
      signupPasswordFieldType: 'password',
      loginPasswordIcon: "icon: unlock",
      signupPasswordIcon: "icon: unlock",
    }
  },
  methods: {
    login() {
      if (this.username == '' || this.password == '') {
        this.issue = 'Please fill all fields.'
      } else {
        this.issue = ''
        this.loginbtn = 'loading...';
        axios.post(process.env.BASE_URL + '/api/login/', {
            username: this.username.toLowerCase().trim(),
            password: md5(this.password)
        }).then(res => {
          if (res.data.length == 0) {
            this.loginbtn = 'Login'
            this.issue = 'Username or password incorrect...'
          } else {
            sessionStorage.setItem('username', this.username.toLowerCase().trim())
            sessionStorage.setItem('id', res.data[0]._id)
            sessionStorage.setItem('profile', JSON.stringify(res.data[0]))
            this.$router.push('/dash')
          }
        }).catch( err => {
          console.log(err)
          this.loginbtn = 'Login'
          this.issue = 'An error occured. Please try again.'
      })
      }
    },
    switchSignupVisibility() {
      this.signupPasswordIcon = this.signupPasswordIcon === "icon: lock" ? "icon: unlock" : "icon: lock";
      this.signupPasswordFieldType = this.signupPasswordFieldType === 'password' ? 'text' : 'password';
    },
    switchLoginVisibility() {
      this.loginPasswordIcon = this.loginPasswordIcon === "icon: lock" ? "icon: unlock" : "icon: lock";
      this.loginPasswordFieldType = this.loginPasswordFieldType === 'password' ? 'text' : 'password';
    },
    signup() {
      if (this.username == '' || this.fullname == '' || this.email == '' || this.password == '') {
        this.issue = 'Please fill all fields.'
      } else if(!this.reg.test(this.email)){
        this.issue = "Enter correct email please."
      } else {
        this.signupbtn = 'loading...'
        axios.post(process.env.BASE_URL + '/api/creatorprofile/', {
           username: this.username.toLowerCase().trim()
        }).then(res => {
          if (res.data.length >= 1) {
              // console.log('username taken')
              this.issue = 'Username already taken!'
              this.signupbtn = 'Signup'
          } else {
            axios.post(process.env.BASE_URL + '/api/createaccount/', {
              username: this.username.toLowerCase().trim(),
              fullname: this.fullname,
              email: this.email,
              password: md5(this.password)
            }).then(res => {
              this.signupbtn = 'Signup'
              if (res.data.message == "User's email exist") {
                // console.log('cannot register')
                this.issue = "Creator's email exist!"
              } else {
                console.log('registered')
                sessionStorage.setItem('username', res.data.username)
                sessionStorage.setItem('id', res.data._id)
                sessionStorage.setItem('profile', JSON.stringify(res.data))

                analytics.identify(res.data._id , { email: res.data.email });
                analytics.track('Account Created', { authentication: 'Signup' })

                this.$router.push('/profile')
              }
            }).catch( error => {
              // console.error(error)
              this.signupbtn = 'Sign up, again'
            })
          }
        }).catch( err => {
          console.error(err)
          this.signupbtn = 'Sign up, again'
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uk-text-meta {
  font-size: 0.8rem;
  line-height: 0.2;
}
.uk-navbar, .uk-navbar-item, .lead {
  background: transparent !important;
  color: #ffffff !important;
}
.uk-card, .uk-card-title {
  color: #2f1a35 !important;
}
.uk-button {
  background-color: #ff5976 !important;
  color: #fff6fa;
}

.login-card {
  border-radius: 5px;
}
.signup-card {
  border-radius: 5px;
}
.fit {
  width: 280px;
}
@media (max-width:960px) {
  .uk-padding {
    padding: 10px;
  }
  .uk-navbar-left {
    margin-left: 30px;
  }
}
.get-in {
  background-image: linear-gradient(135deg, #d44d62 0%, #ff746c 100%);
  position: fixed;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  overflow: auto;
}


@media (min-width:960px) {
  .fit {
    width: 370px;
  }
  .uk-navbar-left {
    margin-left: 50px;
  }
}

.uk-input {
  border-width: 2px;
}
</style>