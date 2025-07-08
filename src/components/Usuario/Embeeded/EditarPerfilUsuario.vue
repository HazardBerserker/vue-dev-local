<template>
  <v-dialog v-model="dialogIsOpen" max-width="800px">
    <template #activator="{ props }">
      <v-btn color="primary" v-bind="props" @click="openDialog">
        <v-icon left>mdi-account-cog</v-icon>
        Editar Perfil
      </v-btn>
    </template>

    <v-card>
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>Meu Perfil</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog" :disabled="isSaving">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" @submit.prevent="handleSave" v-model="formIsValid">
          <v-row>
            <!-- COLUNA ESQUERDA: dados atuais -->
            <v-col cols="12" md="4">

              <div class="bg-primary align-center px-2 rounded-pill d-flex">
                <v-icon color="white" size="sm">mdi-text</v-icon>
                <v-subheader class="text-white ms-4">Dados Atuais</v-subheader>
              </div>

              <v-list density="compact" lines="two" nav>
                <v-list-item>
                  <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
                  <v-list-item-title>{{ userStore?.user?.nome || '—' }}</v-list-item-title>
                  <v-list-item-subtitle>Nome Atual</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon><v-icon>mdi-email</v-icon></v-list-item-icon>
                  <v-list-item-title>{{ userStore?.user?.email || '—' }}</v-list-item-title>
                  <v-list-item-subtitle>Email Atual</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon><v-icon>mdi-card-account-details</v-icon></v-list-item-icon>
                  <v-list-item-title>{{ userStore?.user?.cargo_descricao || '—' }}</v-list-item-title>
                  <v-list-item-subtitle>Cargo</v-list-item-subtitle>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <div class="bg-grey-darken-2 align-center px-2 rounded-pill d-flex mt-4">
                  <v-icon color="white" size="sm">mdi-shield-account</v-icon>
                  <v-subheader class="text-white ms-4">Níveis de acesso</v-subheader>
                </div>

                <div class="d-flex align-center justify-center flex-column" v-if="usuarioNaoEAdmin()">
                  <v-chip
                    label
                    class="ma-1 w-100 mt-4"
                    color="grey-darken-2"
                    prepend-icon="mdi-shield"
                    variant="outlined"
                  >
                    Comum
                  </v-chip>
                </div>

                <div class="d-flex align-center justify-center flex-column" v-else>
                  <v-chip
                    v-if="userStore?.user?.is_super_admin == SimENaoEnumDescricao.SIM"
                    label
                    class="ma-1 w-100 mt-4"
                    color="purple-darken-3"
                    prepend-icon="mdi-shield-star"
                    variant="outlined"
                  >
                    Super Admin
                  </v-chip>
                  <v-chip
                    v-if="userStore?.user?.is_admin == SimENaoEnumDescricao.SIM"
                    label
                    class="ma-1 w-100"
                    color="pink-darken-3"
                    prepend-icon="mdi-shield-key"
                    variant="outlined"
                  >
                    Admin
                  </v-chip>
                </div>
            </v-col>

            <!-- COLUNA DIREITA: formulário de edição -->
            <v-col cols="12" md="8" class="ps-6">
              <v-subheader class="text-grey-darken-2">Editar Dados</v-subheader>

              <v-text-field
                class="mt-2"
                v-model="userFullName"
                :rules="[rules.required]"
                label="Novo Nome Completo"
                prepend-inner-icon="mdi-account"
                :disabled="isSaving || usuarioNaoEAdmin()"
                density="compact"
                clearable
              />

              <v-text-field
                v-model="userEmail"
                :rules="[rules.required, rules.email]"
                label="Novo Email"
                prepend-inner-icon="mdi-email"
                :disabled="isSaving || usuarioNaoEAdmin()"
                density="compact"
                clearable
              />

              <v-text-field
                v-model="userCargo"
                :rules="[rules.required, rules.email]"
                label="Cargo"
                prepend-inner-icon="mdi-card-account-details"
                :disabled="isSaving || usuarioNaoEAdmin()"
                density="compact"
                clearable
              />

              <v-divider class="my-3"></v-divider>

              <v-subheader class="text-grey-darken-2">Alterar Senha</v-subheader>

              <v-text-field
                class="mt-2"
                v-model="newPassword"
                label="Nova Senha"
                type="password"
                prepend-inner-icon="mdi-lock"
                :disabled="isSaving"
                density="compact"
                clearable
              />

              <v-text-field
                v-model="newPasswordConfirmation"
                label="Confirmar Nova Senha"
                type="password"
                prepend-inner-icon="mdi-lock-check"
                :disabled="isSaving"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>

          <!-- ALERTA DE ERRO -->
          <v-alert
            v-if="errorMessage"
            type="error"
            dense
            outlined
            class="mt-3"
          >
            {{ errorMessage }}
          </v-alert>
        </v-form>
      </v-card-text>


      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog" :disabled="isSaving">Cancelar</v-btn>
        <v-btn
          color="primary"
          :loading="isSaving"
          :disabled="!formIsValid || isSaving"
          @click="handleSave"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { SimENaoEnumDescricao } from '@/Enums/SimENaoEnum'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'EditarPerfilUsuario',
  data() {
    return {
      SimENaoEnumDescricao,
      dialogIsOpen: false,
      userFullName: '',
      userEmail: '',
      userCargo: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
      isSaving: false,
      errorMessage: '',
      formIsValid: false,
      rules: {
        required: (value) => !!value || 'Campo obrigatório.',
        email: (value) => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return pattern.test(value) || 'Email inválido.'
        },
      },
    }
  },
  computed: {
    userStore() {
      return useAuthStore()
    }
  },
  methods: {
    openDialog() {
      this.resetForm()
      const user = this.userStore.user
      this.userFullName = user?.nome || ''
      this.userEmail = user?.email || ''
      this.userCargo = user?.cargo_descricao || ''
      this.dialogIsOpen = true
      this.errorMessage = ''
      // Aqui você pode carregar dados do usuário real para popular os campos
      // Exemplo: this.loadUserData()
    },
    closeDialog() {
      if (this.isSaving) return
      this.dialogIsOpen = false
      this.resetForm()
    },
    resetForm() {
      this.userFullName = ''
      this.userEmail = ''
      this.currentPassword = ''
      this.newPassword = ''
      this.newPasswordConfirmation = ''
      this.errorMessage = ''
      this.formIsValid = false
      // Resetar validação do formulário
      if (this.$refs.form) this.$refs.form.resetValidation()
    },
    async handleSave() {
      // Early return para validar senha
      if (this.newPassword !== this.newPasswordConfirmation) {
        this.errorMessage = 'A nova senha e a confirmação não coincidem.'
        return
      }

      if (!this.formIsValid) {
        this.errorMessage = 'Preencha todos os campos corretamente.'
        return
      }

      this.errorMessage = ''
      this.isSaving = true

      try {
        // Simulação de envio para backend (trocar pelo seu ApiService)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Aqui você faria:
        // await ApiService.put('/user/profile', { ... })

        this.closeDialog()
        this.$emit('update-success') // para o pai saber que salvou

      } catch (error) {
        this.errorMessage = 'Falha ao salvar. Tente novamente.'
      } finally {
        this.isSaving = false
      }
    },

    usuarioNaoEAdmin() {
      return this.userStore?.user?.is_admin == SimENaoEnumDescricao.NAO && this.userStore?.user?.is_super_admin == SimENaoEnumDescricao.NAO
    }
  },
}
</script>

<style scoped>
.v-subheader {
  font-weight: 600;
  font-size: 1.1rem;
  color: #555;
}
</style>
