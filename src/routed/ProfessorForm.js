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
import ConfirmDialog from '../ui/ConfirmDialog'

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

    const params = useParams()

    const [state, setState] = React.useState(
        // Lazy initalizer
        () => ({
            professor: { 
                nome: '',
                data_nascimento: '',
                cpf: '',
                formacao: '',
                valor_hora_aula: '',
                email: '',                 
            },
            alertSeverity: 'success',
            isAlertOpen: false,
            alertMessage: '',
            isModalProgressOpen: false,
            pageTitle: 'Cadastrar novo professor',
            isDialogOpen: false
        })
    )
    const {
        professor,
        alertSeverity,
        isAlertOpen,
        alertMessage,
        isModalProgressOpen,
        pageTitle,
        isDialogOpen
    } = state

    React.useLayoutEffect(() => {

        // Se houver parâmetro na rota, estamos editando um registro já
        // existente. Portanto, precisamos buscar os dados desse registro
        // para carregar nos campos e editar
        if(params.id) {
            fetchData()
        }

    }, [])  // Dependências vazias, executa só no carregamento do componente

    async function fetchData() {
        try {
            const response = await api.get(`professores/${params.id}`)
            setState({
                ...state,
                professor: response.data,
                pageTitle: 'Editando professor id. ' + params.id
            })
        }
        catch(erro) {
            setState({
                ...state,
                alertSeverity: 'error',
                alertMessage: 'ERRO: ' + erro.message,
                isAlertOpen: true,
                pageTitle: '## ERRO ##'
            })
        }
    }

    function handleInputChange(event, fieldName = event.target.id) {
        console.log(`fieldName: ${fieldName}, value: ${event?.target?.value}`)

        // Sincroniza o valor do input com a variável de estado
        const newProfessor = {...professor}     // Tira uma cópia do professor

        // O componente DesktopDatePicker envia newValue em vez de
        // event; portanto, é necessário tratamento específico para ele
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
            // Se professor.id existe, estamos editando, verbo PUT
            if(professor.id) await api.put(`professores/${params.id}`, professor)
            // Senão, estamos criando um novo, verbo POST
            else await api.post('professores', professor)

            setState({
                ...state,
                isAlertOpen: true,
                alertSeverity: 'success',
                alertMessage: 'Dados salvos com sucesso'
            })
        } 
        catch(erro) {
            setState({
                ...state,
                isAlertOpen: true,
                alertSeverity: 'error',
                alertMessage: 'ERRO: ' + erro.message
            })
        }
    }

    function isFormModified() {
        for(let field in professor) {
            if(professor[field] !== '') return true
        }
        return false
    }

    function handleVoltarButtonClick() {

        // Se o formulário tiver sido modificado, chama a caixa de diálogo
        // para perguntar se o usuário realmente quer voltar, perdendo dados
        if(isFormModified()) setState({...state, isDialogOpen: true})

        // Se não houve modificação, pode voltar diretamente para a listagem
        else navigate('/professor')

    }

    function handleDialogClose(answer) {

        // Fecha a caixa de diálogo
        setState({...state, isDialogOpen: false})

        // Se o usuário tiver respondido "sim", volta à listagem
        if(answer) navigate('/professor')
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

            <ConfirmDialog 
                title="Os dados foram modificados" 
                open={isDialogOpen}
                onClose={handleDialogClose}
            >
                Deseja realmente descartar as informações não salvas?
            </ConfirmDialog>
            
            <h1>{pageTitle}</h1>

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
                    label="Formacao"
                    value={professor.formacao}
                    variant="filled"
                    placeholder="Informe a formacao"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

               

                <TextField 
                    id="valor_hora_aula" 
                    label="Valor hora aula"
                    value={professor.valor_hora_aula}
                    variant="filled"
                    placeholder="Informe o valor da hora aula"
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
                        onClick={handleVoltarButtonClick}
                    >
                        Voltar
                    </Button>
                </Toolbar>

            </form>

            {/* <p>{JSON.stringify(professor)}</p> */}
        </>
    )
}