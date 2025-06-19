<template>
    <div>
        <v-btn prepend-icon="mdi-plus" class="me-2" color="green-darken-1" @click="openDialog">
            NOVO
        </v-btn>

        <DialogCreate ref="dialogCreate">
            <template #title>
                Criar Cliente
            </template>

            <template #subtitle>
                Preencha os campos corretamente para criação do novo Cliente
            </template>

            <v-form ref="form">
                <v-text-field class="mb-3" variant="outlined" label="Nome do Cliente" v-model="nome" :rules="regraNome" clearable/>
                <InputSelectV3
                    v-model="sensivel"
                    rotulo="Sensível"
                    :itens="opacaoSensivel"
                    itemTexto="descricao"
                    itemValor="valor"
                    :regra="regraSensivel"
                    variant="outlined"
                    :hide-details="false"
                    density="default"
                />
            </v-form>

            <template #action-button>
                <v-btn variant="flat" color="green" @click="criaCliente">Criar Cliente</v-btn>
            </template>
        </DialogCreate>
    </div>
</template>

<script>

import DialogCreate from '@/components/Cadastros/Scaffold/DialogCreateCadastro';
import { useAlertStore } from '@/store/alertStore'
import { API_URL_BASE, API_URL } from '@/config/configs';
import ApiService from '@/services/ApiService.js';
import InputSelectV3 from '@/components/Form/InputSelectV3.vue';

export default {
    name: 'BtnClienteCreate',
    components: {
        DialogCreate,
        InputSelectV3
    },
    data() {
        return {
            opacaoSensivel:[
                { valor: true, descricao: 'Sim' },
                { valor: false, descricao: 'Não' }
            ],
            nome: null,
            sensivel: null,
            regraNome: [
                (v) => !!v || 'O Nome é obrigatório',
            ],
            regraSensivel: [
                (v) => v !== null && v !== undefined || 'A Sensibilidade do Cliente é obrigatória',
            ],
        }
    },
    methods: {
        closeDialog() {
            this.$refs.dialogCreate.onCloseDialog();
        },
        openDialog() {
            this.$refs.dialogCreate.onOpenDialog();
        },
        validateForm() {
            return this.$refs.form.validate();
        },
        formatarDadosParaEnvio() {
            const dadosParaEnvio = {
                dados: {
                    nome: this.nome,
                    sensivel: this.sensivel,
                }
            }
            return dadosParaEnvio
        },
        limpaCampos() {
            this.nome = null,
            this.sensivel = null
        },
        async criaCliente() {

            const formValidado = await this.validateForm();

            if(!formValidado.valid) {
                return;
            }

            const dadosParaEnvio = this.formatarDadosParaEnvio();

            let urlConfig = {
                method: 'POST',
                url: `${API_URL_BASE}${API_URL.erp.cargo.salva}`,
                data: dadosParaEnvio
            };

            try {
                const resposta = await ApiService(urlConfig);

                useAlertStore().addAlert( `Cliente criado com sucesso!.`, 'success');

                this.limpaCampos();
                this.closeDialog();
                const itemCriado = resposta?.data?.data?.atributos;
                this.$emit('acrescentaODadoNoArrayLocalmente', itemCriado)

            } catch (erro) {
                useAlertStore().addAlert(erro.message, 'error')
            }
        }

    }
}
</script>
