<template>
  <div>
    <div>
      <div class="overlay-loader" v-show="showLoading">
        <BiggerLoader :progress="loadingProgress"></BiggerLoader>
      </div>
    </div>
    <div id="app-content" class="mt-5">
      <div class="container">
        <div class="row">
          <h2 class="h2">æternity AENS naming system</h2>
        </div>
      </div>
      <div class="container mt-5">
          <ae-badge>
            Explore AENS
          </ae-badge>
          <ae-divider />
          <ae-switch
            name="example"
            :choices="[
              { label: 'Active auctions', value: 1 },
              { label: 'Finished auctions', value: 2 },
              { label: 'Claim name', value: 3 }
            ]"
            :default="1"
            v-model="switchState"
          />

        <div class="container" id="auctions">
          <h4 class="h4">Filters</h4>
          <div class="row">
 <div class="col-md-6">
            <ae-label>name</ae-label>
            <ae-input
              v-model="filters.name.value"
            />
          </div>

          <div class="col-md-6">
              <ae-label>length</ae-label>
              <div class="range-slider" @change="slide">
                <div class="d-flex justify-content-center my-4">
                  <span class="font-weight-bold indigo-text mr-2 mt-1">from {{ filters.filterLength.value.min }}</span>
                  <form class="range-field w-100">
                    <input 
                      @change="slide" 
                      v-model="filters.filterLength.value.min"
                      :min="1"
                      :max="99"
                      :step="slider.step"
                      type="range" />
                    <input
                      @change="slide"
                      v-model="filters.filterLength.value.max"
                      :min="filters.filterLength.value.min"
                      :max="99"
                      :step="slider.step"
                      type="range" /> 
                  </form>
                  <span class="font-weight-bold indigo-text ml-2 mt-1">to {{ filters.filterLength.value.max }}</span>
                </div>
              </div>
          </div>
          </div>
          
          <div class="row">
            <!-- active auctions -->
            <div v-if="switchState == 1" class="col-md-12 mt-5">
              <v-table
                :data="namesAuctionsActive"
                :filters="filters"
                :currentPage.sync="currentPage"
                :pageSize="10"
                @totalPagesChanged="totalPages = $event"
                class="table table-responsive table-bordered">
                <thead slot="head">
                    <th>Name</th>
                    <th>Expires at</th>
                    <th>Winning bid</th>
                    <th>Highest bidder</th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="row in displayData" :key="row.id">
                      <td>
                        <ae-text face="mono-base">
                          {{ row.name }}
                        </ae-text>
                      </td>
                      <td>
                        Block: 
                        {{ row.expiration }}
                        ~ {{ calculateEndDate(row.expiration) }}
                      </td>
                      <td>{{ (row.winning_bid * Math.pow(10,-18)).toFixed(2) }} AE</td>
                      <td>
                        <tr class="tr-noborder">
                          <td>
                            <ae-identicon :address="row.winning_bidder" size="xs" />
                          </td>
                          <td>
                            <ae-address
                              length='short'
                              :value="row.winning_bidder"
                            />
                          </td>
                        </tr>
                      </td>
                    </tr>
                </tbody>
              </v-table>

              <smart-pagination
                :currentPage.sync="currentPage"
                :totalPages="totalPages"
              />

            </div>

            <!-- finished auctions -->
            <div v-if="switchState == 2" class="mt-5">

              <v-table
                :data="allNames"
                :filters="filters"
                :currentPage.sync="currentPage"
                :pageSize="10"
                @totalPagesChanged="totalPages = $event"
                class="table table-responsive table-bordered">
                <thead slot="head">
                    <th>Name</th>
                    <th>Expires at</th>
                    <th>Winning bid</th>
                    <th>Highest bidder</th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="row in displayData" :key="row.id">
                      <td>
                        <ae-text face="mono-base">
                          {{ row.name }}
                        </ae-text>
                      </td>
                      <td>
                        Block: 
                        {{ row.expiration }}
                        ~ {{ calculateEndDate(row.expiration) }}
                      </td>
                      <td>{{ (row.winning_bid * Math.pow(10,-18)).toFixed(2) }} AE</td>
                      <td>
                        <tr class="tr-noborder">
                          <td>
                            <ae-identicon :address="row.winning_bidder" size="xs" />
                          </td>
                          <td>
                            <ae-address
                              length='short'
                              :value="row.winning_bidder"
                            />
                          </td>
                        </tr>
                      </td>
                    </tr>
                </tbody>
              </v-table>

              <smart-pagination
                :currentPage.sync="currentPage"
                :totalPages="totalPages"
              />

            </div>

            <!-- claim name -->
            <div v-if="switchState == 3" class="mt-5">
              claim name
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import 'prismjs'
    import 'prismjs/themes/prism.css'
    import 'prismjs/components/prism-reason.min.js'
    import 'vue-prism-editor/dist/VuePrismEditor.css' // import the styles
    import PrismEditor from 'vue-prism-editor'

    import {Universal} from '@aeternity/aepp-sdk/es/ae/universal'
    import * as Crypto from '@aeternity/aepp-sdk/es/utils/crypto'

    import BiggerLoader from './BiggerLoader'
    import * as InputSpinner from 'vue-number-input-spinner'

    export default {
        name: 'Home',
        components: {
            PrismEditor,
            BiggerLoader,
            InputSpinner
        },
        data() {
            return {
                showLoading: true,
                loadingProgress: "gathering data",
                names: [],
                namesAuctionsActive: [],
                namesAuctionsCount: null,
                filters: {
                  name: { value: '', keys: ['name'] },
                  filterLength: { value: { min: 1, max: 99 }, custom: this.filterLength }
                },
                currentHeight: 162125,
                switchState: 1,
                slider: {
                  step: "1"
                },
                currentPage: 1,
                totalPages: 0,
                allNames: []
            }
        },
        methods: {
            slide() {
              if (this.filters.filterLength.min > this.filters.filterLength.max) {
                var tmp = this.filters.filterLength.max;
                this.filters.filterLength.max = this.filters.filterLength.min;
                this.filters.filterLength.min = tmp;
              }
            },
            filterLength (filterValue, row) {
              let suffix = ".chain".length;
              let nameLength = row.name.length - suffix;
              return nameLength >= filterValue.min && nameLength <= filterValue.max
            },
            transformTasksList(list) {
                return list.map(([id, task]) => {
                    return {...{id: id}, ...task};
                });
            },
            calculateEndDate(endBlock) {
              return (endBlock - this.currentHeight) < 0 ? 'ended' : this.formatDate(new Date(new Date().getTime() + (endBlock - this.currentHeight)*3*60000));
            },
            appendLeadingZeroes(n){
              if(n <= 9){
                return "0" + n;
              }
              return n
            },
            formatDate(d) {
              let format_date =
                  d.getFullYear() + "-" + 
                  this.appendLeadingZeroes(d.getMonth() + 1) + "-" +
                  this.appendLeadingZeroes(d.getDate()) + " " +
                  this.appendLeadingZeroes(d.getHours()) + ":" +
                  this.appendLeadingZeroes(d.getMinutes());
              return format_date;
            },
            loading(status) {
              this.showLoading = status;
            },
            saveAuctions() {
              localStorage.setItem('auctions-active', this.namesAuctionsActive);
            },
            async getAllNames() {
              this.$axios
                .get('https://mainnet.aeternal.io/middleware/names?limit=20&page=1')
                .then(response => {
                    var parsedobj = JSON.parse(JSON.stringify(response))
                    this.allNames = parsedobj.data
                })
            },
            getAuctions() {
              return localStorage.getItem('auctions-active');
            },
            async getAuctionsActive(count = null) {
              this.loading(true);
              //Get a list of all the active name auctions

              if (count && count > 0) {
                this.$axios
                  .get(`https://mainnet.aeternal.io/middleware/names/auctions/active?limit=${count}`)
                  .then(response => {
                    var parsedobj = JSON.parse(JSON.stringify(response))
                    this.namesAuctionsActive = (parsedobj.data)
                    this.namesAuctionsCount = parsedobj.data.length
                    this.saveAuctions();
                    this.loading(false);
                  })
              }
              else {
                 this.$axios
                  .get('https://mainnet.aeternal.io/middleware/names/auctions/active')
                  .then(response => {
                    var parsedobj = JSON.parse(JSON.stringify(response))
                    this.namesAuctionsActive = (parsedobj.data)
                    this.namesAuctionsCount = parsedobj.data.length
                    this.saveAuctions();
                    this.loading(false);
                  })
              }
            },
            async getAuctionsActiveCount() {
              //Get a list of all the active name auctions count
              this.$axios
                .get('https://mainnet.aeternal.io/middleware/names/auctions/active/count')
                .then(response => {
                    var parsedobj = JSON.parse(JSON.stringify(response))
                    this.namesAuctionsCount = parsedobj.data.count
                })
            },
            async getCurrentHeight() {
               this.$axios
                .get('https://mainnet.aeternal.io/v2/key-blocks/current/height')
                .then(response => {
                    var parsedobj = JSON.parse(JSON.stringify(response))
                    this.currentHeight = parsedobj.data.height
                })
            }
        },
        async created() {
            // get auctions from middleware
            await this.getAuctionsActive(10);
            await this.getCurrentHeight();
            this.getAllNames();
        },
    }
