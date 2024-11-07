<template>
  <div id="imagem">
    <Formulario :enviarImagem="enviarImagem" class="formulario" />
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
</template>

<script>
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../services/firebaseConnection';
import imagemPadrao from '@/assets/carregar.png';
import imagemDesconhecida from '@/assets/Desconhecida.png'; // Imagem padrão
import Formulario from '../Formulario/Formulario.vue';

export default {
  name: 'Imagem_component',
  data() {
    return {
      arquivo: null,
      previaImagem: imagemPadrao,
      carregando: false,
      error: null,
    };
  },
  components: {
    Formulario
  },
  methods: {
    mudarArquivo(evento) {
      const arquivoSelecionado = evento.target.files[0];
      if (arquivoSelecionado) {
        this.arquivo = arquivoSelecionado;
        const leitor = new FileReader();
        leitor.onload = (e) => {
          this.previaImagem = e.target.result;
        };
        leitor.readAsDataURL(this.arquivo);
      } else {
        this.arquivo = null;
      }
    },
    async enviarImagem() {
      this.carregando = true;
      this.error = null;

      const nomeImagem = this.arquivo ? this.arquivo.name : 'Desconhecida.png';
      const storageRef = ref(storage, `images/${nomeImagem}`);

      try {
        let arquivoParaEnviar;
        
        if (this.arquivo) {
          arquivoParaEnviar = this.arquivo;
        } else {
          const response = await fetch(imagemDesconhecida);
          const blob = await response.blob();
          arquivoParaEnviar = new File([blob], 'Desconhecida.png', { type: 'image/png' });
        }

        await uploadBytes(storageRef, arquivoParaEnviar);
        this.previaImagem = imagemPadrao;
        this.arquivo = null;
        return nomeImagem;
      } catch (err) {
        this.error = 'Upload falhou: ' + err.message;
        return null;
      } finally {
        this.carregando = false;
      }
    }
  }
};
</script>

<style>
#imagem {
  display: flex;
  margin-top: 10px;
  background-color: #ffffff;
  padding: 50px 70px;
  border-radius: 5px;
}

.image-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
  margin-top: 20px;
  padding: 5px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.5);
}

.image-preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.formulario {
  margin-right: 20px;
}

.upload {
  margin-left: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
