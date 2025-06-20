<template>
  <div>
    <v-dialog v-model="dialogIsOpen" :max-width="maxWidth" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="d-flex justify-space-between align-center">
            <div class="text-h6 text-medium-emphasis ps-2">
                <slot name="title">

                </slot>
            </div>

            <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            @click="dialogIsOpen = false"
            ></v-btn>
        </v-card-title>

        <v-divider class="mb-4"></v-divider>

        <v-card-text>
            <div class="text-medium-emphasis mb-8">
                <slot name="subtitle">

                </slot>
            </div>

            <slot>

            </slot>
        </v-card-text>
        <v-card-actions class="my-2 d-flex justify-end">
            <v-btn
            class="text-none"
            rounded="xl"
            text="Cancelar"
            @click="dialogIsOpen = false"
            ></v-btn>

            <slot name="action-button">

            </slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
    name: 'DialogCreateCadastro',
    data() {
        return {
            dialogIsOpen: false,
        }
    },
    props: {
        maxWidth: {
            type: [String, Number],
            default: 500
        }
    },
    methods: {
        onCloseDialog() {
            this.dialogIsOpen = false;
        },

        onOpenDialog() {
            this.dialogIsOpen = true;
        }
    }
}
</script>
