<template>
  <div class="uk-container-expand">
  <top-side-header></top-side-header>

    <div id="offcanvas-usage" uk-offcanvas>
      <div class="uk-offcanvas-bar">
        <button class="uk-offcanvas-close" type="button" uk-close></button>
        <h3>Shukran</h3>
        <div
          ref="file"
          class="image-background uk-height-small uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light"
          v-lazy:background-image="{
            src: `https://drive.google.com/uc?export=view&id=${profiles[0].picture_id}`,
            loading: '../assets/loading.gif',
          }"
          uk-img
        >
          <div id="add-image" uk-form-custom="target: true">
            <input type="file" @change="onFileChanged" />
            <span uk-icon="icon: plus; ratio: 2"></span>
          </div>
        </div>
        <ul class="uk-list uk-list-divider">
          <li>
            <router-link to="/dash">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/subscribers">Shuclans</router-link>
          </li>
          <li id="get-tipped" href="#modal-center" uk-toggle>Get tipped</li>

          <div id="modal-center" class="uk-flex-top" uk-modal>
            <!-- https://uidesigndaily.com/posts/sketch-modal-ui-design-pop-up-day-1244 -->
            <div
              class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-auto tip-modal"
              uk-overflow-auto
            >
              <button class="uk-modal-close-default" type="button" uk-close></button>
              <h2 class="uk-modal-title">🎉</h2>
              <p class="show uk-text-lead">
                Hey {{ username }}, share the link below to get tipped.
              </p>
              <router-link class="uk-text-break" :to="'/cr/' + username">{{
                url
              }}</router-link>
              <p class="uk-text-meta">
                <span class="uk-text-bolder">TL;DR</span> Share link with your audience
                <textarea
                  name=""
                  class="uk-textarea uk-form-blank"
                  id="shukran-link"
                  v-model="url"
                ></textarea>
              </p>
              <p class="uk-text-meta">
                <span class="uk-text-bolder"
                  >How exactly do you get tipped, you ask?</span
                >
                Include your link in your profile description on Twitter, Instagram,
                YouTube, Podcasts, in your blog etc. and ask your audience to support you.
                Talk about it in your YouTube videos, Podcast episodes, and where ever you
                create content. Most creators shy away from doing these, and really
                shouldn't. You can read
                <u
                  ><a
                    class="uk-text-primary"
                    href="https://blog.useshukran.com/its-not-begging-youre-giving-value"
                    >what we have to say</a
                  ></u
                >
                concerning that.
              </p>
              <p class="uk-margin modal-buttons">
                <button
                  @click="copyShukranLink"
                  class="uk-button uk-button-default uk-margin-small-right"
                >
                  Copy link
                </button>
                <a
                  :href="
                    'https://twitter.com/intent/tweet?url=http%3A%2F%2Fuseshukran.com%2F&text=If+you+love+my+content,+you+can+support+me+here+https://useshukran.com/cr/' +
                    this.username +
                    '+so+I+can+continue+to+give+more+and+better'
                  "
                  class="uk-button tweet-it"
                  target="blank"
                >
                  Tell others
                  <span class="" uk-icon="twitter"></span>
                </a>
              </p>
            </div>
          </div>

          <li>
            <router-link to="/profile">Profile</router-link>
          </li>
          <!--Feedback area start -->
          <li id="give-feedback" uk-toggle="target: #my-id">
            Give feedback
            <a uk-icon="heart"></a>
          </li>
          <div id="my-id" uk-modal>
            <div class="uk-modal-dialog uk-modal-body">
              <h2 class="uk-modal-title">
                Hey <span class="capitalize">{{ username }}</span
                >,
              </h2>
              <p class="show">Show some love or raise an issue</p>
              <div class="uk-margin">
                <textarea
                  class="uk-textarea"
                  placeholder="message"
                  v-model="comment"
                ></textarea>
              </div>
              <div class="uk-margin">
                <button class="uk-button" @click="submitFeedback">
                  {{ feed }}
                </button>
              </div>
              <button class="uk-modal-close-default" type="button" uk-close></button>
            </div>
          </div>
          <!--Feebdack area end -->
          <li id="logout" @click="logout">Logout</li>
        </ul>
      </div>
    </div>
    <div class="uk-padding@s uk-container">
      <div class="" uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <h3>Hey {{ username }},</h3>
        <p>
          Please fill your profile completely. There are <b>4 tabs</b>, tap on the
          <span class="mobile-profile-tab">icon</span> headers to get to the other tabs.
        </p>
      </div>

      <div class="uk-card">
        <div class="uk-card-header">
          <h3 class="uk-card-title uk-text-center">Creator Profile</h3>
        </div>

        <div class="desktop-profile-tab">
          <ul class="uk-child-width-expand" uk-switcher="connect: .switch-class" uk-tab>
            <li>
              <a href="#" style="color: #208cb7">Personal Info</a>
            </li>
            <li>
              <a href="#" style="color: #208cb7" v-if="country_code == 'KE'"
                >MPESA info</a
              >
              <a href="#" style="color: #208cb7" v-else>Banking info</a>
            </li>
            <li>
              <a href="#" style="color: #208cb7">Brand Info</a>
            </li>
            <li>
              <a href="#" style="color: #208cb7">Add redirect link</a>
            </li>
          </ul>
        </div>

        <div class="mobile-profile-tab">
          <ul
            class="uk-child-width-expand uk-subnav uk-iconnav uk-subnav-pill uk-text-center"
            uk-switcher="connect: .switch-class"
          >
            <li><a href="#" uk-icon="icon: user"></a></li>
            <li><a href="#" uk-icon="icon: credit-card"></a></li>
            <li><a href="#" uk-icon="icon: info"></a></li>
            <li><a href="#" uk-icon="icon: link"></a></li>
          </ul>
        </div>

        <ul class="uk-switcher uk-margin switch-class">
          <li>
            <div class="uk-card-body" v-for="(profile, index) in profiles" :key="index">
              <div class="uk-margin">
                <label for="fn" class="to-the-left"> Full name </label>
                <input
                  name="fn"
                  type="text"
                  class="uk-input"
                  placeholder="Fullname"
                  v-model="profile.fullname"
                />
              </div>
              <div class="uk-margin">
                <label for="e" class="to-the-left"> Email </label>
                <input
                  name="e"
                  type="text"
                  class="uk-input"
                  v-model="profile.email"
                  placeholder="Email"
                />
              </div>

              <div class="uk-margin">
                <label for="un" class="to-the-left"> Username </label>
                <input
                  name="un"
                  type="text"
                  class="uk-input"
                  v-model="profile.username"
                  placeholder="Username"
                />
              </div>
              <div class="uk-margin" v-if="country_code == 'NG'">
                <label for="pn" class="to-the-left"> Phone number </label>
                <input
                  name="pn"
                  type="text"
                  class="uk-input"
                  v-model="profile.phone"
                  placeholder="Phone number"
                />
              </div>
              <button class="uk-button" @click="personalInfo">
                {{ savebtnOne }}
              </button>
            </div>
          </li>
          <li>
            <div class="uk-card-body" v-for="(profile, index) in profiles" :key="index">
              <div class="uk-margin">
                <label for="bn" class="to-the-left" v-if="country_code == 'KE'">
                  MPESA
                </label>
                <label for="bn" class="to-the-left" v-else> Bank </label>
                <input
                  name="bn"
                  type="text"
                  class="uk-input"
                  list="bank-options"
                  :placeholder="country_code == 'KE' ? 'MPESA' : 'Bank name'"
                  v-model="profile.bank"
                  :disabled="country_code == 'KE'"
                />
                <div class="uk-text-meta">
                  {{
                    country_code == "KE"
                      ? "Payouts available MPESA"
                      : "What bank do you wanna receive your payouts?"
                  }}
                </div>
                <!-- update from https://api.payant.ng/banks and find other countries' banks -->
                <!-- <div class="uk-form-controls" v-if="country_code == 'KE'">
                    <select title="Kenyan creators must use MPESA" v-model="profile.bank" class="uk-select" id="form-stacked-select">
                        <option value="MPESA">MPESA</option>
                    </select>
                </div> -->
                <datalist v-if="country_code == 'NG'" id="bank-options">
                  <option value="ACCESS BANK NIGERIA">ACCESS BANK NIGERIA</option>
                  <option value="ECOBANK NIGERIA LIMITED">ECOBANK NIGERIA LIMITED</option>
                  <option value="UNITED BANK FOR AFRICA PLC">
                    UNITED BANK FOR AFRICA PLC
                  </option>
                  <option value="FIRST BANK PLC">FIRST BANK PLC</option>
                  <option value="GTBANK PLC">GTBANK PLC</option>
                  <option value="STERLING BANK PLC">STERLING BANK PLC</option>
                  <option value="FCMB">FCMB</option>
                  <option value="ZENITH BANK PLC">ZENITH BANK PLC</option>
                  <option value="FIRST CITY MONUMENT BANK PLC">
                    FIRST CITY MONUMENT BANK PLC
                  </option>
                  <option value="POLARIS BANK">POLARIS BANK</option>
                  <option value="FSDH Merchant Bank Limited">
                    FSDH Merchant Bank Limited
                  </option>
                  <option value="UNITY BANK PLC">UNITY BANK PLC</option>
                  <option value="STANBIC IBTC BANK">STANBIC IBTC BANK</option>
                  <option value="WEMA BANK">WEMA BANK</option>
                  <option value="PROVIDUS BANK">PROVIDUS BANK</option>
                  <option value="UNION BANK">UNION BANK</option>
                  <option value="FIDELITY BANK">FIDELITY BANK</option>
                  <option value="HERITAGE BANK">HERITAGE BANK</option>
                  <option value="ENTERPRISE BANK">ENTERPRISE BANK</option>
                  <option value="KEYSTONE BANK">KEYSTONE BANK</option>
                  <option value="NIRSAL MICROFINANCE BANK">
                    NIRSAL MICROFINANCE BANK
                  </option>
                  <option value="PECANTRUST MICROFINANCE BANK">
                    PECANTRUST MICROFINANCE BANK
                  </option>
                  <option value="M KUDI">M KUDI</option>
                  <option value="STANBIC IBTC BANK">STANBIC IBTC BANK</option>
                  <option value="WEMA BANK">WEMA BANK</option>
                  <option value="JAIZ BANK">JAIZ BANK</option>
                  <option value="STANDARD CHARTERED BANK">STANDARD CHARTERED BANK</option>
                  <option value="VFD Microfinance Bank">VFD Microfinance Bank</option>
                </datalist>
              </div>
              <div class="uk-margin">
                <label for="an" class="to-the-left" v-if="country_code == 'KE'">
                  MPESA Name
                </label>
                <label for="an" class="to-the-left" v-else> Account name </label>
                <input
                  name="an"
                  type="text"
                  class="uk-input"
                  placeholder=""
                  v-model="profile.account_name"
                />
                <div class="uk-text-meta">
                  This is to ensure we pay the right person.
                </div>
              </div>

              <!-- for UK creators -->
              <div class="uk-margin" v-if="country_code == 'GB'">
                <label for="sc" class="to-the-left">
                  Sort Code
                </label>
                <input
                  name="sc"
                  type="text"
                  class="uk-input"
                  placeholder="6-digit sort code"
                  v-model="profile.sort_code"
                />
              </div>

              <div class="uk-margin">
                <label for="anub" class="to-the-left" v-if="country_code == 'KE'">
                  MPESA number
                </label>
                <label for="anub" class="to-the-left" v-else> Account number </label>
                <input
                  name="anub"
                  type="text"
                  class="uk-input"
                  placeholder="Account Number"
                  v-model="profile.account_number"
                />
                <div class="uk-text-meta">Your account number so we can pay you</div>
              </div>
              <button class="uk-button" @click="bankUpdate">
                {{ savebtnTwo }}
              </button>
            </div>
          </li>
          <li>
            <div class="uk-card-body" v-for="(profile, index) in profiles" :key="index">
              <div class="uk-margin">
                <label for="c" class="to-the-left"> Craft </label>
                <input
                  name="c"
                  type="text"
                  class="uk-input"
                  placeholder="What Do You Do? (Podcaster, Videographer)"
                  v-model="profile.craft_type"
                />
                <div class="uk-text-meta">
                  What do your content consumers know you for? You can fill as many as
                  possible and seperate them with a comma.
                </div>
              </div>
              <div class="uk-margin">
                <label for="f" class="to-the-left"> Following </label>
                <input
                  name="f"
                  type="text"
                  class="uk-input"
                  placeholder="Approximate Audience Size (listeners, subs etc)"
                  v-model="profile.audience_size"
                />
                <div class="uk-text-meta">
                  The approximate number of followers + listeners + subscribers (It does
                  not have to be 100% accurate, we'll take 80%)
                </div>
              </div>

              <div class="uk-margin">
                <label for="pl" class="to-the-left"> Primary link </label>
                <input
                  name="pl"
                  type="text"
                  class="uk-input"
                  placeholder="Link to your content e.g. (https://youtube.com/username)"
                  v-model="profile.primary_link"
                />
                <div class="uk-text-meta">
                  This link can be your disha, website or podcast link, It is for
                  outsiders to find your content and learn about you
                </div>
              </div>
              <div class="uk-margin">
                <label for="tm" class="to-the-left"> Thank you message </label>
                <textarea
                  name="tm"
                  class="uk-textarea"
                  placeholder="Heartfelt Message To Audience"
                  v-model="profile.summary"
                  maxlength="150"
                ></textarea>
                <div class="uk-text-meta">
                  Say something nice, witty, sweet etc., to get people to relate and tip
                  you.
                </div>
              </div>
              <button class="uk-button uk-button-default" @click="messageUpdate">
                {{ savebtnThree }}
              </button>
            </div>
          </li>

          <li>
            <div class="uk-card-body">
              <div class="uk-margin">
                <p class="digital-link-text">
                  Have exclusive content you want to share to only those that tip you?
                  Fill in your link here. This link let's people access a certain content
                  only after they have tipped you. That means you don't have to sell
                  anything completely free anymore.
                </p>
                <p class="digital-link-text">
                  This could be music, preset, e-books, etc.
                </p>
              </div>
              <div class="uk-margin" v-for="(profile, index) in profiles" :key="index">
                <label for="dpl" class="to-the-left"> Digital product link </label>
                <input
                  name="dpl"
                  type="url"
                  class="uk-input"
                  placeholder="https://downloadmystuff.com"
                  v-model="profile.redirect"
                />
                <div class="uk-text-meta">
                  Input a valid URL. <b>https://</b>downloadmystuff.com/link
                </div>
              </div>
              <div class="uk-margin-top redirect-tab-buttons">
                <button
                  id="link-btn"
                  v-bind:disabled="checkURL"
                  class="uk-button show-warning"
                  @click="updateRef"
                >
                  {{ savebtnFour }}
                </button>
                <a
                  href="https://twitter.com/intent/tweet?url=http%3A%2F%2Fuseshukran.com%2F&text=@useshukran's+helping+me+create+the+art+I+want+to+see+in+the+world,+help+me+by+supporting+the+art+you+want+to+see+in+the+world:&hashtags=saythanks,shukran"
                  class="uk-button tweet-it"
                  target="blank"
                >
                  Tell others
                  <span class="" uk-icon="twitter"></span> </a
                ><!-- should tell others about the product -->
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/**
Design template for profile page https://uidesigndaily.com/posts/sketch-profile-settings-app-day-671 -- doesn't really rhyme well with header, we can make it work
 */
// `https://drive.google.com/uc?id=${data.post.m edia[i]}`
import axios from "axios";
import TopSideHeader from './TopSideHeader.vue';
export default {
  components: { TopSideHeader },
  name: "Profile",
  data() {
    return {
      username: JSON.parse(sessionStorage.getItem("profile")).username,
      id: sessionStorage.getItem("id"),
      profiles: [JSON.parse(sessionStorage.getItem("profile"))],
      savebtnOne: "Save",
      savebtnTwo: "Save",
      savebtnThree: "Save",
      savebtnFour: "Save",
      url:
        "https://useshukran.com/cr/" +
        encodeURIComponent(JSON.parse(sessionStorage.getItem("profile")).username.trim()),
      comment: "",
      feed: "Submit",
      profile_picture: "",
      country_code: sessionStorage.getItem('shukran-country-data') ? JSON.parse(sessionStorage.getItem('shukran-country-data'))["shukran-country-code"] : 'NG', // default is NG
      ngBanks: [,],
    };
  },
  computed: {
    checkURL() {
      // modified regEx from https://regexr.com/39nr7
      return !/(http(s)?):\/\/[(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(
        this.profiles[0].redirect
      );
    },
  },
  methods: {
    copyShukranLink(evt) {
      // console.log("tryna copy");
      let copyText = document.getElementById("shukran-link"); // 'https://useshukran.com/cr/' + this.username;
      copyText.select();
      document.execCommand("copy");
      evt.target.innerText = "COPIED!";
      setTimeout(function () {
        // kinda too fast... we should delay a bit
        evt.target.innerText = "COPY LINK";
      }, 5000);
    },
    logout() {
      sessionStorage.clear();
      this.$router.push("/accounts");
    },
    scroll() {
      window.scrollBy(100, 0);
    },
    getId() {
      var username = this.username;
      axios
        .post(process.env.BASE_URL + "/api/creatorprofile/", {
          username: username,
        })
        .then((res) => {
          this.id = res.data[0]._id;
          // console.log("id");
          this.profiles = res.data;
          /*if (this.profiles[0].primary_link.slice(0,7) == 'https://'){
              this.profiles[0].primary_link = this.profiles[0].primary_link
            }*/
        })
        .catch((err) => {
          console.error(err);
        });
    },
    checkUser() {
      if (this.username == null) {
        this.$router.push("/accounts");
      }
    },
    handlePictureUpload() {
      // console.log("this.$refs", this.$refs);
      this.file = this.$refs.file[0].files[0];
    },
    messageUpdate() {
      this.savebtnThree = "saving...";
      var id = this.id;
      var summary = this.profiles[0].summary;
      var craft_type = this.profiles[0].craft_type;
      var audience_size = this.profiles[0].audience_size;
      var primary_link = this.profiles[0].primary_link;
      /*if (primary_link == '' || primary_link == undefined){
          primary_link = ''
        } else if(primary_link.slice(0, 7) !== "https://") {
          primary_link = "https://" + this.profiles[0].primary_link;
        } else {
          // console.log('issue')
        }*/
      axios
        .post(process.env.BASE_URL + "/api/update/", {
          summary: summary.trim(),
          craft_type: craft_type.trim(),
          audience_size: audience_size,
          primary_link: primary_link.trim(),
          id: id,
        })
        .then((res) => {
          // console.log("updated");
          this.savebtnThree = "Saved!";
          setTimeout(() => {
            this.savebtnThree = "Save";
          }, 3000);
        })
        .catch((err) => {
          console.error("update err", err);
          this.savebtnThree = "Please try again!";
          setTimeout(() => {
            this.savebtnThree = "Save";
          }, 3000);
        });
    },
    updateRef2() {
      let id = this.id;
      let username = this.profiles[0].username;
      /* if (redirect.slice(0, 7) !== "https://"){
          redirect = "https://" + this.profiles[0].redirect;
        } */
      this.savebtnFour = "saving...";
      axios
        .post(process.env.BASE_URL + "/api/update/", {
          username: username.trim(),
          id: id,
        })
        .then((res) => {
          // console.log("updated", res);
          sessionStorage.setItem("profile", JSON.stringify(res.data));
          this.savebtnFour = "Saved!";
          setTimeout(() => {
            this.savebtnFour = "Save";
          }, 5000);
        }, (err) => {
          console.error(err);
          this.savebtnFour = "Please try again!";
          setTimeout(() => {
            this.savebtnFour = "Save";
          }, 5000);
        })
        .catch((err) => {
          console.error(err);
          this.savebtnFour = "Please try again!";
          setTimeout(() => {
            this.savebtnFour = "Save";
          }, 5000);
        });
    },
    updateRef() {
      let id = this.id;
      let redirect = this.profiles[0].redirect;
      /* if (redirect.slice(0, 7) !== "https://"){
          redirect = "https://" + this.profiles[0].redirect;
        } */
      this.savebtnFour = "saving...";
      axios
        .post(process.env.BASE_URL + "/api/update/", {
          redirect: redirect.trim(),
          id: id,
        })
        .then((res) => {
          // console.log("updated", res);
          sessionStorage.setItem("profile", JSON.stringify(res.data));
          this.savebtnFour = "Saved!";
          setTimeout(() => {
            this.savebtnFour = "Save";
          }, 5000);
        })
        .catch((err) => {
          console.error(err);
          this.savebtnFour = "Please try again!";
          setTimeout(() => {
            this.savebtnFour = "Save";
          }, 5000);
        });
    },
    getSupporters() {
      // Optionally the request above could also be done as
      axios
        .get(process.env.BASE_URL + "/api/yoursupporters/", {
          params: {
            username: this.username,
          },
        })
        .then(function (response) {
          // console.log("how many", response);
        })
        .catch(function (error) {
          // console.error("baddd", error);
        })
        .then(function () {
          // always executed
        });
    },
    submitFeedback() {
      var username = this.username;
      var comment = this.comment;
      axios
        .post(process.env.BASE_URL + "/api/givefeedback/", {
          username: username,
          comment: comment,
        })
        .then((res) => {
          // console.log("feedback submited"); // no
          UIkit.modal("#my-id").hide();
          alert("Thank you for your feedback!"); // alert ?!!??! def no
        })
        .catch((err) => {
          // console.error(err);
        });
    },

    bankUpdate() {
      var id = this.id;
      // hot fix, pre-set bank if country_code is KE
      let bank;
      if (this.country_code == "KE") {
        bank = this.profiles[0].bank = JSON.parse(
          sessionStorage.getItem("profile")
        ).bank = "MPESA";
      } else {
        bank = this.profiles[0].bank;
      }

      var account_name = this.profiles[0].account_name;
      var account_number = this.profiles[0].account_number;
      this.savebtnTwo = "saving...";
      axios
        .post(process.env.BASE_URL + "/api/update/", {
          id: id,
          bank: bank.trim(),
          account_name: account_name.trim(),
          account_number: account_number.trim(),
        })
        .then((res) => {
          // console.log("updated");
          sessionStorage.setItem("profile", JSON.stringify(res.data));
          this.savebtnTwo = "Saved!";
          setTimeout(() => {
            this.savebtnTwo = "Save";
          }, 5000);
        })
        .catch((error) => {
          // console.error("error occured", error);
          this.savebtnTwo = "Please try again!";
          setTimeout(() => {
            this.savebtnTwo = "Save";
          }, 5000);
        });
    },
    onFileChanged(event) {
      let formData = new FormData();
      formData.append("id", this.id);
      formData.append("pic", event.target.files[0]);
      // console.log(event.target.files);
      axios
        .post(process.env.BASE_URL + "/api/update/", formData, {
          onUploadProgress: (progressEvent) => {
            // console.log(progressEvent.loaded / progressEvent.total);
          },
        })
        .then((res) => {
          // sessionStorage.setItem('profile', JSON.stringify(res.data)) // optimize
          this.profiles[0].picture_id = res.data;
        })
        .catch((error) => {
          // console.error("error occured", error);
        });
    },
    personalInfo() {
      var id = this.id;
      var fullname = this.profiles[0].fullname;
      var email = this.profiles[0].email;
      var username = this.profiles[0].username.toLowerCase();
      // should be dynamic ...for when KE, NG, etc
      if (this.country_code == 'NG') {
        let phone = this.profiles[0].phone;
      }
      
      this.savebtnOne = "saving...";
      axios
        .post(process.env.BASE_URL + "/api/update/", {
          id: id,
          fullname: fullname.trim(),
          email: email.trim(),
          username: username.trim(),
          ...(this.country_code == 'NG' && {phone: phone.trim()}), // if NIGERIANs
        })
        .then((res) => {
          // console.log("updated");
          sessionStorage.setItem("profile", JSON.stringify(res.data));
          this.savebtnOne = "Saved!";
          setTimeout(() => {
            this.savebtnOne = "Save";
          }, 5000);
        }, (err) => {
          console.error();("personalInfo error occured", error);
          this.savebtnOne = "Try again!";
          setTimeout(() => {
            this.savebtnOne = "Save";
          }, 5000);
        })
        .catch((error) => {
          console.error();("personalInfo error occured", error);
          this.savebtnOne = "Try again!";
          setTimeout(() => {
            this.savebtnOne = "Save";
          }, 5000);
        });
    },
  },
  mounted() {
    // this.getId(); /// shouldn't be...
    this.checkUser();
    this.getSupporters();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.modal-buttons > * {
  border-radius: 3px;
}
.tip-modal {
  border-radius: 5px;
}
@media (max-width: 640px) {
  .modal-buttons > .uk-button {
    padding: 0 10px;
    font-size: 0.8rem;
  }
  .redirect-tab-buttons > * {
    padding: 0 10px;
  }
  textarea {
    height: 50px;
  }
}

.redirect-tab-buttons > button {
  margin-right: 20px;
}

.uk-navbar,
.uk-navbar-item {
  color: #ffffff;
}

.uk-modal {
  background-color: #ff6870 !important;
  color: #fceedd;
}

.show {
  color: #c63968;
}

.capitalize {
  text-transform: capitalize;
}

.uk-container-expand {
  background-color: transparent;
  color: #ebebe7 !important;
}

.uk-offcanvas-bar {
  /* background-color: #c63968 !important; */
  color: #fceedd;
}

.uk-button {
  background-color: #c63968 !important;
  color: #fceedd;
}

.uk-card,
.uk-card-title {
  background-color: #fff;
  color: #ff6870;
  border-radius: 5px;
}

.uk-card-title {
  color: #ff6870;
}

li#give-feedback,
li#get-tipped,
li#logout {
  cursor: pointer;
}

li#give-feedback:hover,
li#get-tipped:hover,
li#logout:hover {
  text-decoration: underline;
}

.image-background {
  width: 80px;
  height: 80px;
  border-radius: 5px;
}

.us {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: -10px;
}

#add-image {
  opacity: 0;
}

#add-image:hover {
  opacity: 1;
}

div[data-src][src*="data:image"] {
  background: rgba(0, 0, 0, 0.1);
}

#link-btn:disabled {
  cursor: not-allowed;
}

