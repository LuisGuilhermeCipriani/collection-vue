<template>
    <div class="table-container">
        <h2 class="titulo">Lista de CDs</h2>
        <table class="scrollable-body" v-if="cds.length > 0">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Artista</th>
                    <th>Código</th>
                    <th>Gênero</th>
                    <th>Ano</th>
                    <th>Descrição</th>
                    <th>Imagem</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(cd, index) in cds" :key="cd.id"
                    :class="{ 'row-odd': index % 2 === 0, 'row-even': index % 2 !== 0 }">
                    <td>{{ cd.titulo }}</td>
                    <td>{{ cd.artista }}</td>
                    <td>{{ cd.codigo }}</td>
                    <td>{{ cd.genero }}</td>
                    <td>{{ cd.ano }}</td>
                    <td>{{ cd.descricao }}</td>
                    <td>
                        <img :src="obtemUrlImagem(cd.imagem)" alt="Imagem do CD" />
                    </td>
                    <td>
                        <button class="editar" @click="abrirModalEditar(cd)">Editar</button>
                        <button class="deletar" @click="deletarCd(cd.id)">Deletar</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <p class="obs" v-else>Não há CDs registrados</p>

        <div v-if="modalEditarEstaAberto" class="modal">
            <div class="modal-content">
                <h3>Editar CD</h3>
                <div v-if="carregando" class="loading-indicator">
                    <div class="spinner"></div>
                </div>
                <div class="infos">
                    <div class="atributos">
                        <div class="info">
                            <label>Título:</label>
                            <input v-model="cdSelecionado.titulo" type="text" class="input1" />
                        </div>
                        <div class="info">
                            <label>Artista:</label>
                            <input v-model="cdSelecionado.artista" type="text" class="input2" />
                            <label class="especificacao">Código:</label>
                            <input v-model="cdSelecionado.codigo" type="text" class="input5" />
                        </div>
                        <div class="info">
                            <label>Gênero:</label>
                            <select class="input4" v-model="cdSelecionado.genero" id="opcoes">
                                <option v-for="opcao in opcoes" :key="opcao.value" :value="opcao.value">
                                    {{ opcao.text }}
                                </option>
                            </select>
                            <label class="especificacao">Ano:</label>
                            <input v-model="cdSelecionado.ano" type="number" class="input3" />
                        </div>
                        <div class="info">
                            <label>Descrição:</label>
                            <textarea v-model="cdSelecionado.descricao"></textarea>
                        </div>
                    </div>
                    <div class="upload">
                        <input type="file" id="fileInput" ref="fileInput" @change="mudarArquivo" accept="image/*"
                            style="display: none;" />
                        <button @click="$refs.fileInput.click()">Escolher imagem</button>
                        <div class="image-preview-container" @click="$refs.fileInput.click()">
                            <img :src="previaImagem" alt="Image Preview" class="image-preview" draggable="false" />
                        </div>
                        <p v-if="error">{{ error }}</p>
                    </div>
                </div>
                <div class="botoes">
                    <button class="salvar" @click="atualizarCd">Salvar</button>
                    <button class="cancelar" @click="fecharModalEditar">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from '../../services/firebaseConnection';
import { opcoesGeneros } from '../../components/Formulario/Opcoes';

