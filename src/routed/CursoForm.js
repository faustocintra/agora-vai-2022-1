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

export default function CursoForm() {

    const classes = useStyles()

    const navigate = useNavigate()

    const params = useParams()

    const [state, setState] = React.useState(
        // Lazy initalizer
        () => ({
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
            isModalProgressOpen: false,
            pageTitle: 'Cadastrar novo aluno',
            isDialogOpen: false
        })
    )
    const {
        curso,
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
            const response = await api.get(`curso/${params.id}`)
            setState({
                ...state,
                curso: response.data,
                pageTitle: 'Editando curso id. ' + params.id
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
        const newCurso = {...curso}     // Tira uma cópia do aluno

        // O componente DesktopDatePicker envia newValue em vez de
        // event; portanto, é necessário tratamento específico para ele
        if(fieldName === 'carga_horaria') newCurso[fieldName] = event
        else newCurso[fieldName] = event.target.value // Atualiza o campo
        
        setState({ ...state, curso: newCurso})
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
            // Se aluno.id existe, estamos editando, verbo PUT
            if(curso.id) await api.put(`cursos/${params.id}`, curso)
            // Senão, estamos criando um novo, verbo POST
            else await api.post('cursos', curso)

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
        for(let field in curso) {
            if(curso[field] !== '') return true
        }
        return false
    }

    function handleVoltarButtonClick() {

        // Se o formulário tiver sido modificado, chama a caixa de diálogo
        // para perguntar se o usuário realmente quer voltar, perdendo dados
        if(isFormModified()) setState({...state, isDialogOpen: true})

        // Se não houve modificação, pode voltar diretamente para a listagem
        else navigate('/curso')

    }

    function handleDialogClose(answer) {

        // Fecha a caixa de diálogo
        setState({...state, isDialogOpen: false})

        // Se o usuário tiver respondido "sim", volta à listagem
        if(answer) navigate('/curso')
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
                    id="sigla" 
                    label="Sigla dos cursos"
                    value={curso.sigla}
                    variant="filled"
                    placeholder="Informe o nome do curso"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="descricao" 
                    label="Descrição dos cursos"
                    value={curso.descricao}
                    variant="filled"
                    placeholder="Informe o documento de identidade"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="duracao_meses" 
                    label="Duração em meses do curso"
                    value={curso.duracao_meses}
                    variant="filled"
                    placeholder="Informe a duração em meses do curso"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="carga_horaria" 
                    label="Carga Horaria dos Cursos"
                    value={curso.carga_horaria}
                    variant="filled"
                    placeholder="Informe a carga horaria do curso"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="valor_total" 
                    label="Valor Total dos Cursos"
                    value={curso.valor_total}
                    variant="filled"
                    placeholder="Informe o valor total dos cursos"
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

            {/* <p>{JSON.stringify(aluno)}</p> */}
        </>
    )
}