.request-button.uk-button-primary {
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.desktop-nav {
  margin: 30px;
  border-radius: 5px;
  background: #edf4f0 !important;
  color: #111011 !important;
}

.to-the-left {
  float: left;
}

.digital-link-text {
  text-align: left;
}

.uk-navbar-toggle {
  color: #ffffff;
}

.uk-margin input,
.uk-card-body button,
.tweet-it {
  border-radius: 3px;
}

#my-id > .uk-modal-body,
.uk-alert {
  border-radius: 5px;
}

.uk-alert {
  text-align: left;
}

.uk-textarea,
.uk-modal-dialog.uk-modal-body div.uk-margin > button {
  border-radius: 3px;
}

.uk-container-expand {
  background-image: linear-gradient(135deg, #c63968 0%, #ff746c 100%);

  position: fixed;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  overflow: auto;
}

@media (min-width: 960px) {
  .mobile-nav,
  .mobile-profile-tab {
    display: none;
  }
}

@media (max-width: 960px) {
  .desktop-nav,
  .desktop-profile-tab {
    display: none;
  }

  .uk-tab {
    flex-wrap: nowrap;
    overflow-x: auto;
    flex-direction: row;
    margin-left: 0px;
  }

  .uk-tab li a {
    width: max-content;
  }

  .uk-child-width-expand > :not([class*="uk-width"]) {
    min-width: auto;
  }
}
</style>
