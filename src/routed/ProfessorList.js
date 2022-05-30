import React, { useEffect } from 'react'
import api from '../api'
import { DataGrid, GridValueFormatterParams } from '@mui/x-data-grid';
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



export default function ProfessorList(){

    const classes = useStyles();

    const navigate = useNavigate();

    const columns = [
      {
        field: 'id',
        headerName: 'Cód',
        width: 100,
        type: 'number'
      },
      {
        field: 'nome',
        headerName: 'Nome do(a) Aluno(a)',
        width: 300
      },
     /*  {
        field: 'data_nascimento',
        headerName: 'Data Nasc',
        width: 150,
      },
      */
        {
          field: 'cpf',
          headerName: 'CPF',
          width: 150
        },
        {
          field: 'formacao',
          headerName: 'Formação',
          width: 400
        },
        {
          field: 'valor_hora_aula',
          headerName: 'Valor hora por aula',
          width: 150,
          valueFormatter: (params)=>{
            if(params.value == null) return ''

            return `R$ ${params.value}`
          }
        },
        
        {
          field: 'email',
          headerName: 'E-Mail',
          width: 200
        },
        {
            field:'editar',
            headerName: 'Editar',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: params=>(
                  <IconButton aria-label='Editar'
                    onClick={()=> navigate(`/professor/${params.id}`)}
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
            const response = await api.get('professores')
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
        await api.delete(`professores/${deleteID}`)
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
            <h1>Listagem de professores</h1>
            
            <Toolbar className={classes.toolbar}>
              <Button size='large' color="secondary" variant='contained' onClick={()=> navigate("/professor/novo")} startIcon={<PersonAddIcon/>}>
                
                Cadastrar novo professor
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