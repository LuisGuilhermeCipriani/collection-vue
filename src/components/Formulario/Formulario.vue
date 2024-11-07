<template>
    <div id="formulario">
        <form @submit.prevent="cadastrar">
            <div class="info">
                <label for="titulo">Título:</label>
                <input class="input1" type="text" v-model="titulo" id="titulo" required />
            </div>
            <div class="info">
                <label for="artista">Artista:</label>
                <input class="input2" type="text" v-model="artista" id="artista" required />
                <label class="especificacao" for="codigo">Código:</label>
                <input class="input5" type="number" v-model="codigo" id="codigo" required />
            </div>
            <div class="info">
                <label for="opcoes">Gênero:</label>
                <select class="input4" v-model="genero" id="opcoes">
                    <option v-for="opcao in opcoes" :key="opcao.value" :value="opcao.value">
                        {{ opcao.text }}
                    </option>
                </select>
                <label class="especificacao" for="ano">Ano:</label>
                <input class="input3" type="number" v-model="ano" id="ano" required />
            </div>
            <div class="info">
                <label for="descricao">Descrição:</label>
                <textarea v-model="descricao" id="descricao" required></textarea>
            </div>
            <button type="submit">Cadastrar</button>
        </form>
    </div>
</template>

<script>

import firebase from '../../services/firebaseConnection';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { opcoesGeneros } from './Opcoes';

export default {
    name: 'Formulario_component',
    data() {
        return {
            titulo: '',
            artista: '',
            codigo: '',
            ano: '',
            descricao: '',
            genero: '',
            opcoes: opcoesGeneros,
        };
    },
    props: {
        enviarImagem: {
            type: Function,
            required: true
        }
    },
    methods: {
        async cadastrar() {
            this.mensagemSucesso = 'Cadastro realizado com sucesso!!';

            const imagem = await this.enviarImagem();

            if (!imagem) {
                alert('Erro no upload da imagem.');
                return;
            }

            await firebase.firestore().collection("cds")
                .add({
                    titulo: this.titulo,
                    artista: this.artista,
                    codigo: this.codigo,
                    genero: this.genero,
                    ano: this.ano,
                    descricao: this.descricao,
                    imagem: imagem
                }).then(() => {
                    this.limparCampos();
                    this.showToast();
                })
                .catch(() => {
                    console.log("Não foi possível realizar o cadastro");
                });
        },
        limparCampos() {
            this.titulo = '',
                this.artista = '',
                this.codigo = '',
                this.genero = '',
                this.ano = '',
                this.descricao = ''
        },
        showToast() {
            Toastify({
                text: "Cadastro realizado com sucesso!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: 'right',
                backgroundColor: "linear-gradient(to right, #99b3e6, #4775d1)",
                className: "custom-toast",
                offset: {
                    x: 0,
                    y: 120
                }
            }).showToast();
        }
    }
};
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
}

div {
    margin-bottom: 15px;
}

button {
    background-color: #4775d1;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 2px;
    font-weight: bold;
}

button:hover {
    opacity: 0.9;
    transition: 0.1s;
    background-color: #5c85d6;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

textarea {
    resize: none;
    margin-left: 10px;
    width: 202px;
    height: 65px;
}

input {
    margin-left: 10px;
}

.info {
    display: flex;
    align-items: center;
}

.input1 {
    margin-left: 15px;
    width: 226px;
}

.input2 {
    width: 95px;
}

.input3 {
    width: 70px;
}

.input4 {
    width: 102px;
    height: 20px;
    margin-left: 2px;
}

.input5 {
    width: 47px;
}

.especificacao {
    margin-left: 10px;
}

.custom-toast {
  font-size: 16px;
  color: #fff;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
}
</style>