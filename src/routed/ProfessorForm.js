import React from 'react'
import TextField from "@mui/material/TextField"
import Stack from '@mui/material/Stack'
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns"
import {LocalizationProvider, DesktopDatePicker} from "@mui/x-date-pickers"
import ptLocale from "date-fns/locale/pt-BR"
import { makeStyles } from '@mui/styles'
import InputMask from 'react-input-mask'
import MenuItem from "@mui/material/MenuItem"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import AlertBar from "../ui/AlertBar"
import ModalProgress from "../ui/ModalProgress"
import api from "../api"
import { useNavigate, useParams} from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'


const useStyles = makeStyles(theme =>({
    form:{
        maxWidth: '90%',
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        '& .MuiFormControl-root':{
            minWidth: '200px',
            maxWidth: '500px',
            marginBottom: '24px'
        }
    },
    toolbar:{
        width: "100%",
        justifyContent: "space-around",

    }
}))


export default function ProfessorForm(){

    const classes = useStyles()

    const navigate = useNavigate()

    const params = useParams()

    const [state, setState] = React.useState(
        ()=>({
            professor:{ 
                nome:"",
                data_nascimento:"",
                cpf:"",
                formacao:"",
                valor_hora_aula:"",
                email:""},
            alertSeverity: "success",
            isAlertOpen: false,
            alertMessage: "",
            isModalProgressOpen: false,
            pageTitle: 'Cadastrar novo professor',
            isDialogOpen: false
        })
    )

    const {professor,
            alertSeverity,
            alertMessage,
            isAlertOpen, 
            isModalProgressOpen,
            pageTitle,
            isDialogOpen
        } = state;


    React.useLayoutEffect(()=>{
        // Se houver parâmetro na rota, estamos editando um registro já
        // existente. Portanto, precisamos buscar os dados desse registro
        // para carregar nos campos e editar
        if(params.id){
            fetchData()
        }
    }, [])
    
    async function fetchData(){
        try{
            const response = await api.get(`professores/${params.id}`)
            setState({
                    ...state,
                    professor: response.data,
                    pageTitle: 'Editando professor id. ' + params.id
                })
        }
        catch(erro){
            setState({
                ...state,
                alertSeverity: 'error',
                alertMessage: 'Erro: '+ erro.message,
                isAlertOpen: true,
                pageTitle: '## Erro ##'
            })
        }
    }


    const handleInputChange = (event, fieldName = event.target.id)=>{

        console.log(`fieldName:${fieldName}, value ${event?.target?.value}`)
        //Sincroniza o valor do input com a variavel de estado

        const newProfessor = {...professor} //Tira uma cópia do professor

        //O componente desktopDatePicker envia o novo valor em vez de event
        //portanto é necessario tratamento especifico para ele
        if(fieldName === "data_nascimento") newProfessor[fieldName] = event
        else newProfessor[fieldName] = event.target.value

        
        setState({...state, professor:newProfessor})
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setState({...state, isAlertOpen: false, isModalProgressOpen: false})


        if(alertSeverity === 'success') navigate('/professor')
      };


      function handleFormSubmit(event){
          event.preventDefault()
          saveData()
      }

      async function saveData(){

        setState({...state, isModalProgressOpen:true})


        try{

            if(professor.id) await api.put(`professores/${params.id}`, professor)
            else await api.post('professores', professor )

            setState({
                ...state,
                isAlertOpen: true,
                alertSeverity: "success",
                alertMessage: "Dados salvos com sucesso",
            })
        }
        catch(erro){
            setState({
                ...state,
                isAlertOpen: true,
                alertSeverity: 'error',
                alertMessage: 'ERRO' + erro.message,
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
        // Se o formulário tiver sido modificado, chama a caixa de diálogo
        // para perguntar se o usuário realmente quer voltar, perdendo dados
        if (isFormModified()) setState({...state,isDialogOpen: true})

        else navigate('/professor')
      }

      function handleDialogClose(answer){

        setState({...state, isDialogOpen: false})

        if(answer) navigate ('/professor')
      }

    return(
        <>
        <h1>{pageTitle}</h1>

        <AlertBar severity={alertSeverity} open={isAlertOpen} children={alertMessage} onClose={handleAlertClose}/>


        <ModalProgress open={isModalProgressOpen}/>

        <ConfirmDialog
            title="Os dados foram modificados"
            open={isDialogOpen}
            onClose = {handleDialogClose}
            >
            Deseja realmente descartar as informações não salvas?
        </ConfirmDialog>

        <form className={classes.form} onSubmit={handleFormSubmit}>
            <TextField
                id="nome"
                label="Nome completo"
                value={professor.nome}
                placeholder = "Informe o nome completo"
                variant="filled"
                required
                fullWidth
                onChange={handleInputChange}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}
                adapterLocale={ptLocale}
            >
                    <DesktopDatePicker
                    label="Data de Nascimento"
                    inputFormat="dd/MM/yyyy"
                    value={professor.data_nascimento}
                    onChange={newValue=>handleInputChange(newValue,'data_nascimento')}
                    renderInput={(params) =>
                         <TextField 
                        id='data_nascimento'
                        variant='filled'
                        required
                        fullWidth
                         {...params} />}
                    />
            </LocalizationProvider>

            <InputMask
                mask="999.999.999-99"
                value={professor.cpf}
                onChange={event=> handleInputChange(event, "cpf")}
                children={
                        ()=><TextField
                        id="cpf"
                        label="CPF"
                        placeholder = "Informe o CPF"
                        variant="filled"
                        required
                        fullWidth
                    />  
                }
            />

            <TextField
                id="formacao"
                label="Formação"
                value={professor.formacao}
                placeholder = "Informe a formação"
                variant="filled"
                required
                fullWidth
                onChange={handleInputChange}
            />

            <TextField
                id="valor_hora_aula"
                label="Valor hora aula"
                value={professor.valor_hora_aula}
                placeholder = "Informe o valor hora aula (em reais)"
                variant="filled"
                required
                fullWidth
                onChange={handleInputChange}
            />

            <TextField
                id="email"
                label="E-mail"
                value={professor.email}
                placeholder = "Informe o e-mail"
                variant="filled"
                required
                fullWidth
                onChange={handleInputChange}
            />

            <Toolbar className={classes.toolbar}>
                    <Button
                        variant='contained'
                        color="secondary"
                        type="submit"
                    >
                        Enviar
                    </Button>

                    <Button
                        variant='outlined'
                        onClick={handleVoltarButtonClick}
                    >
                        Voltar
                    </Button>

            </Toolbar>
        </form>
            {/* <p>
                {JSON.stringify(professor)}
            </p> */}
        </>
    )
}