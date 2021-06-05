<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-progress-circular
        :rotate="-90"
        :size="size"
        :width="width"
        :value="value"
        :color="color"
      >
        <slot></slot>
        <v-icon :color="color" x-large>{{ icon }}</v-icon>
      </v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    size() {
      return {
        xs: 210,
        sm: 190,
        md: 280,
        lg: 350,
        xl: 350,
      }[this.$vuetify.breakpoint.name]
    },
    width() {
      return this.size * 0.22
    },
  },
}
</script>
