<template>
	<div v-if="isLoading">
      <LottieAnimation :animationData="loadingAnimation" />
    </div>
    <b-container v-else fluid>
      <b-row>
        <!-- Contenedor para "Variaciones en Gastos" --> 
        <b-col cols="12" class="module">
          <div v-if="cats.expenses.length > 0">
            <h1>Expenses History</h1>
            <select v-model="track" v-on:change="track_months">
              <option v-for="cat in cats.expenses" v-bind:key="cat.id">
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
				<h2 class="form-title">Register Transaction</h2>

				<!-- Selección de Tipo de Transacción -->
				<div class="form-group">
					<label for="type">Type of Transaction</label>
					<select id="type" v-model="type" class="form-select">
						<option value="">Select...</option>
						<option value="incomes">Income</option>
						<option value="expenses">Spend</option>
					</select>
				</div>

				<!-- Mostrar método de registro SOLO si es un egreso -->
				<div v-if="type === 'expenses'" class="form-group">
					<label>¿How would you want to create the register?</label>
					<select id="reg_mode" v-model="expenseMethod" class="form-select">
						<option value="">Select...</option>
						<option value="ticket">Receipt Image</option>
						<option value="manualEntry">Manually</option>
					</select>
				</div>

				<!-- Si se elige "Subir Ticket" -->
				<div v-if="expenseMethod === 'ticket'" class="form-group">
					<b-button class="form-button" @click="triggerFileInput">Upload your Receipt</b-button>
					<input
						type="file"
						ref="ticketFile"
						style="display: none"
						accept="image/*"
						@change="uploadTicket"
					/>
				</div>

				<!-- Si se elige "Ingreso" o "ManualEntry" en "Egreso" -->
				<div v-if="expenseMethod === 'manualEntry'">
					<div class="form-group">
						<label for="category">Category</label>
						<select id="category" v-model="category" class="form-select">
							<option v-for="cat in cats.expenses" :key="cat.category" :value="cat.category">
							{{ cat.category }}
							</option>
						</select>
					</div>
					<div class="form-group">
						<label for="descripcion">Description</label>
						<input id="descripcion" v-model="description" type="text" class="form-input" placeholder="Descripción">
					</div>
					<div class="form-group">
						<label for="value">Value</label>
						<input id="value" v-model="value" type="number" class="form-input" placeholder="0.00">
					</div>
					<div class="form-group">
						<label for="day">Date</label>
						<input id="day" v-model="day" type="date" class="form-input">
					</div>
					<button @click="save_reg" class="form-button">Save Register</button>
				</div>

				<div v-if="type === 'incomes'">
					<div class="form-group">
						<label for="category">Category</label>
						<select id="category" v-model="category" class="form-select">
							<option v-for="cat in cats.incomes" :key="cat.category" :value="cat.category">
							{{ cat.category }}
							</option>
						</select>
					</div>
					<div class="form-group">
						<label for="descripcion">Description</label>
						<input id="descripcion" v-model="description" type="text" class="form-input" placeholder="Descripción">
					</div>
					<div class="form-group">
						<label for="value">Value</label>
						<input id="value" v-model="value" type="number" class="form-input" placeholder="0.00">
					</div>
					<div class="form-group">
						<label for="day">Date</label>
						<input id="day" v-model="day" type="date" class="form-input">
					</div>
					<button @click="save_reg" class="form-button">Save Register</button>
				</div>
			</div>
		</b-col>

        <!-- Contenedor para "Consultar Registros" -->
        <b-col cols="12" sm="12" md="6" lg="6" class="module">
          <h2 class="act">Check Registers</h2>
		 
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
                <b-button v-on:click="get_regs" class="button_request">Consult</b-button>
              </div>
            </b-col>
            <b-col cols="6">
              <b-button v-if="selected.length" v-on:click="reg_del" variant="dark">Delete</b-button>
            </b-col>
          </b-row>
          <b-row>
            <h2 class="act">My Registers</h2>
            <table class="registered">
                <thead>
                    <tr>
                    <th>
                        <input type="checkbox" v-model="selectedAll" v-on:click="select">
                    </th>
                    <th class="act">Category</th>
                    <th class="act">Description</th>
                    <th class="act">Value</th>
                    <th class="act">Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="reg in registers[0]" :key="reg.id" v-bind:class="{ goo: reg.type == 'incomes', bad: reg.type == 'expenses', pas: reg.type == 'passives', act: reg.type == 'liabilities' }">
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
	  <b-modal id="ticketModal" v-model="showTicketModal" title="Datos del Tiquet (Testing)"  size="lg" hide-footer>
		<div v-if="isLoading">
			<LottieAnimation :animationData="loadingAnimation" />
		</div>
		<div v-else-if="extractedData && extractedData.length">
			<h3 class="pas">*The value can contain errors</h3>
			<p>Check the information before save register</p>
			<table class="table table-sm">
			<thead>
				<tr>
				<th>Description</th>
				<th>Value</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item, idx) in extractedData" :key="'extracted_' + idx">
				<td>{{ item.description }}</td>
				<td>{{ item.value }}</td>
				</tr>
			</tbody>
			</table>
			<hr>
			<div class="form-group">
			<label><strong>Total Value:</strong></label>
			<input type="number" 
					step="any" 
					class="form-control" 
					v-model="ticket_data[0].value" 
					@input="handleValueInput" 
				/>
			</div>
			<div class="form-group">
			<label><strong>Category:</strong></label>
			<select v-model="category" class="form-select">
				<option disabled> -- Choose one -- </option>
				<option v-for="cat in cats.expenses" :key="cat.category" :value="cat.category">
				{{ cat.category }}
				</option>
			</select>
			</div>
			<div class="form-group">
				<label for="day">Date</label>
				<input id="day" v-model="day" type="date" class="form-input">
			</div>
		</div>
		<div v-else>
			<p>There are no data extracted.</p>
		</div>
		<div class="modal-footer">
			<b-button variant="secondary" @click="showTicketModal = false">Close</b-button>
			<b-button variant="primary" @click="confirmTicketData">Save register</b-button>
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
            description : "",
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
            meses       : ['January', 'February', 'March', 'April', 'May',  
                        'June', 'July', 'August', 'September', 'October', 
                        'November', 'December'],
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
                response.data[0].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        		self.registers = response.data;
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
                description : this.description,
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

				this.description = "Ticket de Compra";
				this.value = this.ticket_data[0].value;

				var data = {
					username: this.username,
					date: this.day,
					type: this.type,
					category: this.category,
					description: this.description,
					value: this.value
				};

				if ( !this.category || !this.value || !this.day) {
					alert("Por favor, completa todos los campos requeridos antes de enviar.");
					return;
				}
				const message = 
`Por favor, confirma los siguientes datos:
----------------------------------
Fecha: ${data.date}
Categoría: ${data.category}
Valor: ${data.value}
----------------------------------
¿Deseas enviar el registro?`;

				if (!confirm(message)) {
					return;
				}

				this.isLoading = true;

				const url = window.location.hostname.includes("localhost")
					? "http://localhost:8000"
					: "https://my-budget-back.onrender.com";

					axios
					.post(`${url}/user/register/`, data)
					.then((response) => {
						window.location.reload();
					})
					.catch((error) => {
						console.error("Error al guardar el registro:", error);
						alert("Ocurrió un error al guardar el registro. Intente nuevamente.");
					})
					.finally(() => {
						this.isLoading = false;
					});
				this.showTicketModal = false;

				// console.log("Registro a guardar:", 
				// 	this.username, 
				// 	this.day, 
				// 	this.type, 
				// 	this.category, 
				// 	this.description, 
				// 	this.value
				// );

			},
			handleValueInput: function (event) {
				this.value = event.target.value;
			}
    }        
}

</script>
