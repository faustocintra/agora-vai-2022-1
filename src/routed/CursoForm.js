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

export default function CursoForm(){

    const classes = useStyles()

    const navigate = useNavigate()

    const params = useParams()

    const [state, setState] = React.useState(
        ()=>({
            curso:{ 
                sigla:"",
                descricao:"",
                duracao_meses:"",
                carga_horaria:"",
                valor_total:""},
            alertSeverity: "success",
            isAlertOpen: false,
            alertMessage: "",
            isModalProgressOpen: false,
            pageTitle: 'Cadastrar novo curso',
            isDialogOpen: false
        })
    )

    const {curso,
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
            const response = await api.get(`cursos/${params.id}`)
            setState({
                    ...state,
                    curso: response.data,
                    pageTitle: 'Editando curso id. ' + params.id
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

        const newCurso = {...curso} //Tira uma cópia do curso

        //O componente desktopDatePicker envia o novo valor em vez de event
        //portanto é necessario tratamento especifico para ele
        newCurso[fieldName] = event.target.value

        
        setState({...state, curso:newCurso})
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setState({...state, isAlertOpen: false, isModalProgressOpen: false})


        if(alertSeverity === 'success') navigate('/curso')
      };


      function handleFormSubmit(event){
          event.preventDefault()
          saveData()
      }

      async function saveData(){

        setState({...state, isModalProgressOpen:true})


        try{

            if(curso.id) await api.put(`cursos/${params.id}`, curso)
            else await api.post('cursos', curso )

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
          for(let field in curso){
              if(curso[field] !== '') return true
          }
          return false
      }

      function handleVoltarButtonClick(){
        // Se o formulário tiver sido modificado, chama a caixa de diálogo
        // para perguntar se o usuário realmente quer voltar, perdendo dados
        if (isFormModified()) setState({...state,isDialogOpen: true})

        else navigate('/curso')
      }

      function handleDialogClose(answer){

        setState({...state, isDialogOpen: false})

        if(answer) navigate ('/curso')
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
                id="sigla"
                label="Sigla"
                value={curso.sigla}
                placeholder = "Informe a sigla do curso"
                variant="filled"
                required
                fullWidth
                onChange={handleInputChange}
            />

            <TextField
                id="descricao"
                label="Descrição"
                value={curso.descricao}
                placeholder = "Descrição"
                variant="filled"
                required
                fullWidth
                onChange={handleInputChange}
            />
            <TextField
                id="duracao_meses"
                label="Duração (meses)"
                value={curso.duracao_meses}
                placeholder = "Informe a duração em meses"
                variant="filled"
                required
                fullWidth
                onChange={handleInputChange}
            />

            <TextField
                id="carga_horaria"
                label="Carga horaria"
                value={curso.carga_horaria}
                placeholder = "Informe a carga horária"
                variant="filled"
                required
                fullWidth
                onChange={handleInputChange}
            />

            <TextField
                id="valor_total"
                label="Valor total"
                value={curso.valor_total}
                placeholder = "Informe o valor total"
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
                {JSON.stringify(curso)}
            </p> */}
        </>
    )
}