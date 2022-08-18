<template>
    <b-container fluid>
        <b-col cols=8>
                    <b-form-select v-model="month" style="background-color:black; color: white;">                        
                        <option selected> {{month}} </option>
                        <option v-for="mes in meses" 
                                :key="mes" > {{mes}} </option>  
                    </b-form-select>   
                </b-col>
        <b-col cols=19>
            <select v-model="anio" style="background-color:black; color: white;">                        
                <option selected> {{curr_year}} </option>
                <option v-for="anio in anios" 
                        :key="anio" > {{anio}} </option>
            </select>
        </b-col>
        <b-col cols=8>
            <b-button variant="dark" v-on:click="reload" > Consultar </b-button>
        </b-col>
        <b-col cols="10" class="mx-auto" sm="12" style="border-radius: 10px;
                                            margin-top: 3%;
                                            margin-bottom: 5%;
                                            padding: 3%;  
                                            border:1px solid rgb(0, 107, 107); ">
            <div>
                <h1>Variaciones {{datos}} </h1>
                <line-chart :colors="['#00E8FF']"
                            label="Value"    
                            :curve="true"                         
                            :discrete="true"
                            prefix="$"
                            thousands=","
                            :messages="{empty: 'Selecciona la categoria'}"
                            :legend="false"
                            xtitle="Meses" ytitle="Valor"   
                            :data="datos">
                </line-chart>
            </div>
        </b-col>
        <b-col>
            <h1>{{incomes}}</h1>
            <h1>{{months}}</h1>
            <h1>{{cats}}</h1>
        </b-col>
        <b-col cols="10" class="mx-auto" sm="4" style="border-radius: 10px;  
                                            margin-top: 3%;
                                            padding: 3%;
                                            border:1px solid rgb(0, 107, 107);">
                <div class="right">
                    <div>
                        <h2 class="act">Ingresos Vs Egresos</h2>
                        <column-chart        
                            :data="[['Ingresos', incomes], ['Gastos', expenses]]"
                            :colors="[['#79FF00', '#FF00D5']]"
                            :library="{animation:{easing:'easeOutQuad'}}"
                            >
                        </column-chart>                                
                    </div>    
                </div>
            </b-col>
    </b-container>
</template>
<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';
import Vue from 'vue'
import Chart from 'chart.js'
import VueChartkick from 'vue-chartkick'

Vue.use(Chartkick.use(Chart))


