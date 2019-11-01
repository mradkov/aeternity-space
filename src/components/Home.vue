<template>
  <div>
    <div>
      <div class="overlay-loader" v-show="showLoading">
        <BiggerLoader :progress="loadingProgress"></BiggerLoader>
      </div>
    </div>
    <div id="app-content" class="container mt-5">
      <h2>æternity AENS naming system</h2>
      <div class="container mt-5">
          <ae-badge>
            Explore AENS
          </ae-badge>
          <ae-switch
            name="example"
            :choices="[
              { label: 'Active auctions', value: 1 },
              { label: 'Finished auctions', value: 2 },
              { label: 'Claim name', value: 3 }
            ]"
            :default="1"
          />

        <div id="auctions">
          <div class="row">
            <label>Filter by Name:</label>
            <input type="text" class="form-control" v-model="filters.name.value"/>
          </div>
          
          <div class="row">
            <v-table
              :data="namesAuctionsActive"
              :filters="filters"
              class="table table-responsive table-bordered">
              <thead slot="head">
                  <th>Name</th>
                  <th>Expire at</th>
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
                      ~ 19:00:00 est {{ currentHeight }}
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
                },
                currentHeight: 162125
            }
        },
        methods: {
            filterLength (filterValue, row) {
              return row.length >= filterValue.min && row.length <= filterValue.max
            },
            transformTasksList(list) {
                return list.map(([id, task]) => {
                    return {...{id: id}, ...task};
                });
            },
            loading(status) {
              this.showLoading = status;
            },
            async getAuctionsActive() {
              this.loading(true);
              //Get a list of all the active name auctions
              this.$axios
                .get('https://mainnet.aeternal.io/middleware/names/auctions/active')
                .then(response => {
                  var parsedobj = JSON.parse(JSON.stringify(response))
                  this.namesAuctionsActive = (parsedobj.data)
                  this.namesAuctionsCount = parsedobj.data.length
                  this.loading(false);
                })
            },
            async getAuctionsActiveCount() {
              //Get a list of all the active name auctions count
              this.$axios
                .get('https://mainnet.aeternal.io/middleware/names/auctions/active/count')
                .then(response => {
                    var parsedobj = JSON.parse(JSON.stringify(response))
                    this.namesAuctionsCount = parsedobj.data.length
                })
            },
            async getCurrentHeight() {
               this.$axios
                .get('https://mainnet.aeternal.io/v2/key-blocks/current/height')
                .then(response => {
                    var parsedobj = JSON.parse(JSON.stringify(response))
                    this.currentHeight = parsedobj.data.length
                })
            }
        },
        async created() {
            // get auctions from middleware
            await this.getAuctionsActive();
            await this.getCurrentHeight();
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
</style>
