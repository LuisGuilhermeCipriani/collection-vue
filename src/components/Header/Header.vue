<template>
    <div id="header">

        <div class="itens">
            <div class="itens_esquerda">
                <span class="marca">Garage Collection</span>
            </div>
            
            <div class="itens_direita">
                <router-link to="/" class="link">Cadastrar</router-link>
                <router-link to="/exibir" class="link">Exibir</router-link>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'Header_component'
    }
</script>

<style scoped>
#header {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, #85a3e0, #666666);
    width: 100%;
    height: 100px;
}

.itens {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    padding: 0px 20px;
}

.itens_esquerda {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
}

.itens_direita {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
}

.marca {
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
}

.link {
    margin-right: 20px;
    text-decoration: none;
    color: #ffffff;
    font-size: 20px;
}

.link:hover {
    color: #c2d1f0;
    transition: color 0.1s;
}
</style>