<template>
  <v-container>
    <!-- <v-text-field
      style="height:60px"
      solo
      readonly
      plain
      type="number"
      clearable
      label="enter your zip code"
      prepend-inner-icon="mdi-magnify"
      v-model="zip"
      @input="findCenter"
      @click="openLocationFinder"
    ></v-text-field> -->

    <v-btn 
      large
      block
      outlined
      @click="openLocationFinder"
      class="location-btn font-weight-regular"
      color="secondary"
    >
      <v-icon>mdi-magnify</v-icon>
      Search for Vaccination Slots
      </v-btn>
 
    <v-container 
      class="text-center mt-12 pt-12"
      v-if="!isSearched && !isSearching">
      <img width="100px" 
      src="../assets/icons/vaccine.png" />
      <h5 class="pt-2 pb-2 text--lighten-2">VACCINE FOR COVID FREE WORLD</h5>
        <span class="caption grey--text text--darken-1">
          Check your nearest vaccination center and slots availability.
        </span>
    </v-container>

    <v-container class="px-0 mb-0 pb-0" v-if="isSearching || isSearched">
      <v-card
          class="px-2 py-3 mb-2 date-filter"
          elevation="1"
        >
        <v-btn color="primary"
        v-for="(day,index) in days"
        :key="index"
        elevation="0"
        small
        rounded
        :outlined="moment(day).format('DD MMM, YYYY')!=moment(date).format('DD MMM, YYYY')"
        class="mr-1"
        @click="filterDate(day)"
        >
          {{moment(day).format('DD MMM, YYYY')}}
        </v-btn>
      </v-card>
    </v-container>

    <v-container
      v-if="isSearching">
      <v-skeleton-loader
          class="mx-auto pb-1"
          type="article,article"
        ></v-skeleton-loader>
    </v-container>

    <v-container
      class="px-0"
      v-if="!isSearching && isSearched && !isEmpty"
    >
    <v-card
        v-for="(center,index) in centers"
        :key="index"
        class="pa-4 mb-4"
        elevation="1"
      >
        <v-row>
          <v-col cols="12" class="pb-0 mb-0" >
            <h5 class="body-2 mb-1 font-weight-medium">{{center.name}}</h5>
          </v-col>
          <v-col cols="8" class="mt-1 pt-1">
            <h5 class="caption grey--text text--darken-2">{{center.address}}</h5>
            <h5 class="caption grey--text text--darken-2">{{center.district_name}}, {{center.state_name}}</h5>     
            <h5 class="caption primary--text text--darken-3 mb-2 mt-2">
              <v-icon class="primary--text text-darken-4" style="top:-2px !important" small>mdi-calendar-range</v-icon>
              {{center.date}}
            </h5>
            <h5 class="caption primary--text text--darken-3">
               <v-icon class="primary--text text-darken-4" style="top:-2px !important" small>mdi-clock-outline</v-icon>
              {{moment(center.from,"HH:mm:ss").format("hh:mm A")}} - 
              {{moment(center.to,"HH:mm:ss").format("hh:mm A")}}  
            </h5>
          </v-col>
          <v-col cols="4" class="text-center" >
            <h3 class="green--text text--darken-1">{{center.available_capacity}}</h3>
            <h5 class="caption grey--text text--darken-3">Doses</h5>
            <v-btn @click="openDetails(center)" class="mt-2" rounded small outlined color="primary">VIEW</v-btn>
          </v-col>
          <v-col cols="12" style="padding-top:0px !important">
            <v-chip small color="secondary" v-if="center.fee_type=='Free'" class="mr-2">Free</v-chip>
            <v-chip small color="secondary" v-if="center.fee_type!='Free'" class="mr-2">₹ {{parseFloat(center.fee).toFixed(2)}}</v-chip>
            <v-chip small color="secondary" class="mr-2">{{center.min_age_limit}}+</v-chip>
            <v-chip small color="secondary" class="mr-2">{{center.vaccine}}</v-chip>
          </v-col>
        </v-row>
      </v-card>

    </v-container>

    <v-container 
      class="text-center mt-12 pt-12"
      v-if="isSearched && !isSearching && isEmpty">
      <img width="100px" 
      src="../assets/icons/injection.png" />
      <h5 class="pt-2 pb-2 text--lighten-2">Sorry, No slots available</h5>
        <span class="caption grey--text text--darken-1">
          No slots available in this area right now.
        </span>
    </v-container>

    <v-dialog
        persistent
        v-model="filterDialog"
      >
      <v-card>
        <v-card-text class="pt-5">
          <h5 class="body-2 pb-3">Search in your location</h5>
          <v-divider class="mb-5"></v-divider>
          
          <v-btn 
          class="mr-3"
            :outlined="filterType!=0"
            small
            color="primary"
            @click="changeFilterType(0)"
          >District</v-btn>

          <v-btn 
            :outlined="filterType!=1"
            small
            color="primary"
            @click="changeFilterType(1)"
          >Pincode</v-btn>

          <div v-if="filterType==0" class="pt-5 pb-3">
            <label >State</label>
            <v-autocomplete
              :items="states"
              :loading="isStateLoading"
              v-model="filter.state_id" 
              item-text="state_name"
              item-value="state_id"
              class="mt-1 mb-2" 
              elevation="0" 
              solo 
               
              clearable
              label="search for a state..."
              @change="fetchDistricts"
            ></v-autocomplete>

            <label >District</label>
            <v-autocomplete
              :items="districts"
              item-text="district_name"
              item-value="district_id"
              :loading="isDistrictLoading"
              v-model="filter.district_id" 
              class="mt-1 mb-2" 
              elevation="0" 
              solo 
               
              clearable
              label="search for a district..."
            ></v-autocomplete>

          </div>

          <div v-if="filterType==1" class="pt-3 pb-3">
            <label >Pincode</label>
            <v-text-field 
              type="number" 
              class="mt-1 mb-2" 
              elevation="0" 
              solo 
              clearable
              label="enter your zip code"
              v-model="filter.pincode"
            ></v-text-field>
          </div>

          <v-divider></v-divider>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            small
            @click="filterDialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            text
            small
            @click="findCenter"
          >
            Search
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Detail :popup.sync="popup" :slots="slots" />

    <v-snackbar
      v-model="snackbar"
      color="red darken-4"
    >
    Server error occured, Try Later !!
      <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
