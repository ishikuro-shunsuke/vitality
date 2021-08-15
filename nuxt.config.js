import colors from 'vuetify/es5/util/colors'

export default {
  server: {
    port: 8082,
  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'Vitality',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { hid: 'robots', name: 'robots', content: 'noindex' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/amplify.js', ssr: false },
    { src: '@/plugins/vue-chartjs.js', ssr: false },
    { src: '@/plugins/axios.js', ssr: false },
    { src: '@/plugins/fullscreen.js', ssr: false },
    { src: '@/plugins/helper.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next'],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // @nuxtjs/pwa
  pwa: {
    manifest: {
      name: 'Vitality',
      short_name: 'Vitality',
      background_color: '#121212',
    },
  },

  auth: {
    redirect: {
      callback: '/auth_callback',
      home: '/exercise',
      logout: '/exercise',
    },
    strategies: {
      fitbit: {
        scheme: 'oauth2',
        endpoints: {
          authorization: 'https://www.fitbit.com/oauth2/authorize',
          token: 'https://api.fitbit.com/oauth2/token',
        },
        grantType: 'authorization_code',
        clientId:
          process.env.NODE_ENV === 'development'
            ? process.env.FITBIT_CLIENT_ID_DEV
            : process.env.FITBIT_CLIENT_ID,
        scope: 'activity',
        codeChallengeMethod: 'S256',
      },
    },
  },
}
