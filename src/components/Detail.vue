<template>
    <v-dialog
        v-model="popup"
        hide-overlay
        fullscreen
        transition="dialog-bottom-transition"
    >
     <v-card>
      <v-toolbar class="fixed-bar" dark flat color="primary">
        <v-btn icon dark @click="closeDialog()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>Slot Details</v-toolbar-title>
      </v-toolbar>
      
      <v-card
        style="background:#FFF !important"
        class="pa-4 ma-3"
        elevation="1"
      >
        <v-row>
            <v-col cols="12" class="pb-0 mb-0" >
              <h5 class="body-2 mb-1 font-weight-medium">{{slots.name}}</h5>
            </v-col>
            <v-col cols="12" class="mt-1 pt-1">
              <h5 class="caption grey--text text--darken-2">{{slots.address}}</h5>
              <h5 class="caption grey--text text--darken-2">{{slots.district_name}}, {{slots.state_name}} - {{slots.pincode}}</h5>
              <h5 class="caption primary--text text--darken-3 mb-2 mt-2">
                <v-icon class="primary--text text-darken-4" style="top:-2px !important" small>mdi-calendar-range</v-icon>
                {{moment(slots.date,'D-M-Y').format('DD MMM, YYYY')}}

                <v-icon class="ml-3 primary--text text-darken-4" style="top:-2px !important" small>mdi-clock-outline</v-icon>
                {{moment(slots.from,"HH:mm:ss").format("hh:mm A")}} - 
                {{moment(slots.to,"HH:mm:ss").format("hh:mm A")}}  
              </h5>

                 <v-btn class="mr-2 mt-3"
                  color="secondary darken-3"
                  small
                  @click="openMap(slots.lat,slots.long)"
                  >
                    Navigate to Map
                  </v-btn>

                  <v-btn class="mt-3"
                  color="secondary darken-1"
                  small
                  @click="bookNow"
                  >
                    Book Now
                  </v-btn>
            </v-col>
        </v-row>
      </v-card>

      <v-card
        style="background:#FFF !important"
        class="pa-4 ma-3"
        elevation="1"
      >
        <v-row>
            <v-col cols="12" class="pb-0">
              <h5 class="mb-2 button font-weight-regular">Dose Availability</h5>
              <v-divider></v-divider>
            </v-col>
            <v-col cols="4" class="text-center mt-0" >
              <h5 class="subtitle-1 green--text font-weight-bold">{{slots.available_capacity}}</h5>
              <h5 class="caption grey--text text--darken-2">Available</h5>
            </v-col>
            <v-col cols="4" class="text-center" >
              <h5 class="subtitle-1 red--text font-weight-bold">{{slots.available_capacity_dose1}}</h5>
              <h5 class="caption grey--text text--darken-2">Dose 1</h5>
            </v-col>
            <v-col cols="4" class="text-center" >
              <h5 class="subtitle-1 orange--text font-weight-bold">{{slots.available_capacity_dose2}}</h5>
              <h5 class="caption grey--text text--darken-2">Dose 2</h5>
            </v-col>
        </v-row>
      </v-card>

      <v-card
        style="background:#FFF !important"
        class="pa-4 ma-3"
        elevation="1"
      >
        <v-row>
            <v-col cols="12" class="pb-0">
              <h5 class="mb-2 button font-weight-regular">Slot Details</h5>
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              <v-chip v-for="(item,i) in slots.slots" :key="i" small outlined color="primary" class="ma-1">{{item}}</v-chip>
            </v-col>
        </v-row>
      </v-card>

       <v-card
          style="background:#FFF !important"
          class="pa-4 ma-3"
          elevation="1"
        >

        <v-row class="pb-3">
          <v-col cols="12" class="pb-0">
            <h5 class="mb-2 button font-weight-regular">More Information</h5>
            <v-divider></v-divider>     
          </v-col>

          <v-col class="pb-0" cols="5">
            <h5 class="font-weight-regular grey--text text--darken-1">Price</h5>
          </v-col>
          <v-col class="pb-0" cols="1">:</v-col>
          <v-col class="pb-0" cols="6">
               <h5 class="green--text" v-if="slots.fee_type=='Free'" >Free</h5>
              <h5 class="dark--text" v-if="slots.fee_type!='Free'" >₹ {{parseFloat(slots.fee).toFixed(2)}}</h5>
            
          </v-col>

          <v-col class="pb-0 pt-1" cols="5">
            <h5 class="font-weight-regular grey--text text--darken-1">Age</h5>
          </v-col>
          <v-col class="pb-0 pt-1" cols="1">:</v-col>
          <v-col class="pb-0 pt-1" cols="6">
            <h5 class="dark--text">{{slots.min_age_limit}}+</h5>
          </v-col>

          <v-col class="pb-0 pt-1" cols="5">
            <h5 class="font-weight-regular grey--text text--darken-1">Vaccine</h5>
          </v-col>
          <v-col class="pb-0 pt-1" cols="1">:</v-col>
          <v-col class="pb-0 pt-1" cols="6">
            <h5 class="dark--text">{{slots.vaccine}}</h5>
          </v-col>
          
        </v-row>

       </v-card>

       <v-card-actions class="pb-5">
     
      </v-card-actions>

     </v-card>
    </v-dialog>
</template>
<script>

export default {
    props:["popup",'slots'],
    methods:{
        closeDialog(){
            location.hash="";
            this.$emit("update:popup", false);
        },
        openMap(lat,lng){
          window.open("http://maps.google.com/?q="+lat+","+lng,"_blank");
        },
        bookNow(){
          window.open("https://selfregistration.cowin.gov.in", "_blank");    
        },
    }
}
</script>
<style scoped>
.fixed-bar {
  position: sticky;
  position: -webkit-sticky; /* for Safari */
  top: 0px;
  z-index: 2;
  border-radius: 0 !important;
}
.v-sheet{
    background: #F9F9F9 !important;
}
</style>