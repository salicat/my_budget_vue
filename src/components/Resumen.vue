<template>
    <div v-if="isLoading">
      <LottieAnimation :animationData="loadingAnimation" />
    </div>
    <b-container v-else fliud class="main">
        <b-modal ref="wellcome" hide-header content-class="modal"> 
            <div >
                <p>No informatión</p>
                <p> First go to Categories Tab and create your first category</p>
                <b-row>
                    <b-col cols="4">
                        <b-button v-on:click="go_to_cats" size="sm"> Go To Categories </b-button>
                    </b-col>
                    <b-col cols="4"></b-col>
                    <b-col cols="4">
                        <b-button v-on:click="go_to_registers" size="sm"> Go To Registers</b-button>
                    </b-col>
                </b-row> 
            </div>
        </b-modal>
        <b-row>
            <b-col cols="12" lg="6" sm="12">
                <div class="module">
                    <h3 class="act">Net Worth: ${{ Number(liabilities-passives).toLocaleString() }}</h3>
                    <p class="act"> Assets: ${{ Number(liabilities).toLocaleString() }} /  Liabilities: {{ Number(passives).toLocaleString() }}</p>
                    <bar-chart
                        horizontal
                        :stacked="true"
                        :colors="[ '#79FF00']" 
                        :data="[['Pasivos', passives],['Activos', liabilities]]"
                        :discrete="true"
                        prefix="$"
                        thousands=","
                        :legend="true"
                        ytitle="Valor"
                    ></bar-chart>
                </div>
            </b-col>
            <b-col cols="12" lg="6" sm="12">
                <div class="module">
                    <h3 class="act"> Total Expenses </h3>
                    <p class="act">Last 12 months</p>
                    <div class="chart-container">
                        <area-chart
                            :colors="['#00E8FF']"
                            label="Value"
                            :curve="true"
                            :discrete="true"
                            prefix="$"
                            thousands=","
                            :messages="{empty: 'No tienes datos aun'}"
                            :legend="false"
                            xtitle="Meses"
                            ytitle="Valor"
                            :data="history"
                            >
                        </area-chart>
                    </div>
                </div>
            </b-col>

        </b-row>
        <b-row>
            
        </b-row>
        <b-row >
            <b-col cols="12" class="module"> 
                <h3 class="act"> Current Month Budget ({{ month }})</h3>
                <div style="display:flex; flex-direction:row; justify-content: space-between;">   
                        <p v-bind:class="{  goo: expenses/gen_budget < 0.99999,
                                            act: expenses/gen_budget == 1,
                                            bad: expenses/gen_budget > 1                                
                                        }"> 
                            Spended: ${{Number(expenses).toLocaleString()}} 
                        </p>
                        <p v-bind:class="{  goo: gen_budget-expenses > 1,
                                            bad: gen_budget-expenses <= 0 }"> 
                            Budget: ${{Number(gen_budget).toLocaleString()}}
                        </p>    
                </div> 
                <div class="bar" style="width:100%; height: 40px;">
                    <div    v-bind:class="{perce_goo: expenses/gen_budget < 0.9999,
                                            perce_ok: expenses/gen_budget == 1,
                                            perce_bad: expenses/gen_budget > 1}"
                            :style="{
                                    width: (expenses/gen_budget*100)+'%'}"> 
                        <h2 >{{Math.round(expenses/gen_budget*100)}}%</h2>
                    </div>                                                                                                           
                </div>
                <br>
                <div v-if="expenses > gen_budget">
                    <h2 class="bad"> Budget Depleted!</h2>
                </div>  
            </b-col>
        </b-row>
        
        <b-row > 
            <b-col cols="12" lg="6" sm="12" class="module">   
                <div class="gastorta" v-if="expenses > 0" >
                    <h2 class="act"> Expenses Distribution </h2> 
                    <pie-chart
                        :donut  ="true"
                        :data   ="exp_pie"
                        :colors ="[     
                            '#00E8FF','#FF00E8','#E8FF00','#FF8C00',
                            '#8C00FF','#00FF8C','#FF008C','#008CFF','#E800FF',
                            '#00FFEA','#FFEA00','#EA00FF','#00FF4C','#4C00FF',
                            '#FF4C00','#00EAFF','#EAFF00'
                        ]"
                        :library="  {animation:{easing:'easeOutQuart'},
                        elements: {arc: {borderWidth: 0}},
                        }"
                        :legend="false"
                        loading="Loading..."
                        prefix="$"
                        thousands=","
                        >
                    </pie-chart>
                </div> 
            </b-col>
            <b-col cols="12" lg="6" sm="12" class="module">
                <div v-if="incomes && expenses == 0">
                    <p>No Information to display </p>
                </div>
                <div class="right">
                    <div v-if="incomes||expenses != 0" >
                        <h2 class="act">Incomes VS Expenses</h2>
                        <column-chart  
                             
                            :data="[['Ingresos', incomes], ['Gastos', expenses]]"
                            :colors="[['#79FF00', '#FF00D5']]"
                            :library="{animation:{easing:'easeOutQuad'}}"
                            loading="Loading..."
                            :stacked="true"
                            prefix="$"
                            thousands=","
                            >
                        </column-chart>                                
                    </div>    
                </div>
            </b-col>
        </b-row> 
        <b-row align-h="between">
            <b-col cols="12" md="4" sm="10">
                <h3 class="act">Check Previous Months</h3>
                <div class="date_request">
                        <b-form-select v-model="month" style="background-color:black; color: white;">                        
                            <option selected> {{month}} </option>
                            <option v-for="mes in meses" 
                                    :key="mes" > {{mes}} </option>  
                        </b-form-select>   
                        <select v-model="anio" style="background-color:black; color: white;">                        
                            <option selected> {{curr_year}} </option>
                            <option v-for="anio in anios" 
                                    :key="anio" > {{anio}} </option>
                        </select>      
                    <b-button class="button_request" v-on:click="reload" > Consultar </b-button>
                </div>
            </b-col>
        </b-row>     
        <b-row >
            <b-col cols="12" sm="12" md="6" lg="6" class="module">
                    <div v-if="recurrents.length < 1">
                        <p> Acá se visualizarán tus compromisos mensuales</p>
                    </div>
                    <b-col cols="12">
                        <div v-if="recurrents.length > 0">
                            <h3 class="act"> Payments {{month}} </h3>         
                        </div>
                        <b-row v-if="recurrents.length > 0">  
                            <b-col cols="5" lg="5"  style=" padding:3%;
                                                            margin: 3%;
                                                            font-size: 0.8em;"
                                                    v-for="item in recurrents" :key="item.name"
                                                    v-bind:class="{pagok: item.value >= 1,
                                                        pagofail: item.value <= 0}">
                                <p style="font-weight:bold;">
                                    {{item.category}} : ${{Number(item.budget).toLocaleString()}}
                                </p>
                                <p style="font-size:0.8em;">
                                    {{item.expires}}
                                </p>                                
                            </b-col> 
                        </b-row>
                    </b-col> 
            </b-col>
            <b-col cols="12" sm="12" md="6" lg="6" class="module">
                <div v-if="alertas.length < 1">
                    <p> No Info to Display</p>
                </div>
                <div class="left" v-if="alertas.length != 0">
                    <div class="left_title" >
                        <h3 class="act"> Expenses by Category </h3>
                        <b-button v-on:click="print()" class="button_request">Imprimir</b-button>
                    </div>
                    <div class="exp_cat" >                    
                        <div v-for="item in alertas" v-bind:key="item.name" v-if="item.value > 0">
                            <hr class="divider">                            
                            <div class="nombres">
                                <div class="act"> {{item.name}} </div>
                                <div v-bind:class="{    goo: (item.value/item.budget*100) < 99.99999,
                                                        act: (item.value/item.budget*100) == 100,
                                                        bad: (item.value/item.budget*100) > 100.00001
                                }"> 
                                    {{Math.round(item.value/item.budget*100)}}% </div> 
                            </div>                            
                            <div class="progres" >
                                <div class="bar" >
                                    <div v-bind:class="{perce_ok: item.value/item.budget < 0.9999,
                                                        perce_goo: item.value/item.budget == 1,
                                                        perce_bad: item.value/item.budget > 1}"  
                                                        :style="{
                                                        width: (item.value/item.budget*100)+'%'}"> 
                                        <p style="padding-left:10px;">${{Number(item.value).toLocaleString()}}</p>
                                    </div>                                                                                                           
                                </div>
                                <div class="budget">
                                    <p v-bind:class="{  goo: (item.value/item.budget*100) < 99.99999,
                                                        act: (item.value/item.budget*100) == 100,
                                                        bad: (item.value/item.budget*100) > 100
                                }" 
                                    > ${{Number(item.budget).toLocaleString()}} </p>
                                </div>                                                                
                            </div>
                        </div>
                    </div>
                </div>
            </b-col>     
        </b-row> 
    </b-container>                      
