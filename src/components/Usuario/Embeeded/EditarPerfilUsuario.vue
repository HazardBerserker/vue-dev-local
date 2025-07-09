<template>
  <v-dialog v-model="dialogIsOpen" max-width="800px" persistent>
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
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <div class="pt-3" ref="form" @submit.prevent="alteraDadosDoUsuario">
          <v-row>
            <!-- COLUNA ESQUERDA: dados atuais -->
            <v-col cols="12" md="4">

              <div class="bg-primary align-center px-2 rounded-pill d-flex">
                <v-icon color="white" size="sm">mdi-text</v-icon>
                <span class="text-white ms-4">Dados Atuais</span>
              </div>

              <v-list density="compact" lines="two" nav>
                <v-list-item>
                  <v-icon>mdi-account</v-icon>
                  <v-list-item-title>{{ userStore?.user?.nome || '—' }}</v-list-item-title>
                  <v-list-item-subtitle>Nome Atual</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-icon>mdi-email</v-icon>
                  <v-list-item-title>{{ userStore?.user?.email || '—' }}</v-list-item-title>
                  <v-list-item-subtitle>Email Atual</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-icon>mdi-card-account-details</v-icon>
                  <v-list-item-title>{{ userStore?.user?.cargo_descricao || '—' }}</v-list-item-title>
                  <v-list-item-subtitle>Cargo Atual</v-list-item-subtitle>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <div class="bg-grey-darken-2 align-center px-2 rounded-pill d-flex mt-4">
                  <v-icon color="white" size="sm">mdi-shield-account</v-icon>
                  <span class="text-white ms-4">Níveis de acesso</span>
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
            <v-col cols="12" md="8" class="px-6 bg-grey-lighten-5">
              <div class="d-flex justify-space-between">
                <span :class=" usuarioNaoEAdmin() || editando ? 'text-grey-darken-2' : 'text-grey'">Editar Dados</span>
                <v-icon color="grey" v-tooltip="'Usuários não Admin podem apenas trocar sua senha'" v-if="usuarioNaoEAdmin()">
                  mdi-lock
                </v-icon>
              </div>

              <v-form v-model="formInformacoesPessoais" @submit.prevent="alteraDadosPessoais" ref="formInformacoesPessoaisRef">
                <v-text-field
                  class="mt-5"
                  v-model="userFullName"
                  :rules="[rules.required]"
                  label="Novo Nome Completo"
                  prepend-inner-icon="mdi-account"
                  :disabled="usuarioNaoEAdmin() || !editando"
                  density="compact"
                  clearable
                  variant="outlined"
                />

                <v-text-field
                  v-model="userEmail"
                  class="mt-3"
                  :rules="[rules.required, rules.email]"
                  label="Novo Email"
                  prepend-inner-icon="mdi-email"
                  :disabled="usuarioNaoEAdmin() || !editando"
                  density="compact"
                  clearable
                  variant="outlined"
                />

                <v-slide-x-transition>
                  <div class="d-flex justify-end" v-if="haMudancasNosInputsDeInformacoesPessoais()">
                    <v-btn
                      type="submit"
                      variant="tonal"
                      color="primary"
                      class="mb-3 me-2 align-self-start"
                      rounded
                    >
                      Alterar Dados Pessoais
                    </v-btn>
                  </div>
                </v-slide-x-transition>

              </v-form>

              <v-divider class="my-3"></v-divider>

              <span :class="editando ? 'text-grey-darken-2' : 'text-grey'">Alterar Senha</span>

              <v-form v-model="formSenha" @submit.prevent="alteraSenha" ref="formSenhaRef">
                <v-text-field
                  class="mt-5"
                  v-model="newPassword"
                  label="Nova Senha"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  density="compact"
                  clearable
                  variant="outlined"
                  :disabled="!editando"
                  :rules="[rules.required, rules.password]"
                />
                <v-text-field
                  class="mt-3"
                  v-model="newPasswordConfirmation"
                  label="Confirmar Nova Senha"
                  type="password"
                  prepend-inner-icon="mdi-lock-check"
                  density="compact"
                  clearable
                  variant="outlined"
                  :disabled="!editando"
                  :rules="[rules.required, rules.password]"
                />

                <v-slide-x-transition>
                  <div class="d-flex justify-end" v-if="newPassword || newPasswordConfirmation">
                    <v-btn
                      type="submit"
                      variant="tonal"
                      color="primary"
                      class="mb-3 me-2 align-self-start"
                      rounded
                    >
                      Alterar Senha
                    </v-btn>
                  </div>
                </v-slide-x-transition>
              </v-form>
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
        </div>
      </v-card-text>


      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog">Fechar</v-btn>
        <v-btn variant="flat" :color="editando ? 'orange-darken-1' : 'primary'" @click="ativaOuDesativaEdicao">{{ editando ? 'Cancelar Edição' : 'Editar'}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { SimENaoEnumDescricao } from '@/Enums/SimENaoEnum'
import { useAuthStore } from '@/stores/auth'
import { useAlertStore } from '@/stores/alertStore'
import { useLoadingStore } from '@/stores/loading'
import { endpoints } from '@/utils/apiEndpoints'
import ApiService from '@/services/ApiService'

export default {
  name: 'EditarPerfilUsuario',
  data() {
    return {
      editando: false,
      SimENaoEnumDescricao,
      dialogIsOpen: false,
      userFullName: '',
      userEmail: '',
      newPassword: '',
      newPasswordConfirmation: '',
      errorMessage: '',
      formInformacoesPessoais: false,
      formSenha: false,

      userFullNameInalterado: '',
      userEmailInalterado: '',
      rules: {
        required: (value) => !!value || 'Campo obrigatório.',
        email: (value) => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return pattern.test(value) || 'Email inválido.'
        },
        password: (value) => {
          const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
          return pattern.test(value) || 'A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.'
        }
      },
    }
  },
  computed: {
    userStore() {
      return useAuthStore()
    }
  },
  methods: {
    ativaOuDesativaEdicao() {

      if (this.editando) {
        const user = this.userStore.user

        this.userFullName = user?.nome || ''
        this.userEmail = user?.email || ''

        this.userFullNameInalterado = user?.nome || ''
        this.userEmailInalterado = user?.email || ''

        this.newPassword = ''
        this.newPasswordConfirmation = ''

        if (this.$refs.formSenhaRef) this.$refs.formInformacoesPessoaisRef.resetValidation()
        if (this.$refs.formInformacoesPessoaisRef) this.$refs.formSenhaRef.resetValidation()

        this.editando = false
        return
      }

      this.editando = true
    },

    haMudancasNosInputsDeInformacoesPessoais() {
      if(this.userFullName != this.userFullNameInalterado) {
        return true
      }
      if(this.userEmail != this.userEmailInalterado) {
        return true
      }
    },

    openDialog() {
      this.resetForm()
      const user = this.userStore.user
      this.userFullName = user?.nome || ''
      this.userEmail = user?.email || ''

      this.userFullNameInalterado = user?.nome || ''
      this.userEmailInalterado = user?.email || ''

      this.dialogIsOpen = true
      this.errorMessage = ''
      // Aqui você pode carregar dados do usuário real para popular os campos
      // Exemplo: this.loadUserData()
    },
    closeDialog() {
      this.dialogIsOpen = false
      this.resetForm()
    },
    resetForm() {
      this.userFullName = ''
      this.userEmail = ''
      this.currentPassword = ''
      this.newPassword = ''
      this.newPasswordConfirmation = ''
      this.formIsValid = false
      // Resetar validação do formulário
      if (this.$refs.formSenhaRef) this.$refs.formInformacoesPessoaisRef.resetValidation()
      if (this.$refs.formInformacoesPessoaisRef) this.$refs.formSenhaRef.resetValidation()
    },

    formataDadosDaSenhaParaEnvio() {
      const dadosParaEnvio = {
        nome: this.userFullName,
        email: this.userEmail,
        password: this.newPassword,
        ativo: this.userStore.user?.ativo
      }
      return dadosParaEnvio
    },

    async alteraSenha() {

      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      if (!this.formSenha) {
        alertStore.addAlert('Preencha todos os campos corretamente', 'error');
        return
      }

      if (this.newPassword !== this.newPasswordConfirmation) {
        alertStore.addAlert('A nova senha e a confirmação não coincidem', 'error');
        return
      }

      const dadosParaEnvio = this.formataDadosDaSenhaParaEnvio();

      try {
        loading.show('Alterando dados...')

        const endpoint = endpoints.usuario.atualiza;
        const url =  `${endpoint}/${this.userStore.user?.id_usuario}`

        await ApiService({
          method: 'put',
          url: url,
          data: dadosParaEnvio
        })

        alertStore.addAlert('Senha alterada com sucesso!', 'success');
        this.newPassword = ''
        this.newPasswordConfirmation = ''

        if (this.$refs.formInformacoesPessoaisRef) this.$refs.formSenhaRef.resetValidation()

      } catch (error) {
        alertStore.addAlert(error?.response?.data?.message, 'error');
      } finally {
        loading.hide()
      }
    },

    formataDadosPessoaisParaEnvio() {
      const dadosParaEnvio = {
        nome: this.userFullName,
        email: this.userEmail,
        ativo: this.userStore.user?.ativo,
        id_cliente: this.userStore.user?.id_cliente,
        id_cargo: this.userStore.user?.id_cargo,
      }
      return dadosParaEnvio
    },

    async alteraDadosPessoais() {

      const alertStore = useAlertStore()
      const loading = useLoadingStore()

      if (!this.formInformacoesPessoais) {
        alertStore.addAlert('Preencha todos os campos corretamente', 'error');
        return
      }

      if (this.newPassword !== this.newPasswordConfirmation) {
        alertStore.addAlert('A nova senha e a confirmação não coincidem', 'error');
        return
      }


      const dadosParaEnvio = this.formataDadosPessoaisParaEnvio();

      try {
        loading.show('Alterando senha...')

        const endpoint = endpoints.usuario.atualiza;
        const url =  `${endpoint}/${this.userStore.user?.id_usuario}`

        const resposta = await ApiService({
          method: 'put',
          url: url,
          data: dadosParaEnvio
        })

        const dados = resposta.data.data;

        this.userStore.user.nome = dados.nome
        this.userStore.user.email = dados.email

        this.userFullName = dados.nome
        this.userFullNameInalterado = dados.nome
        this.userEmail = dados.email
        this.userEmailInalterado = dados.email

        alertStore.addAlert('Usuário alterado com sucesso!', 'success');

        this.$refs.formSenhaRef.resetValidation()

      } catch (error) {
        alertStore.addAlert(error?.response?.data?.message, 'error');
      } finally {
        loading.hide()
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
