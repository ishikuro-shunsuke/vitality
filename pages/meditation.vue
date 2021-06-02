<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Past 7 days</h2>
        <Bar></Bar>
      </v-col>
      <v-col cols="12" md="6">
        <h2>Settings</h2>
        <Form></Form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Form from '../components/meditation/Form'
import Bar from '../components/meditation/Bar'

export default {
  components: {
    Form,
    Bar,
  },
}
</script>
