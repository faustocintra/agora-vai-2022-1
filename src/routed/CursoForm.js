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

export default function CursoForm() {

    const classes = useStyles()

    const navigate = useNavigate()

    const params = useParams()//consegue Verifica se na rota tem parametros

    const [state, setState] = React.useState(
        // Lazy initalizer
        () => ({
            // Campos correspondentes a controles de seleção
            // precisam ter um valor inicial  
            curso: {
                sigla: '',
                descricao: '',
                duracao_meses: '',
                carga_horaria: '',
                valor_total: '' 
            },
            alertSeverity: 'success',
            isAlertOpen: false,
            alertMessage: '',
            isModalProgressOpen: false
        })
    )
    const {
        curso,
        alertSeverity,
        isAlertOpen,
        alertMessage,
        isModalProgressOpen
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
            const response = await api.get(`cursos/${params.id}`)
            setState({
                ...state,
                curso: response.data
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

        // Sincroniza o valor do input com a variável de estado
        const newCurso = {...curso}     // Tira uma cópia do aluno

        // O componente DesktopDatePicker envia newValue em vez de
        // event; portanto, é necessário tratamento específico para ele
        if(fieldName === 'data_nascimento') newCurso[fieldName] = event
        else newCurso[fieldName] = event.target.value // Atualiza o campo
        
        setState({ ...state, curso: newCurso })
    }

    function handleAlertClose(event, reason) {
        if (reason === 'clickaway') {
          return;
        }
    
        // Fecha a barra de alerta e o progresso modal
        setState({...state, isAlertOpen: false, isModalProgressOpen: false})

        // Se os dados forem salvos com sucesso, volta para a página
        // de listagem
        if(alertSeverity === 'success') navigate('/curso')
    }

    function handleFormSubmit(event) {
        event.preventDefault()  // Evita o recarregamento da página
        saveData()
    }

    async function saveData() {
        // Exibe o progresso modal
        setState({...state, isModalProgressOpen: true})

        try {
            await api.post('cursos', curso)
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
            
            <h1>Cadastro de cursos</h1>

            <form className={classes.form} onSubmit={handleFormSubmit}>
                
                <TextField 
                    id="sigla" 
                    label="Sigla do Curso"
                    value={curso.sigla}
                    variant="filled"
                    placeholder="Informe a sigla do curso"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="descricao" 
                    label="Descrição do Curso"
                    value={curso.descricao}
                    variant="filled"
                    placeholder="Descrição do Curso"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="duracao_meses" 
                    label="Duração em meses do curso"
                    value={curso.duracao_meses}
                    variant="filled"
                    placeholder="Informe a duração do curso"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="carga_horaria" 
                    label="Carga Horária"
                    value={curso.carga_horaria}
                    variant="filled"
                    placeholder="Informe a carga horária do curso"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="valor_total" 
                    label="Valor Total do Curso"
                    value={curso.valor_total}
                    variant="filled"
                    placeholder="Informe o valor total do curso"
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