<template>
    <div id="Resumen">
        <div class="main">    
            <div class="barras">
                <h2>Estas Barritas son de Ejemplo</h2> 
                <div >
                    <column-chart 
                        :data="[['Gatito', 195000], ['Mercadillo', 750000], ['Renta Apto', 950000]]"
                        :library="{animation:{easing:'easeOutQuad'}}"
                        >
                    </column-chart>
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
                            :data="[['Ingresos', incomes], ['Egresos', expenses]]"
                            :colors="[ '#28FF00', '#FF000A']"
                            :library="{animation:{easing:'easeOutQuad'}, 
                            elements: {arc: {borderWidth: 0}}}"
                            >
                        </pie-chart>  
                    <h2>Ing: ${{incomes}} // Egr: ${{expenses}} </h2>
                    </div >
                </div>            
            </div>            
            <div>          
                <h2 > BTC/USD Price = </h2>
                <h1> ${{btc}} USD</h1>
                <button v-on:click="price"> Get! </button>   
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
            valores: [25, 69]             
        }
    },
    created: function(){                
        this.username = this.$route.params.username        
        let self = this
        let one = "http://127.0.0.1:8000/user/records/" +  this.username
        let two = "http://127.0.0.1:8000/user/cats/" + this.username
        const requestOne = axios.get(one)
        const requestTwo =axios.get(two)
        
        axios.all([ requestOne, requestTwo ])
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
        }))       
        .catch((error) => {
            alert(responses.error);
        });        
    },       
    methods : {
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