</script>

<style>
  tr.tr-noborder td {
    border: 0;
  }

  #app-content {
    max-width: 1200px;
    padding: 0 20px 20px;
  }

  .errors div {
    padding: 0.5rem 1rem;
    background: rgba(255, 0, 0, 0.6);
    color: white;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    text-align: left;
  }

  .errors div::before {
    content: "!";
    font-size: 2rem;
    font-weight: bold;
    margin-right: 1rem;
  }

  .overlay-loader {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 150px;
    background-color: rgba(255, 255, 255, 0.85);
    overflow: hidden;
  }

  input.ae-input {
    box-sizing: border-box;
  }

  .ae-check-button::after {
    top: 2px !important;
    left: 7px !important;
    background-size: 1rem !important;
  }

  .non-completed-task {
    width: 100%;
    text-align: start;
  }

  #next-status-button {
    padding: 0 0.8rem;
    height: 40px;
    float: right;
  }

  .status-label {
    padding: 5px;
    border-radius: 5px;
  }

  .status-label.InProgress {
    background-color: yellow;
  }

  .status-label.ReadyForReview {
    color: white;
    background-color: blue;
  }

  .status-label.ToBeDeployed {
    background-color: limegreen;
  }

  .range-slider {
  width: 300px;
  margin: auto;
  text-align: center;
  position: relative;
  height: 6em;
}

.range-slider svg,
.range-slider input[type=range] {
  position: absolute;
  left: 0;
  bottom: 0;
}

input[type=number] {
  border: 1px solid #ddd;
  text-align: center;
  font-size: 1.6em;
  -moz-appearance: textfield;
}

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type=number]:invalid,
input[type=number]:out-of-range {
  border: 2px solid #ff6347;
}

input[type=range] {
  -webkit-appearance: none;
  width: 100%;
}

input[type=range]:focus {
  outline: none;
}

input[type=range]:focus::-webkit-slider-runnable-track {
  background: #f03c6e;
}

input[type=range]:focus::-ms-fill-lower {
  background: #f03c6e;
}

input[type=range]:focus::-ms-fill-upper {
  background: #f03c6e;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  animate: 0.2s;
  background: #f03c6e;
  border-radius: 1px;
  box-shadow: none;
  border: 0;
}

input[type=range]::-webkit-slider-thumb {
  z-index: 2;
  position: relative;
  box-shadow: 0px 0px 0px #000;
  border: 1px solid #f03c6e;
  height: 18px;
  width: 18px;
  border-radius: 25px;
  background: #f03c6e;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7px;
}

</style>
