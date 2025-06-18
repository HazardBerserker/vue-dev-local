import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // define como padrão
    aliases,           // nomes curtos tipo "menu", "close"
    sets: {
      mdi              // conjunto completo MDI
    },
  },
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        dark: false,
        colors: {
          redNeveah: '#B50300',      // vermelho
          // secondary: '#2ecc71',    // verde
          // background: '#f5f5f5',
          // surface: '#ffffff',
          // error: '#ff5252',
          // info: '#2196f3',
          // success: '#4caf50',
          // warning: '#fb8c00',
          // // suas outras cores customizadas aqui
          // corEspecial: '#123456'
        }
      }
    }
  }

})

export default vuetify
