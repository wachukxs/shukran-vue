<template dashboard-body>
  <div class="uk-container-expand">
    <top-side-header v-on:change-rates="rates"></top-side-header>
    
    <div class="uk-section">
      
      <div class="uk-container">
        <h3 class="h3">
          Hello,
          <span class="capitalize">{{username}}</span>
        </h3>
        <div uk-alert>
          <a class="uk-alert-close" uk-close></a>
          <h3>Announcement</h3>
          <p>
            Hi {{username}}, our 10% charge will take effect on payout requests from hence forth, find the breakdown
            <router-link to="/pricing">here.</router-link> Shukran!😊
          </p>
        </div>

        <div class="uk-grid-medium uk-child-width-expand@s uk-grid-match" uk-grid>

          <div>
            <div class="uk-flex uk-flex-column info-card">

              <div>
                <!-- Total tips start -->
                <div class="uk-card uk-card-default uk-card-body">
                  <span>
                    Total tips.
                    <a class="uk-card-badge uk-label" href="#modal-middle" uk-toggle>Request payout</a>
                  </span>
                  <h1 class="uk-heading-small">{{currencySymbol}}{{tipTotal.toFixed(2)}}</h1>

                  <!-- Withdraw request modal start -->
                  <div id="modal-middle" class="uk-flex-top" uk-modal>
                    <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical payout-modal">
                      <div>
                        <h4 class="uk-modal-title">Payout request</h4>
                      </div>
                      <button class="uk-modal-close-default" type="button" uk-close></button>
                      <div>
                        <h4>Available balance: {{currencySymbol}}{{availableBalance.toFixed(2)}}</h4>
                        <h5 class="uk-margin-remove-top">We'll payout to your <strong>{{ profiles.bank }},
                            <u>{{ profiles.account_number }}</u></strong></h5>
                      </div>
                      <div class="uk-margin">
                        <input type="number" class="uk-input payout-input" placeholder="Amount" v-model="amount" />
                        <span v-if="amount > (availableBalance)" class="rqp-text">Insufficient available balance.</span>
                        <br />
                        <span v-if="amount < payoutGuard" class="rqp-text">Payout requests cannot be less than
                          {{currencySymbol}}{{payoutGuard.toFixed(2)}}</span>
                      </div>
                      <div class="uk-margin">
                        <button class="uk-button red-button payout-button"
                          :disabled="amount > availableBalance || amount < payoutGuard"
                          @click="withdrawRequest()">{{request}}</button>
                      </div>
                    </div>
                  </div>
                  <!-- Withdraw request modal end -->
                  <div class="chart-container">
                    <canvas id="total-tips-chart" aria-label="Total Tips Chart" role="Total tips chart image">
                      <p aria-label="Fallback text">Your browser does not support displaying canvas</p>
                    </canvas>
                  </div>
                </div>
                <!-- Total tips end -->

              </div>

              <div>
                <div class="uk-margin-top uk-card uk-card-default uk-card-body">
                  <h3 class="uk-card-title">Overview</h3>

                  <div id="chart-container-2">

                    <canvas id="total-money-chart" aria-label="Total Money Chart" role="Total Money chart image"
                      class="chartjs-render-monitor">

                      <p aria-label="Fallback text">Your browser does not support displaying canvas</p>
                    </canvas>
                    <div id="chartjs-tooltip" class="chartjs-tooltip center">
                      <table></table>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>


          <!-- table -->
          <div>
            <div class="info-card uk-card uk-card-default uk-card-body">
              <div>

                <div class="tip-details-header-section uk-flex uk-flex-between">
                  <span class="uk-margin-small-top">
                    Tip details.
                  </span>
                  <ul class=" uk-flex-right " uk-tab uk-switcher="connect: .re-tain; animation: uk-animation-fade">

                    <li v-for="(n, ni) in Math.round(transactions.length/viewPerPage)" :key="ni"><a
                        href="#">{{ni + 1}}</a></li>

                  </ul>
                </div>

                <h1 class="uk-heading-small" v-show="uniqueSupporters > 0">{{uniqueSupporters}} supporters</h1>

              </div>

              <ul class="uk-switcher re-tain">
                <li v-for="(n, ni) in Math.round(transactions.length/viewPerPage)" :key="ni + 'jop'" :data-index="ni">
                  <ul class="uk-list uk-list-divider">

                    <li v-for="(m, mi) in transactions.slice(ni*viewPerPage, (ni*viewPerPage)+viewPerPage)"
                      :key="m.transaction_date" :data-index="mi" class="uk-margin-small-left uk-margin-small-right">
                      <div class="uk-width-expand">
                        <h5 class="uk-margin-remove-bottom">{{currencySymbol}}<span
                            class="uk-text-bolder">{{parseFloat(m.amount).toFixed(2)}}</span> from
                          {{ m.supporter_nickname }}</h5>
                        <p class="uk-text-meta uk-margin-remove-bottom uk-margin-small-top">
                          {{ m.message.length === 0 ? "" : m.message.trim().endsWith('.') ? m.message + ' &#8212;' : m.message.concat('.') + ' &#8212;' }}

                          <time :datetime="m.transaction_date">
                            {{
                              new Intl.DateTimeFormat('en-US', 
                              { month: 'long', day: 'numeric', year: 'numeric' })
                              .format(new Date(m.transaction_date))
                            }}
                          </time>
                        </p>
                      </div>
                    </li>

                  </ul>
                </li>
              </ul>

            </div>
          </div>
          <!-- //table -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // inspiration https://uidesigndaily.com/posts/sketch-dashboard-ui-components-upgrade-stats-statistics-admin-panel-day-1076
  import axios from "axios";
  import Chart from "chart.js";
  import fx from "money";
  import TopSideHeader from './TopSideHeader.vue';
  fx.base = "USD";
  fx.rates = { // LiG
    "AED": 3.6732,
    "AFN": 77.571739,
    "ALL": 101.322195,
    "AMD": 522.91,
    "ANG": 1.79468,
    "AOA": 654.16,
    "ARS": 85.115434,
    "AUD": 1.29985,
    "AWG": 1.8,
    "AZN": 1.7025,
    "BAM": 1.601236,
    "BBD": 2,
    "BDT": 84.632456,
    "BGN": 1.601212,
    "BHD": 0.377011,
    "BIF": 1941.945389,
    "BMD": 1,
    "BND": 1.328012,
    "BOB": 6.919072,
    "BRL": 5.1934,
    "BSD": 1,
    "BTC": 0.00003015358,
    "BTN": 73.428791,
    "BWP": 10.802857,
    "BYN": 2.612258,
    "BZD": 2.015329,
    "CAD": 1.273005,
    "CDF": 1971.040379,
    "CHF": 0.890075,
    "CLF": 0.025749,
    "CLP": 710.49939,
    "CNH": 6.50503,
    "CNY": 6.533,
    "COP": 3461.475266,
    "CRC": 610.275904,
    "CUC": 0.999805,
    "CUP": 25.75,
    "CVE": 90.55,
    "CZK": 21.470201,
    "DJF": 178.902125,
    "DKK": 6.0929,
    "DOP": 58.177256,
    "DZD": 132.070391,
    "EGP": 15.842604,
    "ERN": 15.001453,
    "ETB": 39.551923,
    "EUR": 0.824063,
    "FJD": 2.0392,
    "FKP": 0.731368,
    "GBP": 0.731368,
    "GEL": 3.285,
    "GGP": 0.731368,
    "GHS": 5.899054,
    "GIP": 0.731368,
    "GMD": 51.755,
    "GNF": 10001.800634,
    "GTQ": 7.793425,
    "GYD": 209.171282,
    "HKD": 7.75325,
    "HNL": 24.201215,
    "HRK": 6.1794,
    "HTG": 72.62042,
    "HUF": 296.92,
    "IDR": 14213.6925,
    "ILS": 3.21302,
    "IMP": 0.731368,
    "INR": 73.09225,
    "IQD": 1468.227817,
    "IRR": 42105,
    "ISK": 127.81,
    "JEP": 0.731368,
    "JMD": 142.971637,
    "JOD": 0.709,
    "JPY": 103.23998054,
    "KES": 99.5, // 109.74,
    "KGS": 83.169856,
    "KHR": 4057.957295,
    "KMF": 403.000217,
    "KPW": 900,
    "KRW": 1085.73,
    "KWD": 0.304144,
    "KYD": 0.833157,
    "KZT": 421.359547,
    "LAK": 9341.069588,
    "LBP": 1519.51088,
    "LKR": 186.166825,
    "LRD": 164.233303,
    "LSL": 14.681041,
    "LYD": 1.344386,
    "MAD": 8.927095,
    "MDL": 17.269066,
    "MGA": 3931.398747,
    "MKD": 50.444146,
    "MMK": 1334.572418,
    "MNT": 2854.186283,
    "MOP": 7.983466,
    "MRO": 357,
    "MRU": 36.18,
    "MUR": 39.699575,
    "MVR": 15.4,
    "MWK": 774.654957,
    "MXN": 19.8822,
    "MYR": 4.0505,
    "MZN": 74.81,
    "NAD": 14.69,
    "NGN": 420, // 396.700509,
    "NIO": 34.873728,
    "NOK": 8.63301,
    "NPR": 117.485776,
    "NZD": 1.412085,
    "OMR": 0.384976,
    "PAB": 1,
    "PEN": 3.637889,
    "PGK": 3.539268,
    "PHP": 48.338897,
    "PKR": 160.992872,
    "PLN": 3.75377,
    "PYG": 6951.07244,
    "QAR": 3.64125,
    "RON": 3.9831,
    "RSD": 96.25,
    "RUB": 73.945,
    "RWF": 990.813199,
    "SAR": 3.751084,
    "SBD": 8.002049,
    "SCR": 21.204537,
    "SDG": 55.225,
    "SEK": 8.26929,
    "SGD": 1.321615,
    "SHP": 0.731368,
    "SLL": 10099.47633,
    "SOS": 581.358349,
    "SRD": 14.154,
    "SSP": 130.26,
    "STD": 20389.997455,
    "STN": 20.325,
    "SVC": 8.748595,
    "SYP": 513.419605,
    "SZL": 14.677733,
    "THB": 30.170546,
    "TJS": 11.325199,
    "TMT": 3.5,
    "TND": 2.6945,
    "TOP": 2.274086,
    "TRY": 7.4392,
    "TTD": 6.795284,
    "TWD": 28.069001,
    "TZS": 2318.537,
    "UAH": 28.475256,
    "UGX": 3655.26232,
    "USD": 1,
    "UYU": 42.360892,
    "UZS": 10474.795277,
    "VEF": 248487.642241,
    "VES": 1105425.302503,
    "VND": 23344.601074,
    "VUV": 108.952017,
    "WST": 2.536797,
    "XAF": 540.549729,
    "XAG": 0.03790043,
    "XAU": 0.0005268,
    "XCD": 2.70255,
    "XDR": 0.696046,
    "XOF": 540.549729,
    "XPD": 0.00040677,
    "XPF": 98.336844,
    "XPT": 0.00093188,
    "YER": 250.408348,
    "ZAR": 14.662595,
    "ZMW": 21.165801,
    "ZWL": 322
  };
  export default {
  components: { TopSideHeader },
    name: "Dashboard",
    data() {
      return {
        username: JSON.parse(sessionStorage.getItem('profile')).username,
        transactions: [],
        allTips: [], // optimise this later
        tipsDates: [],
        currency: !sessionStorage.getItem("shukran-country-currency") ? "NGN" : sessionStorage.getItem(
          "shukran-country-currency"), // optimse later, use country's currency
        tempCurr: "NGN", // cause they come as this
        payoutGuard: 1000, // 1000 NGN
        url: "https://useshukran.com/cr/" + encodeURIComponent(JSON.parse(sessionStorage.getItem('profile')).username.trim()),
        copied: "",
        chart1: null, // maybe also show recurring tips
        chart2: null,
        amount: 0,
        tipTotal: 0,
        tipWithdrawn: 0,
        withdrawals: [],
        profiles: JSON.parse(sessionStorage.getItem("profile")),
        balance: 0,
        comment: "",
        feed: "Send",
        request: "Request",
        uniqueSupporters: 0,
        viewPerPage: 8
      };
    },
    computed: {
      availableBalance() {
        return this.tipTotal - this.tipWithdrawn;
      },
      currencySymbol() {
        switch (this.currency) {
          case "NGN":
            return "₦";
          case "USD":
            return "$";
          case "KES":
            return "Ksh";
          case "GBP":
            return "£";
          default:
            return "$";
        }
      }
    },
    methods: {
      copyShukranLink(evt) {
        let copyText = document.getElementById("shukran-link"); // 'https://useshukran.com/cr/' + this.username;
        copyText.select();
        document.execCommand("copy");
        evt.target.innerText = 'COPIED!'
        setTimeout(function () { // kinda too fast... we should delay a bit
          evt.target.innerText = 'COPY LINK'
        }, 5000)
      },
      rates(_currency) {
        sessionStorage.setItem('shukran-curr-cur-sym', this.currencySymbol)

        this.tipTotal = fx(this.tipTotal) // convert tip total
          .from(
            this.tempCurr
            /* ? this.tempCurr
            : sessionStorage.getItem("shukran-country-currency") */
          ).to(_currency);

        this.tipWithdrawn = fx(this.tipWithdrawn) // convert tip withdrawn
          .from(
            this.tempCurr
            /* ? this.tempCurr
            : sessionStorage.getItem("shukran-country-currency") */
          ).to(_currency);

        this.allTips = this.allTips.map(tip => fx(tip) // convert all other tips
          .from(
            this.tempCurr
            /* ? this.tempCurr
            : sessionStorage.getItem("shukran-country-currency") */
          ).to(_currency));

        for (let index = 0; index < this.transactions.length; index++) {
          const element = this.transactions[index];
          element.amount = fx(element.amount).from(this.tempCurr).to(_currency)
        }

        switch (_currency) {
          case "NGN":
            this.payoutGuard = 1000
            break;
          case "KES":
            this.payoutGuard = 500
            break
          default:
            this.payoutGuard = 1000
            break;
        }

        /* this.payoutGuard = fx(1000) // convert payout guard ...important!
            .from("NGN")
            .to(this.currency); */

        this.tempCurr = _currency;
        this.currency = _currency; // hate that we have to do it like this

        if (this.chart1) { // update chart1
          this.chart1.data.datasets[0].data = this.allTips
          this.chart1.update();
        }
        if (this.chart2) { // update chart2
          this.chart2.data.datasets[0].data = [this.availableBalance.toFixed(2), this.tipWithdrawn.toFixed(2)]
          this.chart2.data.labels = [ // These labels appear in the
            this.currencySymbol + this.availableBalance.toFixed(2) + ' Available',
            this.currencySymbol + this.tipWithdrawn.toFixed(2) + ' Withdrawn'
          ]
          this.chart2.update();
        }
        // const rate = fx(this.tipTotal).from(sessionStorage.getItem('shukran-country-currency')).to(this.currency)
        // console.log(`${sessionStorage.getItem('shukran-country-currency')}${this.tipTotal} = ${this.currency}${rate.toFixed(2)}`)

        // re-render, the whole page, to update the graph
        this.$forceUpdate();
      },
      getSupporters() {
        // Optionally the request above could also be done as
        // we really don't need this end point, because we can just count the number of tips they've gotten, the table length
        axios.get(process.env.BASE_URL + "/api/yoursupporters/", {
            params: {
              username: this.username
            }
          })
          .then(response => {
            // console.log('how many', response.data.length);
            this.uniqueSupporters = response.data.length
          })
          .catch(error => {
            // console.error('baddd', error);
          })
          .then(() => { // always executed
          });

      },
      getSubscribers() {
        axios.get(process.env.BASE_URL + "/api/getsubscribers/", {
            params: {
              id: this.profiles._id,
              username: this.profiles.username,
            }
          }).then(response => {
            console.log('how many subscribers', response);
          })
          .catch(error => {
            console.log('baddd getsubscribers', error);
          })
          .then(() => { // always executed
          });
      },
      createTipsChart() {
        // https://codepen.io/grayghostvisuals/pen/gpROOz

        const ctx = document.getElementById("total-tips-chart").getContext("2d");

        /* let gradient = ctx.createLinearGradient(0, 450, 0, 50);
        gradient.addColorStop(1, "rgba(255, 0, 0, 0.5)");
        gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
        gradient.addColorStop(0, "rgba(255, 0, 0, 0)"); */

        this.chart1 = new Chart(ctx, {
          type: "line",
          data: {
            labels: this.tipsDates,
            datasets: [{
              label: "Tips",
              data: this.allTips,
              pointBorderWidth: 8,
              pointHitRadius: 16,
              pointHoverBackgroundColor: '#359F79',
              pointHoverBorderColor: '#359F79',
              pointHoverRadius: 7.5,
              backgroundColor: '#F8CAC1', // gradient,
              borderColor: "#E6393C", // Array | String, if array, it'll pick for the different points color per array element
              borderWidth: 4,
              fill: "start",
              lineTension: 0, // 0 make lines straight
            }]
          },
          options: {
            title: {
              display: false,
              text: "You were tipped WHAT? WHEN?"
            },
            maintainAspectRatio: false,
            responsive: true,
            lineTension: 1,
            scales: {
              xAxes: [{
                pointLabels: {
                  display: false
                }
              }],
              yAxes: [{
                pointLabels: {
                  display: false
                },
                ticks: {
                  // beginAtZero: false,
                  padding: 25,
                  callback: function (value, index, values) {
                    // return null to hide
                    return sessionStorage.getItem('shukran-curr-cur-sym') +
                    value; // Include a naira/ksh sign in the ticks
                  }
                }
              }]
            },
            tooltips: {
              callbacks: {
                // https://www.chartjs.org/docs/latest/configuration/tooltip.html#label-callback
                label: function (tooltipItem, data) {
                  return `You were tipped ${sessionStorage.getItem('shukran-curr-cur-sym')}${parseFloat(tooltipItem.value).toFixed(2)} on ${tooltipItem.label}`;
                },
                title: function (tooltipItem, data) {
                  return `Tip Details`;
                }
              }
            }
          }
        });

      },
      createOverviewChart() {
        // https://uidesigndaily.com/posts/sketch-stats-card-statistics-analytics-chart-day-817

        let config = {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [this.availableBalance.toFixed(2), this.tipWithdrawn.toFixed(2)],
              backgroundColor: ['#F8CAC1', '#E6393C'], // https://www.instagram.com/p/CJBJs6BAX0S/
              borderWidth: 4,
            }],
            labels: [ // These labels appear in the legend and in the tooltips when hovering different arcs
              this.currencySymbol + this.availableBalance.toFixed(2) + ' Available',
              this.currencySymbol + this.tipWithdrawn.toFixed(2) + ' Withdrawn'
            ]
          },
          options: {
            maintainAspectRatio: false,
            onResize: (cht, size) => { // size => {width: 292, height: 146}
              // console.log(cht, s);

              /* if (s.height < 100) {
                cht.width = 150 // s.width * 2;
                cht.height = 150 // s.height * 2;
              } */
            },
            responsive: true,
            cutoutPercentage: 75,
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                fontSize: 15,
              }
            },
            tooltips: {
              enabled: false,
              custom: function (
              tooltip) { // https://www.chartjs.org/docs/latest/configuration/tooltip.html#external-custom-tooltips

                let tooltipEl = document.getElementById('chartjs-tooltip');

                // Hide if no tooltip
                if (tooltip.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  return;
                }

                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltip.yAlign) {
                  tooltipEl.classList.add(tooltip.yAlign);
                } else {
                  tooltipEl.classList.add('no-transform');
                }

                function getBody(bodyItem) {
                  for (let i = 0; i < bodyItem.lines.length; i++) {
                    // bodyItem.lines[i] = bodyItem.lines[i].replace(':', ': ' + sessionStorage.getItem('shukran-curr-cur-sym'))
                    bodyItem.lines[i] = bodyItem.lines[i].split(':')[0]
                  }

                  return bodyItem.lines;
                }

                // Set Text
                if (tooltip.body) {
                  let titleLines = tooltip.title || [];
                  let bodyLines = tooltip.body.map(getBody);

                  let innerHtml = '<thead>';

                  titleLines.forEach(function (title) {
                    innerHtml += '<tr><th>' + title + '</th></tr>';
                  });
                  innerHtml += '</thead><tbody>';

                  bodyLines.forEach(function (body, i) {
                    let colors = tooltip.labelColors[i];
                    let style = 'background:' + colors.backgroundColor;
                    style += '; border-color:' + colors.borderColor;
                    style += '; border-width: 2px';
                    let span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                    innerHtml += '<tr><td>' + span + body + '</td></tr>';
                  });
                  innerHtml += '</tbody>';

                  let tableRoot = tooltipEl.querySelector('table');
                  tableRoot.innerHTML = innerHtml;
                }

                // let chart = context.chart;
                // let positionY = ctx2.canvas.offsetTop;
                // let positionX = ctx2.canvas.offsetLeft;
                let positionY = this._chart.canvas.offsetTop;
                let positionX = this._chart.canvas.offsetLeft;

                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
                tooltipEl.style.fontSize = tooltip.bodyFontSize;
                tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
                tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';

              },
              callbacks: {
                // Use the footer callback to display the sum of the items showing in the tooltip
                footer: function (tooltipItems, data) {
                  let sum = 0;

                  tooltipItems.forEach(function (tooltipItem) {
                    sum += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                  });
                  return 'Sum: ' + sum;
                },
              },
            },
          }
        };

        const ctx2 = document.getElementById("total-money-chart").getContext('2d');

        this.chart2 = new Chart(ctx2, config);
      },
      logout() {
        sessionStorage.clear();
        this.$router.push("/accounts");
      },
      loadTransactions() {
        let username = this.username;
        axios.post(process.env.BASE_URL + "/api/findall/", {
            username: username,
            status: "received"
          }).then(res => {
            // console.log("loadTransactions done", res); // do the currency conversion here.
            this.transactions = res.data;
            for (let i = 0; i < this.transactions.length; i++) {
              this.tipTotal += parseFloat(this.transactions[i].amount);
              this.allTips.push(this.transactions[i].amount); // optimise how this is gotten
              // https://stackoverflow.com/a/34015511
              this.tipsDates.push(
                new Date(
                  this.transactions[i].transaction_date
                ).toLocaleDateString("en-GB", {
                  year: "2-digit",
                  month: "short",
                  day: "2-digit"
                })
              ); // .toDateString() .toLocaleDateString("en-US")
            }
          }).then(() => {
            this.rates(this.currency); // get the conversion first...
          }).then(() => {
            this.createTipsChart() // then create the first chart chart1
          })
          .catch(err => {
            console.error(err, err.code);
          });
        // console.log(`hey ${username} what you doing looking on here? care to tell us? all@useshukran.com`)
      },
      loadWithdrawn() {
        let username = this.username;
        axios
          .post(process.env.BASE_URL + "/api/findall/", {
            username: username,
            status: "paid"
          })
          .then(res => {
            // console.log("loadWithdrawn done", res);
            this.withdrawals = res.data; // don't use this just immeidately ... or at all
            for (let i = 0; i < res.data.length; i++) {
              this.tipWithdrawn += parseFloat(res.data[i].amount);
            }
            // console.log('amt withdrawn loaded', this.tipWithdrawn);
          }).then(() => {
            // this.rates();
            this.tipWithdrawn = fx(this.tipWithdrawn) // convert tip withdrawn
              .from("NGN").to(this.currency);
            // console.log('tip withdrawn converted', this.tipWithdrawn);
          }).then(() => {
            this.createOverviewChart()
          })
          .catch(err => {
            console.error('loadWithdraw', err);
          });
      },
      withdrawRequest() { // convert to naira
        /* let amount = fx(this.amount)
              .from(this.currency)
              .to("NGN"); */
        let amount = this.amount;
        if (this.currency === "KES") { // we can do more
          amount = parseFloat(this.amount) * 4.1
        } else if (this.currency === "USD") {
          amount = parseFloat(this.amount) * 380
        }

        let username = this.username;
        // let amount = this.amount;
        let status = "requested";
        this.request = "loading...";
        axios
          .post(process.env.BASE_URL + "/api/requestpayout/", {
            username: username,
            amount: amount, // in naira
            status: status,
            email: this.profiles.email
          })
          .then(res => {
            // console.log("withdrawRequest done", res);
            this.request = "Done";
            UIkit.modal("#modal-middle").hide();
            let thanks =
              `Hi ${this.username}, your payout request will be processed within the next 6-10 hours & sent to your account with the 10% charge in effect. Hang tight`;
            alert(thanks);
          })
          .catch(err => {
            // console.error(err);
          });
      },
      getBalance() {
        this.balance = this.tipTotal - this.tipWithdrawn;
      },
      checkUser() {
        if (this.username == null) {
          this.$router.push("/accounts");
        }

        analytics.identify(this.profiles._id, {
          username: this.username,
          email: this.profiles.email,
        });
        analytics.track('Account Accessed', {
          authentication: 'Login'
        })
      },
      getId() {
        axios.post(process.env.BASE_URL + "/api/creatorprofile/", {
            username: this.username
          })
          .then(res => {
            this.profiles = res.data[0];
          })
          .catch(err => {
            // console.error(err);
          });
      },
      getCountryData() {
        // to-do ... move this to the back end!
        // make this a global function
    // This updates once data is older than a week
    // we could make this a service worker ...or shift logic to backend
    if(!sessionStorage.getItem('shukran-country-data') || (sessionStorage.getItem('shukran-country-data') && Date.now() - JSON.parse(sessionStorage.getItem('shukran-country-data'))["last-update"] > 604800000) ) { // https://countrycode.org/
      fetch('https://ipapi.co/json/', { // http://ipinfo.io
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json()
        })
        .then(data => {
          // console.log("\n\n\nchecking country code !");
          let __data = {
            'shukran-country-currency': data.currency,
            'shukran-country-code': data.country_code,
            'last-update': Date.now()
          }
          // console.log(data.country_name, "using", data.currency_name, data.currency)

          this.currency = data.currency;
          sessionStorage.setItem('shukran-country-data', JSON.stringify(__data));
          sessionStorage.setItem('shukran-country-currency', data.currency);
          sessionStorage.setItem('shukran-country-code', data.country_code); // commenting for testing
        })
        .catch(error => { // hopefully we never get here. If we do, we ask them for thier country
          // console.error('There has been a problem with our fetch operation:', error);
        });
    } else { // use their currency
        }
      }
    },
    mounted() {

      new Promise((resolve, reject) => { // we must be sure about this
          this.loadTransactions();
          resolve() // must call
        })
        .then(() => {
          this.getBalance();
        })
        .then(() => {
          this.loadWithdrawn();
        })
        .then(() => {
          this.getSupporters(); // should we call this? peep comment in it's definitino
          this.getSubscribers();
        })
      // this.getId(); // shouldn't be

      // this.rates(); // so we don't do it on currency change

    },
    beforeMount() {
      this.checkUser();
      this.getCountryData();
      sessionStorage.setItem('shukran-curr-cur-sym', this.currencySymbol)
      localStorage.removeItem("shukran-currency-converter-data")
    }
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#chart-container-2 {
  position: relative;
  margin: auto;
  height: 40vh;
  min-width: 100%;
}
@media all and (device-width: 768px) and (device-height: 1024px) and (orientation:portrait) {
  #total-tips-chart { width: 300px !important; } /* your css rules for ipad portrait */
}
  .modal-buttons>* {
    border-radius: 3px;

    background-color: #c63968 !important;
    color: #fceedd;
  }

  .tip-modal {
    border-radius: 5px;
  }

  @media (max-width: 640px) {
    .modal-buttons>.uk-button {
      padding: 0 10px;
      font-size: 0.8rem;
    }

    textarea {
      height: 50px;
    }
  }
