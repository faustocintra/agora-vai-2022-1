import React from "react";
import api from "../api";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from "@mui/material/IconButton";
import Editicon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'    
import { makeStyles } from "@mui/styles";


const useStyle = makeStyles(theme => ({
    DataGrid: {
        '& .MuiDataGrid-row button':{
            visibility: 'hidden'
        },
        '& .MuiDataGrid-row button':{
            visibility: 'visible'
        }
    }
}))

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
            <IconButton aria-label='Editar'>
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
          <IconButton aria-label='Excluir'>
              <DeleteForeverIcon color="error" />
          </IconButton>
        )
    }
  ];

export default function AlunoList(){

    const classes = useStyle()

    const [state, setState] = React.useState(
        //Lazy Inicializer
        () => ({
            data: null
        })
    )
    // Desestruturação
    const { data } = state

    async function fetchData() {
        try {
            const response = await api.get('alunos')
            setState({...state, data: response.data})
        }
        catch(erro){
            console.error(erro)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])
    return(
        <>
        <h1>Listagem de alunos</h1>
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