import React from 'react'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers'
import ptLocale from 'date-fns/locale/pt-BR'
import { makeStyles } from '@mui/styles'
import InputMask from 'react-input-mask'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import AlertBar from '../ui/AlertBar'
import ModalProgress from '../ui/ModalProgress'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'

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
    toolbar: {
        width: '100%',
        justifyContent: 'space-around'
    }

}))

export default function ProfessorForm() {

    const classes = useStyles()

    const navigate = useNavigate()

    const params = useParams()//consegue Verifica se na rota tem parametros

    const [state, setState] = React.useState(
        // Lazy initalizer
        () => ({
            professor: {
                nome: '',
                data_nascimento: '',
                cpf: '',
                formacao: '',
                valor_hora_aula: '',
                email: ''   
            },
            alertSeverity: 'success',
            isAlertOpen: false,
            alertMessage: '',
            isModalProgressOpen: false
        })
    )
    const {
        professor,
        alertSeverity,
        isAlertOpen,
        alertMessage,
        isModalProgressOpen
    } = state

    React.useEffect(() => {
        if(params.id){
            fetchData()
        }

    }, []) //Dependencias vazias, executa só no carregamento do componente

    async function fetchData(){
        try{
            const response = await api.get(`professores/${params.id}`)
            setState({
                ...state,
                professor: response.data
            })
        }
        catch(erro){
            setState({
                ...state,
                alertSeverity: 'error',
                alertMessage: 'ERRO' + erro.message,
                isAlertOpen: true
            })
        }
    }

    function handleInputChange(event, fieldName = event.target.id) {
        console.log(`fieldName: ${fieldName}, value: ${event?.target?.value}`)

        const newProfessor = {...professor}

        if(fieldName === 'data_nascimento') newProfessor[fieldName] = event
        else newProfessor[fieldName] = event.target.value // Atualiza o campo
        
        setState({ ...state, professor: newProfessor })
    }

    function handleAlertClose(event, reason) {
        if (reason === 'clickaway') {
          return;
        }
    
        // Fecha a barra de alerta e o progresso modal
        setState({...state, isAlertOpen: false, isModalProgressOpen: false})

        // Se os dados forem salvos com sucesso, volta para a página
        // de listagem
        if(alertSeverity === 'success') navigate('/professor')
    }

    function handleFormSubmit(event) {
        event.preventDefault()  // Evita o recarregamento da página
        saveData()
    }

    async function saveData() {
        // Exibe o progresso modal
        setState({...state, isModalProgressOpen: true})

        try {
            await api.post('professores', professor)
            setState({
                ...state,
                isAlertOpen: true,
                alertSeverity: 'success',
                alertMessage: 'Dados salvos com sucesso',
            })
        } 
        catch(erro) {
            setState({
                ...state,
                isAlertOpen: true,
                alertSeverity: 'error',
                alertMessage: 'ERRO: ' + erro.message,
            })
        }
    }

    return (
        <>
            <AlertBar 
                severity={alertSeverity} 
                open={isAlertOpen}
                onClose={handleAlertClose}
            >
                {alertMessage}
            </AlertBar>

            <ModalProgress open={isModalProgressOpen} />
            
            <h1>Cadastro de Professores</h1>

            <form className={classes.form} onSubmit={handleFormSubmit}>
                
                <TextField 
                    id="nome" 
                    label="Nome completo"
                    value={professor.nome}
                    variant="filled"
                    placeholder="Informe o nome completo do(a) professor(a)"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptLocale}>
                    <DesktopDatePicker
                        label="Data de nascimento"
                        inputFormat="dd/MM/yyyy"
                        value={professor.data_nascimento}
                        onChange={newValue => handleInputChange(newValue, 'data_nascimento')}
                        renderInput={(params) => <TextField
                            id="data_nascimento"
                            variant="filled"
                            required
                            fullWidth                             
                            {...params} 
                        />}
                    />
                </LocalizationProvider>


                <InputMask
                    mask="999.999.999-99"
                    value={professor.cpf}
                    onChange={event => handleInputChange(event, 'cpf')}
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
                    id="formacao" 
                    label="Formação"
                    value={professor.formacao}
                    variant="filled"
                    placeholder="Informe a formação"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="valor_hora_aula" 
                    label="Valor das horas por aula"
                    value={professor.valor_hora_aula}
                    variant="filled"
                    placeholder="Informe o valor da hora"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="email" 
                    label="E-mail"
                    value={professor.email}
                    variant="filled"
                    placeholder="Informe o e-mail"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <Toolbar className={classes.toolbar}>
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                    >
                        Enviar
                    </Button>
                    <Button
                        variant="outlined"
                    >
                        Voltar
                    </Button>
                </Toolbar>

            </form>
        </>
    )
}