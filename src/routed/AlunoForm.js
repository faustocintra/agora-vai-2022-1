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

export default function AlunoForm() {

    const classes = useStyles()

    const navigate = useNavigate()

    const params = useParams()

    const [state, setState] = React.useState(
        // Lazy initalizer
        () => ({
            aluno: { 
                nome: '',
                data_nascimento: '',
                doc_identidade: '',
                cpf: '',
                logradouro: '',
                num_imovel: '',
                complemento: '',
                bairro: '',
                municipio: '',
                uf: '', 
                telefone: '',
                email: '',
                turma: ''                 
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
        aluno,
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
            const response = await api.get(`alunos/${params.id}`)
            setState({
                ...state,
                aluno: response.data,
                pageTitle: 'Editando aluno id. ' + params.id
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
        const newAluno = {...aluno}     // Tira uma cópia do aluno

        // O componente DesktopDatePicker envia newValue em vez de
        // event; portanto, é necessário tratamento específico para ele
        if(fieldName === 'data_nascimento') newAluno[fieldName] = event
        else newAluno[fieldName] = event.target.value // Atualiza o campo
        
        setState({ ...state, aluno: newAluno })
    }

    function handleAlertClose(event, reason) {
        if (reason === 'clickaway') {
          return;
        }
    
        // Fecha a barra de alerta e o progresso modal
        setState({...state, isAlertOpen: false, isModalProgressOpen: false})

        // Se os dados forem salvos com sucesso, volta para a página
        // de listagem
        if(alertSeverity === 'success') navigate('/aluno')
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
            if(aluno.id) await api.put(`alunos/${params.id}`, aluno)
            // Senão, estamos criando um novo, verbo POST
            else await api.post('alunos', aluno)

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
        for(let field in aluno) {
            if(aluno[field] !== '') return true
        }
        return false
    }

    function handleVoltarButtonClick() {

        // Se o formulário tiver sido modificado, chama a caixa de diálogo
        // para perguntar se o usuário realmente quer voltar, perdendo dados
        if(isFormModified()) setState({...state, isDialogOpen: true})

        // Se não houve modificação, pode voltar diretamente para a listagem
        else navigate('/aluno')

    }

    function handleDialogClose(answer) {

        // Fecha a caixa de diálogo
        setState({...state, isDialogOpen: false})

        // Se o usuário tiver respondido "sim", volta à listagem
        if(answer) navigate('/aluno')
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
                    value={aluno.nome}
                    variant="filled"
                    placeholder="Informe o nome completo do(a) aluno(a)"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptLocale}>
                    <DesktopDatePicker
                        label="Data de nascimento"
                        inputFormat="dd/MM/yyyy"
                        value={aluno.data_nascimento}
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

                <TextField 
                    id="doc_identidade" 
                    label="Documento de identidade"
                    value={aluno.doc_identidade}
                    variant="filled"
                    placeholder="Informe o documento de identidade"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <InputMask
                    mask="999.999.999-99"
                    value={aluno.cpf}
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
                    id="logradouro" 
                    label="Logradouro (Rua, Av., etc.)"
                    value={aluno.logradouro}
                    variant="filled"
                    placeholder="Informe o logradouro"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="num_imovel" 
                    label="Nº"
                    value={aluno.num_imovel}
                    variant="filled"
                    placeholder="Informe o número do imóvel"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="complemento" 
                    label="Complemento"
                    value={aluno.complemento}
                    variant="filled"
                    placeholder="Informe o complemento do imóvel (se houver)"
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="bairro" 
                    label="Bairro"
                    value={aluno.bairro}
                    variant="filled"
                    placeholder="Informe o bairro"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="municipio" 
                    label="Município"
                    value={aluno.municipio}
                    variant="filled"
                    placeholder="Informe o município"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="uf" 
                    label="UF"
                    value={aluno.uf}
                    variant="filled"
                    placeholder="Informe a UF"
                    required
                    fullWidth
                    select
                    onChange={event => handleInputChange(event, 'uf')}
                >
                    {
                        unidadesFed.map(uf => (
                            <MenuItem key={uf.sigla} value={uf.sigla}>
                                {uf.nome}
                            </MenuItem>
                        ))
                    }
                </TextField>

                <InputMask
                    mask="(99) 99999-9999"
                    value={aluno.telefone}
                    onChange={event => handleInputChange(event, 'telefone')}
                >
                    {
                        () => <TextField 
                            id="telefone" 
                            label="Celular"
                            variant="filled"
                            placeholder="Informe o celular"
                            required
                            fullWidth
                        />
                    }
                </InputMask>

                <TextField 
                    id="email" 
                    label="E-mail"
                    value={aluno.email}
                    variant="filled"
                    placeholder="Informe o e-mail"
                    required
                    fullWidth
                    onChange={handleInputChange}
                />

                <TextField 
                    id="turma" 
                    label="Turma"
                    value={aluno.turma}
                    variant="filled"
                    placeholder="Informe a turma"
                    required
                    fullWidth
                    select
                    onChange={event => handleInputChange(event, 'turma')}
                >
                    {
                        turmas.map(t => (
                            <MenuItem key={t.sigla} value={t.sigla}>
                                {t.descricao}
                            </MenuItem>
                        ))
                    }
                </TextField>

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