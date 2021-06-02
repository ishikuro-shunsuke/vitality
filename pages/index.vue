<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="pl-0 pr-0">
        <h2>Action</h2>
        <v-dialog v-model="dialog" class="mx-auto" max-width="200">
          <template #activator="{ on, attrs }">
            <v-btn x-large v-bind="attrs" v-on="on">emit</v-btn>
          </template>
          <v-card>
            <v-card-title>Emitted?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="
                  dialog = false
                  $store.dispatch('vitality/emit')
                "
              >
                yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="12" md="6" class="pl-0 pr-0">
        <h2>Testosterone level</h2>
        <Chart></Chart>
      </v-col>
      <v-col cols="12" md="6" class="pl-0 pr-0">
        <h2>Past 30 days</h2>
        <Graph></Graph>
      </v-col>
    </v-row>
    <v-row>
      <h2>Past emissions</h2>
      <History></History>
    </v-row>
  </v-container>
</template>

<script>
import Chart from '../components/vitality/Chart'
import Graph from '../components/vitality/Graph'
import History from '../components/vitality/History'

export default {
  components: {
    Chart,
    Graph,
    History,
  },
  data() {
    return {
      dialog: null,
    }
  },
}
</script>
