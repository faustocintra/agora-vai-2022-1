import React from 'react'
import eu from '../Assets/eu.jpg'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import Memande from '../ui/Memande'

const useStyles = makeStyles(theme => ({
    form: {
        maxWidth: '90%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        '& .MuiFormControl-root': {
            minWidth: '200px',
            maxWidth: '500px',
            marginBottom: '24px'
        }
    },
    Toolbar:{
        width:'100%',
        justifyContent: 'space-around'
    }
}))

export default function SobreMim(){
    const classes = useStyles()

    const navigate = useNavigate()
    return(
        <>
    <h1>Sobre mim</h1>
    <img src={eu}/>
    <div>
        <h1>Fernando Almeida da Silva Filho</h1>
        
        <p>Apaixonado por tecnologia e sempre estudando Internet das Coisas (IoT) e desenvolvimento de Hardware e Software.
        </p>
        
        <h2>Faculdade</h2>
        
        <p>Análise e Desenvolvimento de Sistemas, Fatec Franca - Faculdade de Tecnologia de Franca Dr
        Thomaz Novelino (agosto/2023 - Cursando)
        </p>

        <h2>Curso Técnico</h2>

        <p>-Eletrônica, Etec Dr Júlio Cardoso – Escola Industrial de Franca (agosto/2022 – Cursando)
        </p>

        <h2>Experiência profissional</h2>

        <p>20/01/2020 - 06/04/2020 – SESI - SERVIÇO SOCIAL DA INDUSTRIA
        Cargo: Auxiliar de Laboratório Didático
        </p>

        <p>01/03/2021 - 01/04/2020 – MICROCAMP - Escola de Tecnologia
        Cargo: Professor
        </p>
    </div>

    <Memande />
    
    </>
    )
    
}