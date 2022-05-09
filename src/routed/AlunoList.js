import React from 'react'
import api from '../api'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import IconButton  from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit' 
import DeleteForeverIcon from '@mui/icons-material/DeleteForever' 
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles (theme => ({
   datagrid: {
       '& .MuiDataGrid-row button' : {
        visibility: 'hidden'
       },
       '& .MuiDataGrid-row:hover button' : {
        visibility: 'visible'
       }
   }
})) 

const columns = [
    {
      field: 'id',
      headerName: 'Cód',
      width: 150,
      type: 'number' //coluna alinha a direita
    },
    {
      field: 'nome',
      headerName: 'Nome do(a) Aluno(a)',
      width: 400
    },
    /*{
      field: 'data_nascimento',
      headerName: 'Data Nasc.',
      width: 150
    },
    {
      field: 'doc_identidade',
      headerName: 'Documento Identidade',
      width: 150
    },*/
    {
      field: 'cpf',
      headerName: 'CPF',
      width: 150
    },
    /*{
      field: 'endereço',
      headerName: 'Endereço',
      width: 400,
      valueGetter: (params) =>
     `${params.row.logradouro || ''} ${params.row.num_imovel}`,
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
      `${params.row.municipio || ''} ${params.row.uf}`,
    },*/
    {
      field: 'telefone',
      headerName: 'Telefone',
      width: 200
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 350
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
        <IconButton arial-label = 'Editar'>
            <EditIcon/>
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
          <IconButton arial-label = 'Excluir'>
              <DeleteForeverIcon color="error"/>
          </IconButton>
        )
    }
  ];
  

export default function AlunoList() {

    const classes = useStyles()

    const[state, setState] = React.useState(
        //Lazy intializer
        () => ({
          data: null
        })
    )

    //Desestruturação
    const {data} = state
    async function fetchData(){
        try {
            const response = await api.get('alunos')
            setState({...state,data: response.data})
        }
        catch(erro){
            console.error.apply(erro)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <h1> Listagem de alunos</h1>
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
            {/* <p>
                {JSON.stringify(data)}
            </p> */}
        </>
    )
}