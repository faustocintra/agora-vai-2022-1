import React from "react";
import api from "../api";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from "@mui/material/IconButton";
import Editicon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'    
import { makeStyles } from "@mui/styles";
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../ui/ConfirmDialog';
import AlertBar from "../ui/alertBar";
import Toolbar from '@mui/material/Toobar';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


const useStyle = makeStyles(theme => ({
    DataGrid: {
        '& .MuiDataGrid-row button':{
            visibility: 'hidden'
        },
        '& .MuiDataGrid-row button':{
            visibility: 'visible'
        }
    },
    toolbar:{
      padding: 0,
      justifyContent: 'flex-end',
      margin: '20px 0'
    }
}))



export default function AlunoList(){

    const classes = useStyle()

    const navigate = useNavigate()

    const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      {
        field: 'id',
        headerName: 'Cód',
        width: 150,
        type: 'number' //coluna alinha a direta
      },
      {
        field: 'nome',
        headerName: 'nome do(a) aluno(a)',
        width: 400
      },
      /*{
        field: 'data_nascimento',
        headerName: 'Data Nasc',
        width: 150
      },*/
      {
          field: 'doc_identidade',
          headerName: 'Doc. Identidade',
          width: 150
        },
        /*{
          field: 'cpf',
          headerName: 'CPF',
          width: 150
        },*/
        /*{
          field: 'endereco',
          headerName: 'Endereco',
          width: 400,
          valueGetter: (params) =>
            params.row.logradouro + ', ' + params.row.num_imovel
        },*/
        /*{
          field: 'complemento',
          headerName: 'Complemento',
          width: 200
        },
  
        {
          field: 'bairro',
          headerName: 'Bairro',
          width: 200
        },*/
        /*{
          field: 'municipio',
          headerName: 'Municipio',
          width: 300,
          valueGetter: (params) =>
              params.row.municipio + '/' + params.row.uf
        },*/
        {
          field: 'teleone',
          headerName: 'Telefone',
          width: 200
        },
        {
          field: 'email',
          headerName: 'E-mail',
          width: 200
        },
        {
          field: 'turma',
          headerName: 'Turma',
          width: 200
        },
        {
            field: 'editar',
            headerName: 'Turma',
            width: 150,
            HeaderAlign: 'center',
            align: 'center',
            renderCell: params =>(
              <IconButton 
              aria-label='Editar'
              onClick={() => navigate(`/aluno/${params.id}`)}
              >
                  <Editicon />
              </IconButton>
            )
        },
        {
          field: 'excluir',
          headerName: 'Excluir',
          width: 150,
          HeaderAlign: 'center',
          align: 'center',
          renderCell: params =>(
            <IconButton 
            aria-label='Excluir'
            onClick={() => handleDeleteClick(params.id)}
            >
                <DeleteForeverIcon color="error" />
            </IconButton>
          )
      }
    ];

    const [state, setState] = React.useState(
        //Lazy Inicializer
        () => ({
            data: null,
            isDialogOpen: false,
            deleteId: null,
            alertMessage: '',
            alertSeverity: 'success',
            isAlertOpen: false
        })
    )
    // Desestruturação
    const { 
      data, 
      isDialogOpen, 
      deleteId, 
      alertMessage, 
      alertSeverity, 
      isAlertOpen} = state
    
    function handleDeleteClick(id){
      /*if(Window.confirm('Deseja realmente deletar esse pobre usuário?')){
        alert('Vou excluir')
      }
      else{
        alert('Não vou excluir')
      }*/
      //Abrir a caixa de diálogo
      setState({...state, isDialogOpen: true, deleteId: id})
    }

    async function fetchData(newState = state) {
        try {
            const response = await api.get('alunos')
            setState({...newState, data: response.data, isDialogOpen: false})
        }
        catch(erro){
          //Mostrar erro com barra de alerta
          setState({
            ...newState,
            alertMessage:'ERRO: ' + erro.message,
            alertSeverity:'error',
            isAlertOpen: true
          })
            console.error(erro)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    function handleDialogClose(answer){
      //Fechar a caixa de dialogo
      setState({...state, isDialogOpen: false})
      //Se a resposta for positico, procedemos à exclusão do item
      if(answer) deleteId()
    }

    async function deleteItem(){
    try{
      await api.delete(`aluno/${deleteId}`)
      //aqui vai a mensagem de feedback dizendo que a exclusão foi OK
      const newState = {
        ...state, 
        isDialogOpen: false,
        alertMessage: 'Exclusão efetuada com sucesso',
        alertSeverity: 'success',
        isAlertOpen: true
      }
      fetchData(newState)//recarrega os dados da lista
    }
      catch(error){
        //aqui vai a mensagem de feedback dizendo que deu erro na exlusão
        //alert('Erro: ' + error.message)
        setState({...state, 
          isDialogOpen: false,
          alertMessage: 'ERRO: ' + error.message,
          alertSeverity: 'error',
          isAlertOpen: true
        })
      }
    }

    const handleAlertClose(event, reason) {
      if (reason === 'clickaway') {
        return;
      }
  
      //Fecha a barra de alerta
      setState({...state, isAlertOpen: false})
    };

    
    return(
        <>
        <ConfirmDialog 
          title="Confirmar exclusão" 
          open={isDialogOpen}
          onClose={handleDialogClose}
        >
          Deseja realmente exlcuir este registro
        </ConfirmDialog>
        <AlertBar severity={alertSeverity} open={isAlertOpen} onClose={handleAlertClose}>
          {alertMessage}
        </AlertBar>
        <h1>Listagem de alunos</h1>

        <toolbar className={classes.toolbar}>
          <button 
          size="large"
          variant="contained" 
          color="secundary" 
          startIcon={<PersonAddIcon/>}
          onClick={() => navigate('/aluno/novo')}
          >
            Cadastrar novo aluno
          </button>
        </toolbar>
        <paper elevation={10}>
        <DataGrid
        className={classes.DataGrid}
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        disableSelectionOnClick
      />
      </paper>
        </>
    )
}