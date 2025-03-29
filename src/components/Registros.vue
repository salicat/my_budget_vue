<template>
	<div v-if="isLoading">
      <LottieAnimation :animationData="loadingAnimation" />
    </div>
    <b-container v-else fluid>
      <b-row>
        <!-- Contenedor para "Variaciones en Gastos" -->
        <b-col cols="12" class="module">
          <div v-if="cats.expenses.length > 0">
            <h1>Variaciones en Gastos</h1>
            <select v-model="track" v-on:change="track_months">
              <option v-for="cat in cats.expenses" v-bind:key="cat.name">
                {{cat.category}}
              </option>
            </select>
			<div class="chart-container">
				<area-chart
					:colors="['#00E8FF']"
					label="Value"
					:curve="true"
					:discrete="true"
					prefix="$"
					thousands=","
					:messages="{empty: 'Selecciona la categoria'}"
					:legend="false"
					xtitle="Meses"
					ytitle="Valor"
					:data="datos"
					:library="chartOptions"
					>
				</area-chart>
			</div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <!-- Contenedor para "Registrar Transacción" -->
		<b-col cols="12" sm="12" md="6" lg="6" class="module">
			<div class="form-container">
				<h2 class="form-title">Registrar Transacción</h2>

				<!-- Selección de Tipo de Transacción -->
				<div class="form-group">
					<label for="type">Tipo de Transacción</label>
					<select id="type" v-model="type" class="form-select">
						<option value="">Selecciona...</option>
						<option value="incomes">Ingreso</option>
						<option value="expenses">Egreso</option>
					</select>
				</div>

				<!-- Mostrar método de registro SOLO si es un egreso -->
				<div v-if="type === 'expenses'" class="form-group">
					<label>¿Cómo deseas registrar la transacción?</label>
					<select id="reg_mode" v-model="expenseMethod" class="form-select">
						<option value="">Selecciona...</option>
						<option value="ticket">Subir Ticket de Compra</option>
						<option value="manualEntry">Registrar Manualmente</option>
					</select>
				</div>

				<!-- Si se elige "Subir Ticket" -->
				<div v-if="expenseMethod === 'ticket'" class="form-group">
					<b-button class="form-button" @click="triggerFileInput">Subir Tiquet de Compra</b-button>
					<input
						type="file"
						ref="ticketFile"
						style="display: none"
						accept="image/*"
						@change="uploadTicket"
					/>
					<button @click="save_reg" class="form-button">Guardar Registro</button>
				</div>

				<!-- Si se elige "Ingreso" o "ManualEntry" en "Egreso" -->
				<div v-if="type === 'incomes' || expenseMethod === 'manualEntry'">
					<div class="form-group">
						<label for="category">Categoría de Egreso</label>
						<select id="category" v-model="category" class="form-select">
							<option v-for="cat in cats.expenses" :key="cat.category" :value="cat.category">
							{{ cat.category }}
							</option>
						</select>
					</div>
					<div class="form-group">
						<label for="descripcion">Descripción</label>
						<input id="descripcion" v-model="descripcion" type="text" class="form-input" placeholder="Descripción">
					</div>
					<div class="form-group">
						<label for="value">Valor</label>
						<input id="value" v-model="value" type="number" class="form-input" placeholder="0.00">
					</div>
					<div class="form-group">
						<label for="day">Fecha</label>
						<input id="day" v-model="day" type="date" class="form-input">
					</div>
					<button @click="save_reg" class="form-button">Guardar Registro</button>
				</div>
			</div>
		</b-col>

        <!-- Contenedor para "Consultar Registros" -->
        <b-col cols="12" sm="12" md="6" lg="6" class="module">
          <h2 class="act">Consultar Registros</h2>
          <b-row class="botones" align-h="between">
            <b-col cols="12" sm="8">
              <div class="date_request">
                <b-form-select v-model="month" style="background-color:black; color: white;">
                  <option v-for="mes in meses" :key="mes">
                    {{mes}}
                  </option>
                </b-form-select>
                <b-form-select v-model="year" style="background-color:black; color: white;">
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </b-form-select>
                <b-button v-on:click="get_regs" class="button_request">Consultar</b-button>
              </div>
            </b-col>
            <b-col cols="6">
              <b-button v-if="selected.length" v-on:click="reg_del" variant="dark">Eliminar</b-button>
            </b-col>
          </b-row>
          <b-row>
            <h2 class="act">Mis Registros</h2>
            <table class="registered">
                <thead>
                    <tr>
                    <th>
                        <input type="checkbox" v-model="selectedAll" v-on:click="select">
                    </th>
                    <th class="act">Categoría</th>
                    <th class="act">Descripción</th>
                    <th class="act">Valor</th>
                    <th class="act">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="reg in registers" :key="reg.id" v-bind:class="{ goo: reg.type == 'incomes', bad: reg.type == 'expenses', pas: reg.type == 'passives', act: reg.type == 'liabilities' }">
                    <td>
                        <input type="checkbox" :value="reg.id" v-model="selected">
                    </td>
                    <td class="right_col">{{reg.category}}</td>
                    <td>{{reg.description}}</td>
                    <td>${{Number(reg.value).toLocaleString()}}</td>
                    <td>{{reg.date}}</td>
                    </tr>
                </tbody>
            </table>
          </b-row>
        </b-col>
      </b-row>
	  <b-modal id="ticketModal" v-model="showTicketModal" title="Datos del Tiquet" size="lg" hide-footer>
		<div v-if="isLoading">
			<LottieAnimation :animationData="loadingAnimation" />
		</div>
		<div v-else-if="extractedData && extractedData.length">
			<h5>Datos extraídos del tiquet:</h5>
			<table class="table table-sm">
			<thead>
				<tr>
				<th>Categoría</th>
				<th>Descripción</th>
				<th>Valor</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item, idx) in extractedData" :key="idx">
				<td>{{ item.category || '-' }}</td>
				<td>{{ item.description }}</td>
				<td>{{ item.value }}</td>
				</tr>
			</tbody>
			</table>
			<hr>
			<div class="form-group">
			<label><strong>Valor total:</strong></label>
			<input type="number" step="any" class="form-control" v-model="ticket_data[0].value" />
			</div>
			<div class="form-group">
			<label><strong>Asignar Categoría:</strong></label>
			<select v-model="ticket_data[0].category" class="form-select">
				<option v-for="cat in cats.expenses" :key="cat.category" :value="cat.category">
				{{ cat.category }}
				</option>
			</select>
			</div>
		</div>
		<div v-else>
			<p>No hay datos extraídos para mostrar.</p>
		</div>
		<div class="modal-footer">
			<b-button variant="secondary" @click="showTicketModal = false">Cerrar</b-button>
			<b-button variant="primary" @click="confirmTicketData">Guardar registro</b-button>
		</div>
		</b-modal>
    </b-container>
  </template>
  
  
