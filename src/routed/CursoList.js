import React, { useEffect } from 'react'
import api from '../api'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {makeStyles} from '@mui/styles'
import {useNavigate} from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
import AlertBar from "../ui/AlertBar"
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const useStyles = makeStyles(theme=>({
    datagrid:{
        '& .MuiDataGrid-row button': {
            visibility:'hidden'
        },
        '& .MuiDataGrid-row:hover button': {
            visibility:'visible'
        }
    },
    toolbar:{
      padding:0,
      justifyContent: 'flex-end',
      margin: "20px 0"
    }
  }))

export default function CursoList(){

    const classes = useStyles();

    const navigate = useNavigate();

    const columns = [
      {
        field: 'id',
        headerName: 'Cód.',
        width: 150,
        type: 'number'
      },
      {
        field: 'sigla',
        headerName: 'Sigla',
        width: 400
      },
      {
        field: 'descricao',
        headerName: 'Descrição',
        width: 150,
      },
      {
        field: 'duracao_meses',
        headerName: 'Duração em meses',
        width: 200,
      },
      {
        field: 'carga_horaria',
        headerName: 'Carga horária',
        width: 350
      },
      {
        field: 'valor_total',
        headerName: 'Valor total',
        width: 150,
      }, 

        {
            field:'editar',
            headerName: 'Editar',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: params=>(
                  <IconButton aria-label='Editar'
                    onClick={()=> navigate(`/curso/${params.id}`)}
                  >
                    <EditIcon></EditIcon>
                  </IconButton>)
            
        },
        {
          field:'excluir',
          headerName: 'Excluir',
          width: 100,
          headerAlign: 'center',
          align: 'center',
          renderCell: params=>(
              <IconButton aria-label='Excluir'
                onClick={()=> handleDeleteClick(params.id)}
                >
                  <DeleteForeverIcon color='error'/>
              </IconButton>
          )
      }
      
    ];

    const [state, setState] = React.useState(
        ()=>({
            data: null,
            isDialogOpen: false,
            deleteID:null,
            alertMessage: '',
            alertSeverity: "success",
            isAlertOpen: false
        })
    )

    const {data, isDialogOpen, deleteID, alertMessage, alertSeverity, isAlertOpen} = state

        function handleDeleteClick(id){
          setState({...state, isDialogOpen: true, deleteID: id})
        }

    async function fetchData(newState = state){
        try{
            const response = await api.get('cursos')
            setState({...newState, data: response.data, isDialogOpen:false})
        }
        catch(erro){
            setState({
              ...state,
                alertMessage: "ERRO" + erro,
                isAlertOpen: true,
                alertSeverity: "error"
            })
            console.error(erro)
        }
    }

    React.useEffect(()=>{
        fetchData()
    },[])

    function handleDialogClose(answer){
      setState({...state, isDialogOpen: false})
      if(answer) deleteItem()
    }

    async function deleteItem(){
      try{
        await api.delete(`cursos/${deleteID}`)
        const newState = {...state, isDialogOpen: false, isAlertOpen: true, alertMessage: "Exclusão realizada", alertSeverity: "success"}
        fetchData(newState)
      }catch(error){
        setState({...state, isDialogOpen: false, isAlertOpen: true, alertMessage: "ERRO:"+ error, alertSeverity: "error"})
      }
    }

    const handleAlertClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setState({...state, isAlertOpen: false})
    };

    return(
        //carregar dados no carregamento do componente
        //useEffect com vetor de dependecias VAZIO
        <>
            <ConfirmDialog title={"Confirmar exclusão"}
              open={isDialogOpen}
              onClose={handleDialogClose}
              children={"Deseja realmente exluir o registro?"}
            />
            <AlertBar severity={alertSeverity} open={isAlertOpen} children={alertMessage} onClose={handleAlertClose}/>
            <h1>Listagem de cursos</h1>
            
            <Toolbar className={classes.toolbar}>
              <Button size='large' color="secondary" variant='contained' onClick={()=> navigate("/aluno/novo")} startIcon={<PersonAddIcon/>}>
                
                Cadastrar novo curso
              </Button>
            </Toolbar>

            <Paper elevation={4}>
                <DataGrid className={classes.datagrid}
                rows={data}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
                autoHeight
                disableSelectionOnClick
                        />
            </Paper>
        </>
        
    )
}