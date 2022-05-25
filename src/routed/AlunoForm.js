import React from 'react'
import TextField from '@mui/material/TextField'
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns"
import {LocalizationProvider, DesktopDatePicker} from '@mui/x-date-pickers'
import ptLocale from 'date-fns/locale/pt-BR'
import {makeStyles} from '@mui/styles'
import InputMask from 'react-input-mask'
import MenuItem from '@mui/material/MenuItem'

const useStyles = makeStyles(theme => ({
    form:{
        maxWidth: '90%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        '& .MuiFormControl-root':{
            minWidth: '200px',
            maxWidth: '500px',
            marginBot: '24px'

        }
    }
}))

const unidadesFed = [
    {sigla:"DF", nome:"Distrito Federal"},
    {sigla: "ES", nome: "Espirito Santo"},
    {sigla: "GO", nome: 'Goiás'},    
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'SP', nome: 'São Paulo' }
]

export default function AlunoForm() {

    const classes = useStyles()

    const [state, setState] = React.useState(
        //Lazy initalizer
        () => ({
            aluno:{}
        })
    )
    
    const {
        aluno
    } = state

        return (
        <>    
            <h1> Cadastro de alunos</h1>

            <from className={classes.form}>
                <TextField
                    id="nome"
                    label="Nome completo"
                    value={aluno.nome}
                    variant="filled"
                    placeholder="Informe o nome completo do(a) aluno(a)"
                    required
                    fullWidth
                />

                <LocalizationProvider dateAdapter={AdapterDateFns} locale=
                {ptLocale}>
                    <DesktopDatePicker
                        label="Data de nascimento"
                        inputFormat="dd/MM/yyyy"
                        value={aluno.data_nascimento}
                        renderInput={(params) => <TextField 
                            id="data_nascimento"
                            variant="filled"
                            required 
                            fullWidth
                            {...params} 
                    />}
                />
                </LocalizationProvider>

                <TextField
                    id="doc_identidade"
                    label="Documento de identidade"
                    value={aluno.doc_identidade}
                    variant="filled"
                    placeholder="Informe o documento de identidade"
                    required
                    fullWidth
                />

                <InputMask
                    mask="999.999.999-99" //mascara
                    value={aluno.cpf}
                >
                    {
                        () => <TextField
                            id="cpf"
                            label="CPF"
                            variant="filled"
                            placeholder="Informe o CPF"
                            required
                            fullWidth
                    />
                    }
                </InputMask>

                <TextField
                    id="logradouro"
                    label="Logradouro (Rua, Av., etc)"
                    value={aluno.logradouro}
                    variant="filled"
                    placeholder="Informe o logradouro"
                    required
                    fullWidth
                />

                <TextField
                    id="num_imovel"
                    label="Nº"
                    value={aluno.num_imovel}
                    variant="filled"
                    placeholder="Informe o numero do imóvel"
                    required
                    fullWidth
                />

                <TextField
                    id="complemento"
                    label = "Complemento"
                    value={aluno.complemento}
                    variant="filled"
                    placeholder="Informe o complemento do imóvel(se houver)"
                    fullWidth
                />

                <TextField
                    id="municipio"
                    label = "Municipio"
                    value={aluno.municipio}
                    variant="filled"
                    placeholder="Informe o município"
                    required
                    fullWidth
                />

                
                <TextField
                    id="uf"
                    label = "UF"
                    value={aluno.uf}      
                    variant="filled"
                    placeholder="Informe a UF"
                    required
                    fullWidth
                    select
                >
                    {
                        unidadesFed.map(uf => (
                            <MenuItem key={uf.sigla} value={uf.sigla}>
                                {uf.nome}
                            </MenuItem>
                        ))
                    }
                </TextField>

            </from>
        </>
    )
}