<script>
import axios from "axios";
import LottieAnimation from '@/components/LottieAnimation'; 
import loadingAnimation from '@/assets/loading.json';

export default {
    name: "Registros", 
    components: {
		LottieAnimation
	},
    data: function (){
        return {
			isLoading	: false, 
            loadingAnimation,
            username    : localStorage.getItem('current_username'),
            category    : "",
            day         : "",
            type        : "",
            descripcion : "",
            value       : 0,
			expenseMethod : '',
            cats		: { expenses: [] },
      		track		: "",
            registers   : [],
            selected    : [], 
            selectedAll : false,
            id          : undefined,
            month       : undefined,
            alertas     : [],
            datos       : [],
            year        : [2021, 2022, 2023, 2024, 2025],
            meses       : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 
                        'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 
                        'Noviembre', 'Diciembre'],
			showTicketModal	: false,   
			extractedData	: [],      
			ticket_data    	: []            
        };       
    },
	created: function() {
		this.isLoading = true;    
		this.username = localStorage.getItem("current_username");
		var self = this;            
		const url = window.location.hostname.includes("localhost") 
		? "http://localhost:8000" 
		: "https://my-budget-back.onrender.com";

		axios            
		.get(`${url}/user/cats/` + this.username)
		.then((response) => {                
			this.cats = response.data;
			if (this.cats.expenses) {
				this.cats.expenses.sort((a, b) => a.category.localeCompare(b.category));
			}
			this.isLoading = false;    
		})            
	},
	mounted() {
		const url = window.location.hostname.includes("localhost") 
		? "http://localhost:8000" 
		: "https://my-budget-back.onrender.com";

		axios.get(`${url}/user/cats/` + this.username)
		.then((response) => {
			this.cats = response.data;
			this.cats.expenses.sort((a, b) => a.category.localeCompare(b.category));

			// Asignar la primera categoría automáticamente
			if (this.cats.expenses.length > 0) {
			this.track = this.cats.expenses[0].category;
			this.track_months(); // Llamar la función con la primera categoría
			}
		});
	},
    methods:{
        get_regs: function (){            
            
            var month_cons = this.meses.indexOf(this.month) + 1;

            var data = {
            username    : this.$route.params.username,
            year        : this.year,
            month       : month_cons
            }  
            const url = window.location.hostname.includes("localhost") 
            ? "http://localhost:8000" 
            : "https://my-budget-back.onrender.com";

            var self = this  
            axios
            .get(`${url}/user/month_records/` + data.username + "/" + data.year + "/" + data.month)
            .then((response) => {
                self.registers = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            })  
            .catch((error) => {
            alert(error + username + " ERROR en el server!")
            })      
        },
        save_reg: function () {
            var data = {
                username    : this.username,
                date        : this.day,
                type        : this.type,
                category    : this.category,
                description : this.descripcion,
                value       : this.value
            }
            const url = window.location.hostname.includes("localhost") 
            ? "http://localhost:8000" 
            : "https://my-budget-back.onrender.com";

            axios
            .post(`${url}/user/register/`, data)
            .then((response) => {   
                window.location.reload();         
            })
        }, 
        select : function () {
            this.selected = [];
            if(!this.selectedAll){
                for (let i in this.registers) {
                    this.selected.push(this.registers[i].id)
                }
            }
        },
        reg_del : function () {
            var data = {
                username : this.username,
                id : this.selected
            }
            var self = this;
            const url = window.location.hostname.includes("localhost") 
            ? "http://localhost:8000" 
            : "https://my-budget-back.onrender.com";

            if(confirm("Eliminar registros afectara otros datos en la aplicación")){
                axios
                .delete(`${url}/user/records/delete/`, {data})
                .then((response) => {
                    alert("Regristos borrados " + response.data)
                    window.location.reload()
            }) 
            }            
        },
        track_months : function () {
            const d = new Date();
            let month = d.getMonth(); 
            this.month = month+1


            var data = {
                username    : this.$route.params.username,
                month       : this.month,
                category    : this.track
            }
            console.log(data.month)
            var self = this
            const url = window.location.hostname.includes("localhost") 
            ? "http://localhost:8000" 
            : "https://my-budget-back.onrender.com";

            axios
            .get(`${url}/user/track/`+ data.username + "/" + 2025 + "/" + data.month + "/" + data.category)
            .then((response) => {
                self.datos = response.data
            })
        },
		triggerFileInput() {
			this.$refs.ticketFile.click();
		},
		uploadTicket: function(event) {
			this.isLoading = true;
			var self = this;
			var file = event.target.files[0];
			if (!file) return;

			var formData = new FormData();
			formData.append('image', file);

			var url = window.location.hostname.includes("localhost") 
				? "http://localhost:8000" 
				: "https://my-budget-back.onrender.com";

			axios
			.post(url + "/process-receipt/" + self.username, formData, 
				{ headers: { 'Content-Type': 'multipart/form-data' } })
			.then(function(response) {
				// Inicializar arrays para los datos extraídos y el total
				self.extractedData = [];
				self.ticket_data = [];
				// Iterar sobre cada objeto en la respuesta
				for (var i = 0; i < response.data.length; i++) {
					var item = response.data[i];
					// Si el objeto tiene la descripción "Total Compra", lo guardamos en ticket_data
					if (item.description === "Total Compra") {
					self.ticket_data.push(item);
					} else {
					// El resto de los objetos se guardan en extractedData
					self.extractedData.push(item);
					}
				}
				// Mostrar el modal para revisar los datos del ticket extraído.
				self.showTicketModal = true;
				})
			.catch(function(error) {
				console.error("Error al subir tiquet:", error);
				alert("Error al procesar el tiquet.");
			})
			.finally(() => {
				self.isLoading = false; // Desactiva la animación de carga
			});
			
			},
			confirmTicketData: function() {
			// Aquí se pueden editar los campos del objeto en ticket_data (valor total)
			// Por ejemplo, asignar la categoría editada por el usuario, etc.
			// Luego se realiza el POST para guardar el registro final.
			console.log("Registro a guardar:", self.ticket_data);
			// Se podría hacer algo como:
			// axios.post(url + '/user/register/', self.ticket_data[0]).then(...);
			this.showTicketModal = false;
    }
    }        
}

</script>
