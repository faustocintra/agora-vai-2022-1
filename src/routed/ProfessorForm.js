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
import AlertBar from '../ui/alertBar'
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

const unidadesFed = [
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'SP', nome: 'São Paulo' }
]

const turmas = [
    { sigla: 'ESP10', descricao: '[ESP10] Espanhol iniciante' },
    { sigla: 'FRA10', descricao: '[FRA10] Francês iniciante' },
    { sigla: 'ING10', descricao: '[ING10] Inglês iniciante' }
]

export default function ProfessorForm() {

    const classes = useStyles()

    const navigate = useNavigate()

    const params = useParams()//consegue Verifica se na rota tem parametros

    const [state, setState] = React.useState(
        // Lazy initalizer
        () => ({
            // Campos correspondentes a controles de seleção
            // precisam ter um valor inicial  
            professor: { 
            nome:'',     
            data_nascimento: '',
            cpf:'',
            formacao:'',
            valor_hora_aula:'',
            email:''},
            alertSeverity: 'success',
            isAlertOpen: false,
            alertMessage: '',
            isModalProgressOpen: false,
            pageTitle:'Cadastrar novo professor',
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

    React.useEffect(() => {

        //Se houver parameto na rota, estamos editando um registro já existente
        //portanto precisamos buscar os dados desse registro
        //para carregar nos campos e editar
        if(params.id){
            fetchData()
        }

    }, []) //Dependencias vazias, executa só no carregamento do componente

    async function fetchData(){
        try{
            const response = await api.get(`professores/${params.id}`)
            setState({
                ...state,
                professor: response.data,
                pageTitle:'Editando professor id. ' + params.id
            })
        }
        catch(erro){
            setState({
                ...state,
                alertSeverity: 'error',
                alertMessage: 'ERRO' + erro.message,
                isAlertOpen: true,
                pageTitle:'## ERRO ##'
            })
        }
    }

    function handleInputChange(event, fieldName = event.target.id) {
        console.log(`fieldName: ${fieldName}, value: ${event?.target?.value}`)

        // Sincroniza o valor do input com a variável de estado
        const newprofessor = {...professor}     // Tira uma cópia do professor

        // O componente DesktopDatePicker envia newValue em vez de
        // event; portanto, é necessário tratamento específico para ele
        if(fieldName === 'data_nascimento') newprofessor[fieldName] = event
        else newprofessor[fieldName] = event.target.value // Atualiza o campo
        
        setState({ ...state, professor: newprofessor })
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
            //Se params.id existe entao estamos editando, ver no put
            if(professor.id) await api.put(`professores/${params.id}`, professor)
            //senao, estamos criando um novo
            else await api.post('professores', professor)
            await api.post('professores', professor)
            setState({
                ...state,
                isAlertOpen: true,
                alertSeverity: 'success',
                alertMessage: 'Dados salvos com sucesso',
                //isModalProgressOpen: true
            })
        } 
        catch(erro) {
            setState({
                ...state,
                isAlertOpen: true,
                alertSeverity: 'error',
                alertMessage: 'ERRO: ' + erro.message,
                //isModalProgressOpen: true
            })
        }
    }

    function isFormModified(){
        for(let field in professor){
            if(professor[field] !== '') return true
        }
        return false
    }

    function handleVoltarButtonClick(){
        if(isFormModified()){
            //se o formulario tiver sido editado, chama a caixa de dialogo
            //para perguntar ao usuario se realmente quer voltar, perdendo dados
            setState({...state, isDialogOpen: true}) 
        }
        //Se nao houve modificação retorna diretamene
        else navigate('/professor')
    }
    function handleDialogClose(answer){
        //fecha a caixa de dialogo
        setState({...state, isDialogOpen: false})

        //se o usuário tiver res´pmdodp "sim", volta à listagem
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
            Deseja realmente Descartar as informações não salvas?
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
                        inputFormat="dd/mm/yyyy"
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
                    placeholder="Informe a formação do professor"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                

                <TextField 
                    id="valor_hora_aula" 
                    label="Valor da hora a aula"
                    value={professor.valor_hora_aula}
                    variant="filled"
                    placeholder="Informe o valor da hora a aula"
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

            {/*<p>{JSON.stringify(professor)}</p>*/}
        </>
    )
}