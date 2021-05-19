<template>
  <v-container>
    <v-text-field
      style="height:60px"
      solo
      plain
      type="number"
      clearable
      label="enter your zip code"
      prepend-inner-icon="mdi-magnify"
      v-model="zip"
      @input="findCenter"
    ></v-text-field>
 
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
            <h5 class="caption primary--text text--darken-3 mb-2 mt-2">
              <v-icon class="primary--text text-darken-4" style="top:-2px !important" small>mdi-calendar-range</v-icon>
              {{center.date}}
            </h5>
            <h5 class="caption primary--text text--darken-3 mb-2 mt-2">
               <v-icon class="primary--text text-darken-4" style="top:-2px !important" small>mdi-clock-outline</v-icon>
              {{moment(center.from,"HH:mm:ss").format("hh:mm A")}} - 
              {{moment(center.to,"HH:mm:ss").format("hh:mm A")}}  
            </h5>
          </v-col>
          <v-col cols="4" class="text-center" >
            <h3 class="green--text text--darken-1">{{center.available_capacity}}</h3>
            <h5 class="caption grey--text text--darken-3">Doses</h5>
            <v-btn @click="bookNow" class="mt-2" rounded small outlined color="primary">BOOK</v-btn>
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

  </v-container>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
  export default {
    name: 'Home',

    data: () => ({
      zip:'',
      date:moment(),
      isEmpty:false,
      isSearched:false,
      isSearching:false,
      centers:[],
      days:[],
    }),
    created(){
      this.generateSevenDays();
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
      bookNow(){
          window.open("https://selfregistration.cowin.gov.in", "_blank");    
      },
      findCenter(){
        if(this.zip==null || this.zip==""){
            this.isSearching=false;
            this.isSearched=false;
            this.centers=[];
            this.date=moment();
          return;
        }
        if(this.zip.length == 6){
          this.isSearching=true;
          axios.get("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin",{
            params:{
              pincode:this.zip,
              date:moment(this.date).format('DD-MM-YYYY'),
            }
          }).then((response)=>{
            this.centers=response.data.sessions;
            this.isEmpty=this.centers.length>0?false:true;
            this.isSearching=false;
            this.isSearched=true;
          }).catch(()=>{

          })
        }else{
          this.isSearching=false;
        }
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
</style>