import Detail from './Detail';  
export default {
    name: 'Home',
    components:{
      Detail
    },
    data: () => ({
      date:moment(),
      isEmpty:false,
      isSearched:false,
      isSearching:false,
      centers:[],
      days:[],
      popup:false,
      slots:{},
      snackbar:false,
      filterDialog:false,
      states:[],
      districts:[],
      filterType:0,
      filter:{},
      isStateLoading:false,
      isDistrictLoading:false
    }),
    created(){
      this.generateSevenDays();
      let vm=this;
      window.addEventListener("hashchange", function(){
        if(vm.popup && location.hash!="#slot") vm.popup=false;
      }, false);
    },
    methods: {
      generateSevenDays(){
        for(var i=0;i<=7;i++){
          var generated_date=moment().add(i,'day');
          this.days.push(generated_date);
        }
      },
      filterDate(day){
        this.date=day;
        this.findCenter();
      },
      openDetails(_slot){
        location.hash="slot";
        this.slots=_slot;
        this.popup=true; 
      },
      openLocationFinder(){
        this.filterDialog=true
        if(this.states.length>0){
          return;
        }
        this.fetchStates();
        
      },
      changeFilterType(_type){
        this.filterType=_type;
      },
      fetchStates(){
         this.isStateLoading=true;
          axios.post('http://localhost:8000/api/states')
          .then((response)=>{
            this.states=response.data.states;
            this.isStateLoading=false;
          }).catch((error)=>{
            console.log(error);
            this.isStateLoading=false;
          })
      },
      fetchDistricts(){
        this.isDistrictLoading=true;
        axios.post('http://localhost:8000/api/states/'+this.filter.state_id+'/districts')
        .then((response)=>{
          this.districts=response.data.districts;
          this.isDistrictLoading=false;
        }).catch((error)=>{
          console.log(error);
          this.isDistrictLoading=false;
        })
      },
      findCenter(){
        this.filterDialog=false;
        this.isSearching=true;
        if(this.filterType==1)this.filterCenterByZip();
        else this.filterCenterByDistrict();
      },
      filterCenterByZip(){
        let param={
          pincode:this.filter.pincode,
          date:moment(this.date).format('DD-MM-YYYY'),
        };
        axios.post("https://vaxiend.appocs.com/api/sessions/pin",param).then((response)=>{
          this.centers=response.data.sessions;
          this.isEmpty=this.centers.length>0?false:true;
          this.isSearching=false;
          this.isSearched=true;
        }).catch(()=>{
          this.isEmpty=true;
          this.isSearching=false;
          this.isSearched=false;
          this.snackbar=true;
        })
      },
      filterCenterByDistrict(){
        let param={
          district_id:this.filter.district_id,
          date:moment(this.date).format('DD-MM-YYYY'),
        };
        axios.post("http://localhost:8000/api/sessions/district",param)
        .then((response)=>{
          this.centers=response.data.sessions;
          this.isEmpty=this.centers.length>0?false:true;
          this.isSearching=false;
          this.isSearched=true;
        }).catch(()=>{
          this.isEmpty=true;
          this.isSearching=false;
          this.isSearched=false;
          this.snackbar=true;
        })
      }
    },
  }
</script>
<style>
.custom-card{
  background: #FFF;
}
</style>

<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #DDD;
  border-width: 1px;
}
.v-text-field--outlined >>> fieldset:focus {
  border-color: #DDD;
  border-width: 1px;
}
.date-filter{
  white-space: nowrap;
  overflow: auto;
}
.date-filter::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.location-btn {
    text-transform: none;
}
</style>