</template>

<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';
import Vue from 'vue'
import LottieAnimation from '@/components/LottieAnimation'; 
import loadingAnimation from '@/assets/loading.json';



export default {
    components: {
        Datepicker,
        LottieAnimation
    },    
    name: 'Resumen',
    data: function (){
        return {
            isLoading	: false, 
            loadingAnimation,
            assets      : 0,
            expenses    : 0,
            balance     : 0,
            history     : [],
            liabilities : 0,
            passives    : 0,
            incomes     : 0,
            gen_budget  : 0,
            cats        : [],
            regs        : [],
            alertas     : [],
            recurrents  : [],
            curr_year   : new Date().getFullYear(),
            curr_month  : new Date().getMonth(),
            curr_day    : undefined,
            month       : undefined,
            months      : [],
            exp_pie     : [],
            anio        : undefined,
            anios       : [2021, 2022, 2023, 2024, 2025],
            meses       : ['January', 'February', 'March', 'April', 'May', 
                            'June', 'July', 'August', 'September', 'October', 
                            'November', 'December']                        
        }
    },
    created: function(){       
    this.isLoading = true;                
    console.log(process.env.NODE_ENV);

    const today = new Date();
    today.toLocaleString('default', { month: 'long' });
    
    var n = today.getMonth();
    this.month = this.meses[n];

    var y = today.getFullYear();
    this.anio = y;

    var d = String(today.getDate()).padStart(2, '0');
    this.curr_day = d;

    var month_cons = this.meses.indexOf(this.month) + 1;

    var data = {
        username: this.$route.params.username,
        year: this.anio,
        month: month_cons
    };

    const url = window.location.hostname.includes("localhost") 
            ? "http://localhost:8000" 
            : "https://my-budget-back.onrender.com";

    let one   = `${url}/user/month_records/` + data.username + "/" + data.year + "/" + data.month;
    let two   = `${url}/user/cats/` + data.username;
    let three = `${url}/user/month_regs/` + data.username + "/" +  data.year + "/" + data.month;
    let four  = `${url}/user/cats/` + data.username + "/" + data.year + "/" + data.month;

    const requestOne   = axios.get(one);
    const requestTwo   = axios.get(two);
    const requestThree = axios.get(three);
    const requestFour  = axios.get(four);

    let self = this;                
    axios
      .all([ requestOne, requestTwo, requestThree, requestFour ])
      .then(axios.spread((...responses) => {                       
          const responseOne = responses[0];
          
          self.history = responseOne.data[1]

          const mes = function(date){
              if (!date) return ''; 
              let fecha = date.split("-");
              return fecha[1];
          };

          for (var i = 0; i < responseOne.data[0].length; i++){                
              if (mes(responseOne.data[0][i].date) == month_cons) {                    
                  if (responseOne.data[0][i].type == "incomes") {
                      this.incomes = this.incomes + responseOne.data[0][i].value;
                  }
                  if (responseOne.data[0][i].type == "expenses") {
                      this.expenses = this.expenses + responseOne.data[0][i].value;
                  }
              }                                                                                 
          }

          const ano = function (odate){
              if (!odate) return '';
              let anof = odate.split("-");
              return anof[0] + "-" + anof[1];
          };
          for (var m = 0; m < responseOne.data.length; m++){
              self.months = ano(responseOne.data[m].date);
          }
          
          const responseTwo = responses[1];                  
          for (var j = 0; j < responseTwo.data.liabilities.length; j++){
              this.liabilities = this.liabilities + responseTwo.data.liabilities[j].value;       
          }
          for (var k = 0; k < responseTwo.data.passives.length; k++){
              this.passives = this.passives + responseTwo.data.passives[k].value;
          }    
              
          const responseThree = responses[2];
          var estemes = month_cons.toString();
          var actualiza = function(date){
              if (!date) return '';
              var fecha = date.split("-");
              fecha[1] = estemes.padStart(2, '0');                
              var actualizada = fecha.join("-");
              return actualizada;                                 
          };
          for (var l = 0; l < responseThree.data.length; l++) {                
              if (mes(responseThree.data[l].expires) < month_cons) {
                  responseThree.data[l].expires = actualiza(responseThree.data[l].expires);
              }                
              self.recurrents[l] = responseThree.data[l];
          }
          
          const responseFour = responses[3];
          for (var b = 0; b < responseFour.data.length; b++){
              this.gen_budget = this.gen_budget + responseFour.data[b].budget;
              self.alertas[b] = responseFour.data[b];
              if (this.alertas[b].value > 0) {
                  self.exp_pie[b] = [this.alertas[b].name, this.alertas[b].value];           
              }
          }
        //   if (this.expenses == 0 && this.incomes == 0) {
        //       this.$refs['wellcome'].show();
        //   }
          this.isLoading = false;
      }))
      .catch((error) => {
          alert(error);
      });        
},
methods : {
    reload : function () {
        this.exp_pie = [];
        const today = new Date();
        today.toLocaleString('default', { month: 'long' });
        var new_month = today.getMonth(); 
        var month_cons = this.meses.indexOf(this.month) + 1;

        var datos = {
            username: this.$route.params.username,
            year: this.anio,
            month: month_cons
        };
        const url = window.location.hostname.includes("localhost") 
              ? "http://localhost:8000" 
              : "https://my-budget-back.onrender.com";

        let one   = `${url}/user/month_records/` + datos.username + "/" + datos.year + "/" + datos.month;
        let two   = `${url}/user/month_regs/`+ datos.username + "/" + datos.year + "/" +  datos.month;
        let four  = `${url}/user/cats/` + datos.username + "/" + datos.year + "/" + datos.month;
   
        const requestOne  = axios.get(one);
        const requestTwo  = axios.get(two);
        const requestFour = axios.get(four);
        
        let self = this;                
        axios
          .all([ requestOne, requestTwo, requestFour])
          .then(axios.spread((...responses) => {
              // Función que devuelve el mes de una fecha comprobando si es null
              const mes = function(date){
                  if (!date) return '';
                  let fecha = date.split("-");
                  return fecha[1];
              };
              const responseOne = responses[0];  
              this.expenses = 0;
              this.incomes = 0;
              for (var l = 0; l < responseOne.data[0].length; l++){
                  if (mes(responseOne.data[0][l].date) == month_cons) {
                      if (responseOne.data[0][l].type == "incomes") {
                          this.incomes = this.incomes + responseOne.data[0][l].value;
                      }
                      if (responseOne.data[0][l].type == "expenses") {
                          this.expenses = this.expenses + responseOne.data[0][l].value;
                      }
                  }                                                               
              }
              const responseTwo = responses[1];
              var estemes = new_month.toString();                
              var actualiza = function(date){
                  if (!date) return '';
                  var fecha = date.split("-");
                  fecha[1] = estemes.padStart(2, '0');                
                  var actualizada = fecha.join("-");
                  return actualizada;                                 
              };
              for (var l = 0; l < responseTwo.data.length; l++) {                
                  if (mes(responseTwo.data[l].expires) < new_month) {
                      responseTwo.data[l].expires = actualiza(responseTwo.data[l].expires);
                  }                
                  self.recurrents[l] = responseTwo.data[l];
              }
              const responseFour = responses[2];
              this.gen_budget = 0;
              for (var b = 0; b < responseFour.data.length; b++){
                  this.gen_budget = this.gen_budget + responseFour.data[b].budget;
              }    
              self.alertas = responseFour.data;
              for (var r = 0; r < this.alertas.length; r++){
                  if (this.alertas[r].value > 0) {
                      self.exp_pie[r] = [this.alertas[r].name, this.alertas[r].value];           
                  }
              }
          }));                           
    },
    go_to_cats: function () {
        if (this.$route.name != "Categorias") {
            let username = localStorage.getItem("current_username");
            this.$router.push({name: "Categorias", params: {username: username}});                
            this.open = false;
        }
    },
    go_to_registers: function () {
        if (this.$route.name != "Registros"){
            let username = localStorage.getItem("current_username");
            this.$router.push({name: "Registros", params: {username: username}});
            this.open = false;
        }
    },
    print() {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const content = `
            <html>
            <head>
                <title>Gastos por Categoría - ${this.curr_day} de ${this.month}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20%; background-color:black; color:white; }
                    h1 { text-align: center; }
                    .divider { border-top: 2px solid #000; margin: 10px 0; }
                    .nombres { display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; }
                    .progres { display: flex; flex-direction: column; margin: 10px 0; }
                    .bar { background-color: black; height: 45px; border-radius: 5px; position: relative; overflow: hidden; }
                    .bar div { height: 100%; line-height: 30px; color: white; font-weight: bold; padding-left: 10px; }
                    .perce_goo { background: green; }
                    .perce_ok { background: orange; }
                    .perce_bad { background: red; }
                    .budget { font-size: 16px; font-weight: bold; text-align: right; }
                </style>
            </head>
            <body>  
                <h1>Gastos por Categoría - ${this.curr_day} de ${this.month}</h1>
                ${this.alertas
                    .filter(item => item.value > 0)
                    .map(item => `
                        <hr class="divider">
                        <div class="nombres">
                            <div class="act">${item.name}</div>
                            <div>${Math.round((item.value / item.budget) * 100)}%</div>
                        </div>
                        <div class="progres">
                            <div class="bar">
                                <div class="${item.value / item.budget < 1 ? "perce_goo" : item.value / item.budget === 1 ? "perce_ok" : "perce_bad"}" 
                                    style="width: ${(item.value / item.budget) * 100}%">
                                    <p>${Number(item.value).toLocaleString()}</p>
                                </div>
                            </div>
                            <div class="budget">$${Number(item.budget).toLocaleString()}</div>
                        </div>
                    `)
                    .join("")}
                <hr class="divider">
                <div>
                    <div class="nombres">Total Gastado <strong> ${Number(this.expenses).toLocaleString()} </strong></div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    }
}
}
</script>
