<template>
    <div>
      <v-badge color="white" transition="slide-x-transition" style="width: 100%;" :floating="overlap" v-if="ajudaMensagem">
      <!-- Badge com tooltip de ajuda -->
        <template v-if="ajudaMensagem" v-slot:badge>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                  <v-icon color="green" v-bind="props" small>
                      mdi-help
                  </v-icon>
              </template>
              <span v-html="ajudaMensagem"></span>
          </v-tooltip>
        </template>

        <v-text-field
          :variant="variant"
          :density="density"
          v-model="modelProxy"
          :rules="rules"
          :counter="counter"
          :label="label"
          :disabled="disabled"
          :type="tipo"
          :maxLength="counter"
          :append-icon="iconeAppend"
          :prepend-icon="iconePrepend"
          :bg-color="backgroundColor"
          :clearable="clearable"
          hide-spin-buttons
          @update:focused="acionaBlur"
          :hide-details="rules.length != 0 ? false : hideDetails"
        >
        </v-text-field>
      </v-badge>

      <v-text-field
          v-else
          :variant="variant"
          :density="density"
          v-model="modelProxy"
          :rules="rules"
          :counter="counter"
          :label="label"
          :disabled="disabled"
          :type="tipo"
          :maxLength="counter"
          :append-icon="iconeAppend"
          :prepend-icon="iconePrepend"
          :bg-color="backgroundColor"
          :clearable="clearable"
          hide-spin-buttons
          @update:focused="acionaBlur"
          :hide-details="rules.length != 0 ? false : hideDetails"
      >
      </v-text-field>
    </div>

</template>

<script>
export default {
    name: 'InputText',
    props: {
        modelValue: {
          type: [String, Number],
          default: ''
        },
        rules: {
          type: Array,
          default: () => []
        },
        counter: {
          type: [Number, String],
          default: null
        },
        label: {
          type: String,
          default: ''
        },
        disabled: {
          type: Boolean,
          default: false
        },
        mask: {
          type: String,
          default: ''
        },
        tipo: {
          type: String,
          default: 'text'
        },
        iconeAppend: {
          type: String,
          default: ''
        },
        iconePrepend: {
          type: String,
          default: ''
        },
        estiloCampo: {
          type: String,
          default: 'outlined'
        },
        clickAppend: {
          type: Function,
          default: () => null
        },
        backgroundColor: {
          type: String,
          default: null
        },
        ajudaMensagem: {
          type: String,
          default: null
        },
        clearable: {
          type: Boolean,
          default: true
        },
        floating: {
          type: Boolean,
          default: false
        },
        hideDetails: {
          type: Boolean,
          default: true
        },
        emiteCampoComFormatacaoAplicada: {
          type: Boolean,
          default: false
        },
        variant: {
          type: String,
          default: 'outlined'
        },
        density: {
          type: String,
          default: 'comfortable'
        },
    },

    computed: {
      overlap() {
        return !!this.floating;
      },

      modelProxy: {
        get() {
          // Retorna o valor mascarado SOMENTE para exibição no input
          if (this.mask && this.modelValue) {
          return this.$VMask(this.modelValue, this.mask);
          }
          return this.modelValue;
        },

        set(valorDigitado) {
          let valorInterno = valorDigitado;

          if(this.emiteCampoComFormatacaoAplicada) {
              this.$emit('update:modelValue', valorInterno);
              return;
          }

          if(this.mask && valorDigitado) {
              valorInterno = valorDigitado.replace(/\D+/g, '');
          }
          // Remove a máscara antes de emitir

          this.$emit('update:modelValue', valorInterno);
        },
      }
    },

    methods: {
        acionaBlur() {
            this.$emit('onBlur')
        },

        estilo(estiloDefinido) {
            return this.estiloCampo === estiloDefinido;
        }
    }
};
</script>