.uk-button {
  background-color: #c63968;
    color: #fceedd;
}
  .rqp-text {
    display: block;
    padding-top: 5px;
  }

  /** 
  total money chart js custom style

  https://www.chartjs.org/samples/latest/tooltips/custom-pie.html
*/
  #canvas-holder {
    width: 100%;
    margin-top: 50px;
    text-align: center;
  }

  #chartjs-tooltip {
    opacity: 1;
    position: absolute;
    background: rgba(0, 0, 0, .7);
    color: white;
    border-radius: 3px;
    -webkit-transition: all .1s ease;
    transition: all .1s ease;
    pointer-events: none;
    -webkit-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
  }

  /**
  .chartjs-tooltip-key
  https://github.com/vuejs/vue-loader/issues/559#issuecomment-545628323
 */
  #chartjs-tooltip>>>.chartjs-tooltip-key {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 10px;
  }


  .tip-details-header-section>ul {
    margin-top: 0px;
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

  .uk-navbar,
  .uk-navbar-item,
  .lead {
    background: transparent !important;
    color: #ffffff !important;
  }

  .uk-container-expand {
    color: #ebebe7 !important;
  }

  .uk-accordion-content {
    color: #ff6870 !important;
  }

  .show {
    color: #c63968;
  }

  .h3 {
    color: #ffffff;
  }

  .uk-offcanvas-bar {
    color: #fceedd;
  }

  .uk-card,
  .uk-card-title,
  .uk-heading-small {
    color: #666 !important;
    margin-top: 0px;
  }

  .uk-card,
  .uk-alert,
  .payout-modal {
    border-radius: 5px;
  }

  .payout-input,
  .payout-button {
    border-radius: 3px;
  }

  .payout-button[disabled="disabled"] {
    cursor: not-allowed;
  }

  .uk-alert {
    text-align: left;
  }

  .capitalize {
    text-transform: capitalize;
  }

  .uk-section {
    /* background-color: #fceedd !important; */
    color: #ff6870 !important;
  }

  .uk-label {
    background: #ff6870;
    color: #fceedd;
  }

  .uk-modal {
    background-color: #ff6870 !important;
    color: #fceedd;
  }

  #modal-middle {
    /* background-color: #fceedd; */
    color: #ff6870;
  }

  .red-button {
    background-color: #c63968 !important;
    color: #fceedd;
  }






