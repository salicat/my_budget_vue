<template>
    <b-container fluid>
        <b-col cols="10" class="mx-auto" sm="12" style="border-radius: 10px;
                                            margin-top: 3%;
                                            margin-bottom: 5%;
                                            padding: 3%;  
                                            border:1px solid rgb(0, 107, 107); ">
            <div>
                <h1 >Los ingresos {{datos}}</h1> 
                <select  v-model="category"> 
                    <option v-for="cat in income_cats" :key="cat.id"> {{cat}} </option>
                </select>

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
            <h1>{{month}}</h1>

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
            category    : undefined,
            cats        : [],
            regs        : [],
            income_cats : [],
            selected    : [], 
            selectedAll : false,
            curr_year   : new Date().getFullYear(),
            curr_month  : new Date().getMonth(),
            curr_day    : undefined,
            month       : undefined,
            months      : [],
            datos       : [],
            anio        : 2022,
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
            month       : month_cons
        }               
        
        let one     = "http://localhost:8000/user/month_records/" + data.username + "/" + data.year + "/" + data.month
        let two     = "http://localhost:8000/user/cats/" + data.username

        const requestOne    = axios.get(one)
        const requestTwo    = axios.get(two)
        
        let self = this                
        axios
        .all([ requestOne, requestTwo])
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
                    if(!this.income_cats.includes(responseOne.data[t].category)){
                        this.income_cats.push(responseOne.data[t].category)
                    }                

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
                    self.cats = responseTwo.data["incomes"]
                }

            this.category = this.income_cats[0].category 
           
          
            
        })) 
        .catch((error) => {
            alert(error);
        });        
    },
    methods : {
        reload : function () {
            
            var month_cons = this.meses.indexOf(this.month) + 1;

            var datos = {
                username    : this.$route.params.username,
                year        : this.anio,
                month       : month_cons,
                category    : this.category
            }

            let one     = "http://localhost:8000/user/month_records/" + datos.username + "/" + datos.year + "/" + datos.month
            let two     = "http://localhost:8000/user/cats/" + datos.username
            let three   = "http://localhost:8000/user/track/" + datos.username + "/" + datos.month + "/" + datos.category
   
            const requestOne    = axios.get(one)
            const requestTwo    = axios.get(two)
            const requestThree  = axios.get(three)
            
            let self = this                
            axios
            .all([ requestOne, requestTwo, requestThree])
            .then(axios.spread((...responses) => {                
                

            }))                           
        }
    }
}
</script>