export default {
    name: 'Exibir_page',
    data() {
        return {
            cds: [],
            modalEditarEstaAberto: false,
            cdSelecionado: {},
            previaImagem: '',
            error: '',
            opcoes: opcoesGeneros,
            carregando: false,
        };
    },
    mounted() {
        this.listar();
    },
    methods: {
        listar() {
            firebase.firestore().collection("cds").get()
                .then(snapshot => {
                    this.cds = snapshot.docs.map(doc => {
                        return { id: doc.id, ...doc.data() };
                    });
                })
                .catch(error => {
                    console.error("Erro ao listar CDs: ", error);
                });
        },
        obtemUrlImagem(nomeImagem) {
            return `https://firebasestorage.googleapis.com/v0/b/testes-dc53c.appspot.com/o/images%2F${encodeURIComponent(nomeImagem)}?alt=media`;
        },
        abrirModalEditar(cd) {
            this.cdSelecionado = { ...cd };
            this.previaImagem = this.obtemUrlImagem(cd.imagem);
            this.modalEditarEstaAberto = true;
        },
        fecharModalEditar() {
            this.modalEditarEstaAberto = false;
            this.cdSelecionado = {};
            this.previaImagem = '';
        },
        mudarArquivo(evento) {
            const arquivo = evento.target.files[0];
            if (arquivo) {
                const leitor = new FileReader();
                leitor.onload = (e) => {
                    this.previaImagem = e.target.result;
                };
                leitor.readAsDataURL(arquivo);
            }
        },
        async enviarImagem(arquivo) {
            const storageRef = firebase.storage().ref();
            const imagemRef = storageRef.child(`images/${arquivo.name}`);

            return new Promise((resolve, reject) => {
                const tarefa = imagemRef.put(arquivo);
                tarefa.on(
                    "state_changed",
                    null,
                    (error) => {
                        console.error("Erro ao fazer upload da imagem: ", error);
                        reject(error);
                    },
                    () => {
                        tarefa.snapshot.ref.getDownloadURL().then(() => {
                            resolve(arquivo.name);
                        });
                    }
                );
            });
        },
        async atualizarCd() {
            this.carregando = true;

            const { id, titulo, artista, codigo, genero, ano, descricao } = this.cdSelecionado;
            const atualizaDados = { titulo, artista, codigo, genero, ano, descricao };

            if (this.previaImagem) {
                const arquivoEntrada = this.$refs.fileInput.files[0];
                if (arquivoEntrada) {
                    try {
                        const nomeImagem = await this.enviarImagem(arquivoEntrada);
                        atualizaDados.imagem = nomeImagem;
                    } catch (error) {
                        console.error("Erro ao fazer upload da imagem: ", error);
                        this.carregando = false;
                        return;
                    }
                }
            }

            firebase.firestore().collection("cds").doc(id).update(atualizaDados)
                .then(() => {
                    this.listar();
                    this.fecharModalEditar();
                    this.carregando = false;
                })
                .catch(error => {
                    console.error("Erro ao atualizar CD: ", error);
                    this.carregando = false;
                });
        },
        deletarCd(id) {
            const cdParaDeletar = this.cds.find(cd => cd.id === id);

            if (cdParaDeletar) {
                firebase.firestore().collection("cds").doc(cdParaDeletar.id).delete()
                    .then(() => {
                        this.cds = this.cds.filter(cd => cd.id !== id);
                        console.log(`CD com ID: ${id} excluído com sucesso.`);
                    })
                    .catch(error => {
                        console.error("Erro ao excluir o CD: ", error);
                    });
            }
        },
    },
};
</script>

<style scoped>
.table-container {
    padding: 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

table img {
    width: 50px;
    height: 50px;
    object-fit: cover;
}

th,
td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
}

thead {
    position: sticky;
    top: 0;
    background-color: #f4f4f4;
    z-index: 1;
}

.row-odd {
    background-color: #2c3e50;
    color: #ffffff;
}

.row-even {
    background-color: #336699;
    color: #ffffff;
}

.titulo {
    color: #ffffff;
    text-align: center;
}

.obs {
    color: #d9d9d9;
    text-align: center;
    font-size: 20px;
    margin-top: 60px;
}

.scrollable-body {
    max-height: 487px;
    overflow-y: auto;
    display: block;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.image-preview {
    width: 100px;
    height: 100px;
    object-fit: cover;
}

.image-preview-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload {
    display: flex;
    align-items: center;
    justify-content: center;
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

.infos {
    display: flex;
    align-items: center;
    justify-content: center;
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

.botoes {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: -5px;
}

.salvar {
    background-color: #00994d;
    border-radius: 5px;
    margin-right: 5px;
    padding: 10px 15px;
}

.salvar:hover {
    opacity: 0.9;
    transition: 0.1s;
    background-color: #00b359;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.cancelar {
    background-color: #ff6600;
    border-radius: 5px;
    margin-left: 5px;
    padding: 10px 15px;
}

.cancelar:hover {
    opacity: 0.9;
    transition: 0.1s;
    background-color: #ff8533;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.editar {
    background-color: #e6e600;
    border-radius: 5px;
    margin-right: 5px;
    padding: 10px 15px;
    color: #000000;
}

.editar:hover {
    opacity: 0.9;
    transition: 0.1s;
    background-color: #e6e600;
}

.deletar {
    background-color: #ff3333;
    border-radius: 5px;
    margin-left: 5px;
    padding: 10px 15px;
}

.deletar:hover {
    opacity: 0.9;
    transition: 0.1s;
    background-color: #ff4d4d;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.loading-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

</style>
