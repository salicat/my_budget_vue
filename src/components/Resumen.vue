<template>
    <div id="Resumen">
        <div class="main">    
            <div class="barras">
                <h2>Mes: {{month}}</h2> 
                <select v-on:change="reload" v-model="month">
                    <option selected> {{month}} </option>
                    <option v-for="mes in meses" 
                            :key="mes" > {{mes}} </option>
                </select>
                <div>
                    <div class="chart">
                        <pie-chart 
                            :donut="true" 
                            :data="[['Ingresos', incomes], ['Egresos', expenses]]"
                            :colors="[ '#79FF00', '#FF00D5']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >
                        </pie-chart>                      
                        <h2>Ing: ${{incomes}} // Egr: ${{expenses}} </h2>
                    </div>
                </div>
                    <div class="fechas">
                        <div>
                        <!--     
                        <datepicker v-model="init_date" class="datepicker" :value="inicial" 
                                    name="fecha"                             
                                    @opened="datepickerOpened" 
                                    @selected="dateSelected" 
                                    @closed="datepickerClosed">                    
                        </datepicker>
                        Fecha de inicio
                        <p>{{init_date}}</p>
                        </div>
                        <div >
                            <datepicker v-model="final_date" class="datepicker" :value="final" 
                                        name="fecha"                             
                                        @opened="datepickerOpened" 
                                        @selected="dateSelected" 
                                        @closed="datepickerClosed">                    
                            </datepicker>
                            Fecha de final
                            <p>{{final_date}}</p>
                        -->
                        </div>                                         
                    </div>                
                </div>                       
                <div class="grafico_pdte">
                    <div class="chart">
                        <pie-chart 
                            :donut="true" 
                            :data="[['Activos', liabilities], ['Pasivos', passives]]"
                            :colors="[ '#00E8FF', '#FF8600']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >
                        </pie-chart>  
                    <h2> Activos: ${{liabilities}} // Pasivos: ${{passives}} </h2>
                    <h2> Patrimonio: ${{liabilities-passives}}</h2>
                    </div >
                </div>            
            </div>                                  
    </div>
    
</template>
<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';
import Vue from 'vue'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

Vue.use(Chartkick.use(Chart))

export default {
    components: {
        Datepicker        
    },    
    name: 'Resumen',
    data: function (){
        return {
            assets: 0,
            expenses: 0,
            balance: 0,
            liabilities: 0,
            passives: 0,
            incomes: 0,
            btc : null, 
            date: new Date(2021, 3, 24),
            cats: [],
            regs: [],
            month : undefined,
            meses : ['January', 'February', 'March', 'April', 'May', 
                    'June', 'July', 'August', 'September', 'October', 
                    'November', 'December']             
        }
    },
    created: function(){                       
        const today = new Date()
        today.toLocaleString('default', { month: 'long' })
        var n = today.getMonth();  
        this.month = this.meses[n]
        
        var month_cons = 1 + this.meses.indexOf(this.month);

        var data = {
            username    : this.$route.params.username,
            month       : month_cons
        }               
        
        let one = "http://127.0.0.1:8000/user/records/" + data.username 
        let two = "http://127.0.0.1:8000/user/cats/" + data.username
        
        const requestOne = axios.get(one)
        const requestTwo = axios.get(two)
        let self = this                
        axios
        .all([ requestOne, requestTwo ])
        .then(axios.spread((...responses) => {
            
            const responseOne = responses[0]            
            self.regs = responseOne.data                                            
            for (var i = 0; i < responseOne.data.length; i++){
                if ( responseOne.data[i].type == "incomes") {
                    this.incomes = this.incomes + responseOne.data[i].value;
                };
                if ( responseOne.data[i].type == "expenses") {
                    this.expenses = this.expenses + responseOne.data[i].value;
                };                                                                
            }
            
            const responseTwo = responses[1]       
            self.cats = responseTwo.data                      
            for (var j = 0; j < responseTwo.data.liabilities.length; j++){
                this.liabilities = this.liabilities + responseTwo.data.liabilities[j].value;       
            }
            for (var k = 0; k < responseTwo.data.passives.length; k++){
                this.passives = this.passives + responseTwo.data.passives[k].value
            }

        }))       
        .catch((error) => {
            alert(error);
        });        
    },       
    methods : {
        reload : function () {
            var month_cons = 1 + this.meses.indexOf(this.month);
            var data = {
                username    : this.$route.params.username,
                month       : month_cons
            }
            console.log(typeof data.username)
            console.log(typeof month_cons)
            let self = this
            axios
            .post("http://127.0.0.1:8000/user/month_regs/", data)  
            .then((response) => {
                console.log("Ba donnees : ",response.data)
                self.regs = response.data.length
                for (var i = 0; i < response.data.length; i++){
                if ( response.data[i].type == "incomes") {
                    this.incomes = this.incomes + response.data[i].value;
                };
                if ( response.data[i].type == "expenses") {
                    this.expenses = this.expenses + response.data[i].value;
                };                                                                
            }
            })
            .catch((error) => {
                alert(data.username + " " + data.month)
                console.log(error.response.data);

            })        
        },
        price : function () {
            let self = this
            axios
            .get("https://api.coindesk.com/v1/bpi/currentprice.json")
            .then((response) => {
                self.btc = response.data.bpi.USD.rate_float
            })
        },
        datepickerOpened : function (){
            console.log("opened")
        },
        dateSelected :  function () {
            console.log("date selected")
        },
        datepickerClosed : function () {

        },
        customFormatter (date) {
            return moment(date).format('d, MM, yyyy');
        }   
    } 
}
</script>
<style>
.main{
    display: flex;
    flex-direction: row;
    width: 100%;       
}
.fechas{
    display: flex;
    flex-direction: row;
}
.barras{
    min-width: 50%;
    overflow: auto;    
}
.grafico_pdte{
    min-width: 50%;    
}
.grafico_pdte h2{
    text-align: center;
}
.datepicker{
    font-family: arial;
    color: black;
}

</style>