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
}));

export default function AlunoList() {
    
    const classes = useStyles()

    const navigate = useNavigate() // permite que nós navegamos de uma página pra outra

    const columns = [
        {
          field: 'id',
          headerName: 'Cód.',
          width: 150,
          type: 'number'
        },
        {
          field: 'nome',
          headerName: 'Nome do(a) aluno(a)',
          width: 400
        },
        /*{
          field: 'data_nascimento',
          headerName: 'Doc. Nasc.',
          width: 150
        },*/
        /*{
            field: 'doc_identidade',
            headerName: 'Doc. Identidade.',
            width: 150
        },*/
        {
            field: 'cpf',
            headerName: 'CPF',
            width: 150
        },
        /*{
            field: 'endereco',
            headerName: 'Endereço',
            width: 400,
            valueGetter:(params) =>
            params.row.logradouro + ', ' + params.row.num_imovel
        },*/
        /*{
            field: 'complemento',
            headerName: 'Complemento',
            width: 200
        },*/
        /*{
            field: 'bairro',
            headerName: 'Bairro',
            width: 200
        },*/
        /*{
            field: 'municipio',
            headerName: 'Município',
            width: 300,
            valueGetter:(params) =>
            params.row.municipio + '/' + params.row.uf
        },*/
        {
            field: 'telefone',
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
            width: 150
        },
        {
            field: 'editar',
            headerName: 'Editar',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: params => (
                <IconButton aria-label='Editar' 
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
                <IconButton aria-label='Excluir' 
                    onClick={() => handleDeleteClick(params.id)}
                >
                    <DeleteForeverIcon color="error" />
                </IconButton>
            )
        },
      ];

        // carregar os dados no carregamento do
        // componente -> useEffect c/ vetor de dependencia vazio
        const [state, setState] = React.useState(
            // lazy initializer
            () => ({
                data: null,
                isDialogOpen: false,
                deleteId: null, 
                alertMessage: '',
                alertSeverity:'success',
                isAlertOpen: false
            })
        )
        // desestruturação
        const { data, isDialogOpen, deleteId, alertMessage, alertSeverity, isAlertOpen } = state

        function handleDeleteClick(id) {
            setState({...state, isDialogOpen:true, deleteId: id})
        }
    
        async function fetchData(newState = state) {
            try {
                const response = await api.get('alunos')
                setState({...newState, data: response.data, isDialogOpen: false})
            }
            catch(erro) {
                // Mostrar erro com barra de alertas
                setState ({
                    ...newState,
                    alertMessage: 'Erro: ' + erro.message,
                    alertSeverity: 'error',
                    isAlertOpen: true
                })
            }
        }

        React.useEffect(() => {
            fetchData()
        }, [])

        function handleDialogClose(answer) {
            // fechar a caixa de diálogo
            setState({...state, isDialogOpen: false})

            if (answer) deleteItem()
        }

        async function deleteItem() {
            try {
                await api.delete(`aluno/${deleteId}`)
                const newState = ({...state, isDialogOpen: false, isAlertOpen: true, alertMessage: 'Exclusão realizada', alertSeverity: 'success'})
                fetchData(newState) // Recarrega os dados da lista
            }
            catch(error) {
                // Aqui vai mensagem de feedback dizendo que deu erro na exclusão
                setState({...state, isDialogOpen: false, 
                    alertMessage: 'ERRO: ' + error.message,
                    alertSeverity: 'error',
                    isAlertOpen: true
                })
            }
        }

        const handleAlertClose = (event, reason) => {
            if (reason === 'clickaway') {
              return;
            }
            // fecha a barra de alerta
            setState({...state, isAlertOpen: false})
          };

        return (
            <>
            <ConfirmDialog title="Confirmar exclusão"
                open={isDialogOpen} 
                onClose={handleDialogClose}>
                    Deseja realmente excluir este registro?
            </ConfirmDialog>

            <AlertBar severity={alertSeverity} open={isAlertOpen} onClose={handleAlertClose}>
                {alertMessage}
            </AlertBar>

                <h1> Listagem de alunos </h1>

                <Toolbar className={classes.toolbar}>
                    <Button 
                    size='large' 
                    variant='contained'
                    color='secondary'
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate('/aluno/novo')}>
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