import React from 'react'
import api from '../api'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
import AlertBar from '../ui/AlertBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const useStyles = makeStyles(theme => ({
  datagrid: {
    '& .MuiDataGrid-row button': {
      visibility: 'hidden'
    },
    '& .MuiDataGrid-row:hover button': {
      visibility: 'visible'
    }
  },
  toolbar: {
    padding: 0,
    justifyContent: 'flex-end',
    margin: '20px 0'
  }
}))

export default function AlunoList() {

    const classes = useStyles()

    const navigate = useNavigate()

    const columns = [
      {
        field: 'id',
        headerName: 'Cód.',
        width: 150,
        //flex: 1,
        type: 'number'  // Coluna alinha à direita
      },
      {
        field: 'nome',
        headerName: 'Nome do(a) aluno(a)',
        width: 400
        //flex: 2
      },
      /*{
        field: 'data_nascimento',
        headerName: 'Data Nasc.',
        width: 150
      },
      {
        field: 'doc_identidade',
        headerName: 'Doc. Identidade',
        width: 150
      },*/
      {
        field: 'cpf',
        headerName: 'CPF',
        width: 150,
        //flex: 1
      },
      /*{
        field: 'endereco',
        headerName: 'Endereço',
        width: 400,
        valueGetter: (params) =>
          params.row.logradouro + ', ' + params.row.num_imovel
      },
      {
        field: 'complemento',
        headerName: 'Complemento',
        width: 200
      },
      {
        field: 'bairro',
        headerName: 'Bairro',
        width: 200
      },
      {
        field: 'municipio',
        headerName: 'Município',
        width: 300,
        valueGetter: (params) =>
          params.row.municipio + '/' + params.row.uf
      },*/
      {
        field: 'telefone',
        headerName: 'Telefone',
        width: 200,
        //flex: 1
      },
      {
        field: 'email',
        headerName: 'E-mail',
        width: 350
        //flex: 1
      },
      {
        field: 'turma',
        headerName: 'Turma',
        width: 150,
        //flex: 1
      }, 
      {
        field: 'editar',
        headerName: 'Editar',
        width: 100,
        headerAlign: 'center',
        align: 'center',
        renderCell: params => (
          <IconButton 
            aria-label='Editar'
            onClick={() => navigate(`/aluno/${params.id}`)}
          >
            <EditIcon />
          </IconButton>
        )
      },
      {
        field: 'excluir',
        headerName: 'Excluir',
        width: 100,
        headerAlign: 'center',
        align: 'center',
        renderCell: params => (
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
        // Lazy intializer
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
      isAlertOpen
    } = state

    function handleDeleteClick(id) {
      // Abrir a caixa de diálogo
      setState({...state, isDialogOpen: true, deleteId: id })
    }

    async function fetchData(newState = state) {
        try {
            const response = await api.get('alunos')
            setState({...newState, data: response.data, isDialogOpen: false})
        }
        catch(erro) {
            // Mostrar erro com barra de alerta
            setState({
              ...newState,
              alertMessage: 'ERRO: ' + erro.message,
              alertSeverity: 'error',
              isAlertOpen: true
            })
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    function handleDialogClose(answer) {
      // Fechar a caixa de diálogo
      setState({...state, isDialogOpen: false})

      // Se a resposta for positiva, procedemos à exclusão do item
      if (answer) deleteItem()
    }

    async function deleteItem() {
      try {
        await api.delete(`aluno/${deleteId}`)
        // Fecha a caixa de diálogo e exibe a barra de alerta
        const newState = {
          ...state, 
          isDialogOpen: false,
          alertMessage: 'Exclusão efetuada com sucesso',
          alertSeverity: 'success',
          isAlertOpen: true
        }
        fetchData(newState) // Recarrega os dados da lista        
      }
      catch(error) {
        // Aqui vai mensagem de feedback dizendo que deu erro na exclusão
        // Fechar a caixa de diálogo e esibe a barra de alerta
        setState({
          ...state, 
          isDialogOpen: false,
          alertMessage: 'ERRO: ' + error.message,
          alertSeverity: 'error',
          isAlertOpen: true
        })

      }
    }

    function handleAlertClose(event, reason) {
      if (reason === 'clickaway') {
        return;
      }
  
      // Fecha a barra de alerta
      setState({...state, isAlertOpen: false})
    }

    return (
        <>
          <ConfirmDialog 
            title="Confirmar exclusão" 
            open={isDialogOpen}
            onClose={handleDialogClose}
          >
            Deseja realmente excluir este registro?
          </ConfirmDialog>

          <AlertBar 
            severity={alertSeverity} 
            open={isAlertOpen}
            onClose={handleAlertClose}
          >
            {alertMessage}
          </AlertBar>

          <h1>Listagem de alunos</h1>

          <Toolbar className={classes.toolbar}>
            <Button 
              size="large"
              variant="contained"
              color="secondary"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/aluno/novo')}
            >
              Cadastrar novo aluno
            </Button>
          </Toolbar>

          <Paper elevation={4}>
            <DataGrid
              className={classes.datagrid}
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