/*

    Esta prova consiste em acrescentar um novo componente/página ao projeto Agora Vai.

    1. Copie este arquivo para a pasta src/routed.

    2. Copie o arquivo "languages.jpg" para a pasta src/assets.

    3. Altere o arquivo "Apps.js" e adicione um novo Route, com o valor path="/". Assegure-se de que esse novo Route seja POSICIONADO ANTES de todos os outros. Faça com que o componente HomePage seja carregado pelo novo Route. Dessa forma, o componente será exibido assim que a aplicação for aberta no navegador. 

    4. Usando um título de primeiro nível e parágrafos, coloque o seguinte texto no componente:

        Sobre o projeto Agora Vai

        Agora Vai é um projeto front-end desenvolvido pelo Prof. Fausto Cintra juntamente com a turma do 4º semestre matutino de ADS da Fatec Franca.
            
        Seu objetivo é demonstrar as funcionalidades e possibilidades do React em conjunto com a biblioteca de componentes Material UI, acessando uma API REST remota.
            
        Clique sobre ícone do menu no canto superior esquerdo para acessar as funcionalidades.

    5. Adicione mais um parágrafo, e, dentro dele, um botão com a cor "secondary" e o texto "Surpresa!".
    
    6. Faça as modificações necessárias na tag <img> para que a imagem "languages.jpg" seja exibida.

    7. Aplique as classes de estilo definidas em useStyles nos lugares apropriados. 
    O título, os parágrafos e o botão deverão ficar alinhados horizontalmente na página.

    8. Crie uma variável de estado chamada "visible", e coloque seu valor inicial como false.

    9. Ao clicar no botão criado no passo 5, a variável "visible" deve inverter seu valor (ou seja, de true para false ou de false para true). A imagem deve alternar entre visível em invisível.

    10. Coloque os arquivos "App.js" e "HomePage.js" em um ZIP para fazer a entrega da prova.

    11. Envie sua prova até 9h20 para ADS4 arroba FAUSTOCINTRA ponto COM ponto BR
    com o assunto "PROVA 2". Controle o tempo. Não serão aceitos envios após o 
    horário final.

*/

import React from 'react'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import imagem from '../assets/languages.jpg'

const useStyles = makeStyles({
    imagem: {
        display: 'block',
        margin: '0 auto',
        transition: 'opacity 1s linear'
    },
    centralizado: {
        textAlign: 'center'
    }
})

export default function HomePage() {

    const classes = useStyles()

    const [visible, setVisible] = React.useState(false)

    return (
        <>

            <h1 className={classes.centralizado}>Sobre o projeto Agora Vai</h1>

            <p className={classes.centralizado}>Agora Vai é um projeto front-end desenvolvido pelo Prof. Fausto Cintra juntamente com a turma do 4º semestre matutino de ADS da Fatec Franca.</p>
                
            <p className={classes.centralizado}>Seu objetivo é demonstrar as funcionalidades e possibilidades do React em conjunto com a biblioteca de componentes Material UI, acessando uma API REST remota.</p>
                
            <p className={classes.centralizado}>Clique sobre ícone do menu no canto superior esquerdo para acessar as funcionalidades.</p>

            <p className={classes.centralizado}>
                <Button color="secondary" onClick={() => setVisible(!visible)}>
                    Surpresa!
                </Button>
            </p>

            <img className={classes.imagem} alt="Obrigado" src={imagem} style={{opacity: visible ? '1' : '0', height: visible ? '398px': '0'}} />
        </>
    )
}