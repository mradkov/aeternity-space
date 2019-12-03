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
          <h2 class="h2">æternity space</h2>
        </div>
      </div>
      <div class="container mt-5">
          <ae-badge>
            Explore aeternity tech stack
          </ae-badge>
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
            }
        },
        methods: {
            loading(status) {
              this.showLoading = status;
            },
            async getAllNames() {
              this.$axios
                .get('https://mainnet.aeternal.io/middleware/names?limit=20&page=1')
                .then(response => {
                    var parsedobj = JSON.parse(JSON.stringify(response))
                    this.allNames = parsedobj.data
                })
            },
        },
        async created() {
            // get auctions from middleware
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
