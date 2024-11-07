<template>
  <div id="cadastrar">
    <h2>Cadastre um CD</h2>
    <div>
      <imagem />
    </div>
  </div>
</template>

<script>
import Imagem from '../../components/Imagem/Imagem.vue';

export default {
  name: 'Cadastrar_page',
  components: {
    Imagem
  }
}
</script>

<style scoped>
#cadastrar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 10px;
}

h2 {
  color: #ffffff;
}
</style>