/** ????? what is it doing here? */
  div[data-src][src*="data:image"] {
    background: rgba(0, 0, 0, 0.1);
  }



  /**https://stackoverflow.com/a/32186894 */

  .tippers-table {
    height: 725px;
    overflow-y: auto;
  }

  ul.metrics {
    margin-bottom: 25px;
  }

  ul.metrics>li {
    list-style: none;
  }

  li.li-available:before {
    content: "•";
    font-size: 450%;
    line-height: 0;
    margin: 0 0.3rem 0 -2rem;
    position: relative;
    top: 1.2rem;
    bottom: 0;
    color: rgb(79, 192, 116);
  }

  li.li-withdrawn:before {
    content: "•";
    font-size: 450%;
    line-height: 0;
    margin: 0 0.3rem 0 -2rem;
    position: relative;
    top: 1.2rem;
    bottom: 0;
    color: #329ba6;
  }

  .progress {
    height: 15px;
    width: 100%;
    display: flex;
    background-color: #329ba6;
    position: relative;
    border-radius: 500px;
  }

  .progress .value:before {
    content: attr(data-label);
    font-size: 0.8em;
    position: relative;
    text-align: center;
    top: -25px;
    left: 0;
  }

  .progress .value:nth-child(1) {
    color: rgb(79, 192, 116);
  }

  .progress .value:nth-child(2) {
    color: #329ba6;
  }

  .progress .value:nth-child(1) {
    background-color: rgb(79, 192, 116);
    border-radius: 500px 0 0 500px;
  }

  .progress .value:nth-child(2) {
    background-color: #329ba6;
    border-radius: 0 500px 500px 0;
  }

  .progress .value {
    display: block;
    height: 100%;
  }

  /**good spot */

  @media (min-width: 960px) {

    .uk-card-badge.uk-label[href] {
      display: none;
    }

    .chart-container {
      position: relative;
      height: 50vh;
    }
  }

  @media (max-width: 960px) {
    .uk-card-body {
      padding: 20px 20px;
    }

    .tippers-table {
      max-height: 520px;
      height: auto;
      overflow-y: auto;
    }

    .chart-container {
      position: relative;
      height: 40vh;
    }
  }

</style>
