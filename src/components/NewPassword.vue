<template>
  <div class="reset-body">
    <nav class="uk-navbar uk-navbar-container uk-margin">
      <div class="uk-navbar-left">
        <router-link class="uk-navbar-item uk-logo" to="/">Shukran</router-link>
      </div>
    </nav>

    <div class="uk-container-expand" align="center">
      <div class="uk-card uk-card-default fit uk-box-shadow-large uk-padding reset-card">
        <div class="uk-card-header">
          <div class="uk-flex-middle">
            <div class="uk-width-expand" align="center">
              <h3 class="uk-card-title uk-margin-remove-bottom">Password Change</h3>
            </div>
          </div>
        </div>

        <div class="uk-card-body">
          <div class="uk-margin">
            <input
              class="uk-input uk-border-rounded uk-form"
              v-model="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div class="uk-margin" id="confirmEmailDiv">
            <div class="uk-inline">
              <a
                class="uk-form-icon uk-form-icon-flip"
                href="#!"
                v-bind:uk-icon="passwordIcon"
                @click="switchVisibility"
              ></a>
              <input
                class="uk-input uk-border-rounded uk-form uk-form-width-large"
                :type="passwordFieldType"
                v-model="newPassword"
                autocomplete="new-password"
                placeholder="New password"
              />
            </div>
          </div>
          <div class="uk-margin">
            <div class="uk-inline">
              <a
                class="uk-form-icon uk-form-icon-flip"
                href="#!"
                v-bind:uk-icon="passwordIcon"
                @click="switchVisibility"
              ></a>
              <input
                class="uk-input uk-border-rounded uk-form uk-form-width-large"
                :type="passwordFieldType"
                autocomplete="new-password"
                v-model="confirmNewPassword"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div class="uk-margin">
            <p>{{ issue }}</p>
            <button
              id="checkUsername"
              :disabled="newPassword !== confirmNewPassword || newPassword == ''"
              class="uk-button uk-border-rounded uk-button-default uk-width-1-1"
              @click="changePassword"
            >
              {{ reset }}
            </button>
          </div>
        </div>
        <div class="uk-card-footer" align="center">
          <router-link to="/accounts">Login</router-link> |
          <router-link to="/resetpassword">Reset Password</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
let md5 = require("md5");
export default {
  name: "NewPassword",
  data() {
    return {
      username: "",
      passwordIcon: "icon: unlock",
      email: "",
      fauxEmail: "",
      newPassword: "",
      confirmNewPassword: "",
      issue: "",
      reset: "Change",
      passwordFieldType: "password",
    };
  },
  methods: {
    changePassword() {
      document.getElementById("checkUsername").innerHTML = "<div uk-spinner></div>";
      axios
        .post(process.env.BASE_URL + "/api/changepassword/", {
          username: this.username.toLowerCase().trim(),
          email: this.email.trim(),
          token: this.$route.query.token,
          password: md5(this.newPassword),
        })
        .then(
          (res) => {
            switch (res.status) {
              case 200:
                document.getElementById("checkUsername").innerText = "Done.";
                this.issue = "Password changed.";
                setTimeout(() => {
                  sessionStorage.setItem("username", this.username.toLowerCase().trim());
                  sessionStorage.setItem("id", res.data._id);
                  sessionStorage.setItem("profile", JSON.stringify(res.data));
                  this.$router.push("/dash");
                }, 1500);
                break;

              default:
                break;
            }
          },
          (err) => {
            document.getElementById("checkUsername").innerText = "Change";
            switch (err.response.status) {
              case 403:
                this.issue = "Expired or used reset link."; // or is doesn't exist
                break;
              case 401:
                this.issue = "The Reset link is invalid. Make a new request.";
                break;

              default:
                break;
            }
          }
        )
        .catch((err) => {
          console.error("did we get here ?", err);
        });
    },
    switchVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
      this.passwordIcon =
        this.passwordIcon === "icon: lock" ? "icon: unlock" : "icon: lock";
    },
  },
  mounted() {
    this.username = decodeURI(this.$route.params.username);
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uk-button:disabled {
  background-color: #964754 !important;
}
.fit {
  width: 300px;
}
.uk-navbar,
.uk-navbar-item,
.lead {
  background: transparent !important;
  color: #ffffff !important;
}
.reset-body {
  background-image: linear-gradient(135deg, #d44d62 0%, #ff746c 100%);

  position: fixed;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  overflow: auto;
}
.reset-card {
  border-radius: 5px;
}
.uk-input {
  border-width: 2px;
}
.uk-button {
  background-color: #ff5976 !important;
  color: #fff6fa;
}

@media (min-width: 960px) {
  .fit {
    width: 370px;
  }
  .uk-navbar-left {
    margin-left: 50px;
  }
}
</style>