export default {
    components: {
        Datepicker
    },    
    name: 'Resumen',
    data: function (){
        return {
            expenses    : 0,
            incomes     : 0,
            gen_budget  : 0,
            cats        : [],
            regs        : [],
            alertas     : [],
            income_cats : [],
            curr_year   : new Date().getFullYear(),
            curr_month  : new Date().getMonth(),
            curr_day    : undefined,
            month       : undefined,
            months      : [],
            exp_pie     : [],
            datos       : [],
            anio        : undefined,
            anios       : [2021, 2022],
            meses       : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 
                            'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 
                            'Noviembre', 'Diciembre']                        
        }
    },
    created: function(){                       

        const today = new Date()
        today.toLocaleString('default', { month: 'long' })
        
        var n = today.getMonth();
        this.month = this.meses[n]

        var y = today.getFullYear();
        this.anio = y

        var d = String(today.getDate()).padStart(2, '0');
        this.curr_day = d

        var month_cons = this.meses.indexOf(this.month) + 1;

        var data = {
            username    : this.$route.params.username,
            year        : this.anio,
            month       : month_cons,
            category    : 'Alimentacion'
        }               
        
        let one     = "https://mybudgetback.herokuapp.com/user/month_records/" + data.username + "/" + data.year + "/" + data.month
        let two     = "https://mybudgetback.herokuapp.com/user/cats/" + data.username
        let three   = "https://mybudgetback.herokuapp.com/user/track/"+ data.username + "/" + data.month + "/Intereses pagares" 

        const requestOne    = axios.get(one)
        const requestTwo    = axios.get(two)
        const requestThree  = axios.get(three)
        
        let self = this                
        axios
        .all([ requestOne, requestTwo, requestThree])
        .then(axios.spread((...responses) => {                       
            const responseOne = responses[0]                                        
                
            const mes = function(date){
                let fecha = date.split("-");
                return fecha[1]
            }            
            for (var i = 0; i < responseOne.data.length; i++){                
                if (mes(responseOne.data[i].date) == month_cons) {                    
                    if ( responseOne.data[i].type == "incomes") {
                    this.incomes = this.incomes + responseOne.data[i].value;
                };
                if ( responseOne.data[i].type == "expenses") {
                    this.expenses = this.expenses + responseOne.data[i].value;
                };
                }                                                                                 
            }
            for(var t = 0; t < responseOne.data.length; t++){
                if(responseOne.data[t].type == "incomes"){
                    self.income_cats = responseOne.data[t]
                }   
            }

            const ano = function (odate){
                let anof = odate.split("-")
                return "" +anof[0] +"-"+ anof[1]
            }
            for(var m = 0; m < responseOne.data.length; m++){
                self.months = ano(responseOne.data[m].date)
            }

            const responseTwo = responses[1]                  
            
            for (var t = 0; t < responseTwo.data["incomes"].length; t++){
                    self.cats = responseTwo.data.incomes[t]
                }

            const responseThree = responses[2]
            self.datos = responseThree.data
        })) 
        .catch((error) => {
            alert(error);
        });        
    },
    methods : {
        reload : function () {
            this.exp_pie = []
            const today = new Date()
            today.toLocaleString('default', { month: 'long' })
            var new_month = today.getMonth(); 
            var month_cons = this.meses.indexOf(this.month) + 1;

            var datos = {
                username    : this.$route.params.username,
                year        : this.anio,
                month       : month_cons
            }

            let one     = "https://mybudgetback.herokuapp.com/user/month_records/" + datos.username + "/" + datos.year + "/" + datos.month
            let two     = "https://mybudgetback.herokuapp.com/user/month_regs/"+ datos.username + "/" + datos.year + "/" +  datos.month
            let four    = "https://mybudgetback.herokuapp.com/user/cats/" + datos.username + "/" +datos.year + "/" + datos.month
   
            const requestOne    = axios.get(one)
            const requestTwo    = axios.get(two)
            
            let self = this                
            axios
            .all([ requestOne, requestTwo])
            .then(axios.spread((...responses) => {                
                const mes = function(date){
                    let fecha = date.split("-");
                    return fecha[1]
                    }                
                const responseOne = responses[0]  
                this.expenses =  0;
                this.incomes = 0;
                for (var l = 0; l < responseOne.data.length; l++){
                    if (mes(responseOne.data[l].date) == month_cons) {
                        if (responseOne.data[l].type == "incomes") {
                        this.incomes = this.incomes + responseOne.data[l].value;
                        };
                        if ( responseOne.data[l].type == "expenses") {
                            this.expenses = this.expenses + responseOne.data[l].value;
                        };
                    }                                                               
            }
            const responseTwo = responses[1]
            var estemes = new_month.toString()                
            var actualiza = function(date){
                var fecha = date.split("-");
                fecha[1] = "0"+estemes;                
                var actualizada = fecha[0]+"-"+fecha[1]+"-"+fecha[2];                
                return actualizada;                                 
            }
            for (var l = 0; l < responseTwo.data.length; l++) {                
                if (mes(responseTwo.data[l].expires) < new_month) {
                    responseTwo.data[l].expires = actualiza(responseTwo.data[l].expires)
                }                
                self.recurrents[l] = responseTwo.data[l]
            }        
            const responseFour = responses[2]
            this.gen_budget = 0;
                for (var b = 0; b < responseFour.data.length; b++){
                    this.gen_budget = this.gen_budget + responseFour.data[b].budget;
                }    
                self.alertas = responseFour.data
            for (var r = 0; r < this.alertas.length; r++){
                if (this.alertas[r].value > 0) {
                        self.exp_pie[r] = [this.alertas[r].name, this.alertas[r].value]           
                    }
            }
            }))                           
        }
    }
}
</script>
<style>
</style>