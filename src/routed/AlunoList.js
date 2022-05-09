import React, { useEffect } from 'react'
import api from '../api'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles(theme=>({
    datagrid:{
        '& .MuiDataGrid-row button': {
            visibility:'hidden'
        },
        '& .MuiDataGrid-row:hover button': {
            visibility:'visible'
        }
    }
  }))

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
    {
        field: 'doc_identidade',
        headerName: 'Doc. Identidade',
        width: 150,
      }, */
      {
        field: 'cpf',
        headerName: 'CPF',
        width: 150
      },
      /* {
        field: 'endereco',
        headerName: 'Endereço',
        width: 400,
        valueGetter:(params)=>
            params.row.logradouro + ', '+ params.row.num_imovel
      },
      {
        field: 'complemento',
        headerName: 'Complemento',
        width: 200,
      },
      {
        field: 'bairro',
        headerName: 'Bairro',
        width: 400
      },
      {
        field: 'municipio',
        headerName: 'Municipio',
        width: 300,
        valueGetter:(params)=>
            params.row.municipio + '/'+ params.row.uf
      }, */
      {
        field: 'telefone',
        headerName: 'Telefone',
        width: 200,
    
      },
      {
        field: 'email',
        headerName: 'E-Mail',
        width: 400
      },
      {
        field: 'turma',
        headerName: 'Turma',
        width: 150,
      },
      {
          field:'editar',
          headerName: 'Editar',
          width: 100,
          headerAlign: 'center',
          align: 'center',
          renderCell: params=>(
                <IconButton aria-label='Editar'>
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
            <IconButton aria-label='Excluir'>
                <DeleteForeverIcon color='error'/>
            </IconButton>
        )
    }
    
  ];

export default function AlunoList(){

    const classes = useStyles();

    const [state, setState] = React.useState(
        ()=>({
            data: null
        })
    )

    const {data} = state

    async function fetchData(){
        try{
            const response = await api.get('alunos')
            setState({...state, data: response.data})
        }
        catch(erro){
            console.error(erro)
        }
    }

    React.useEffect(()=>{
        fetchData()
    },[])

    return(
        //carregar dados no carregamento do componente
        //useEffect com vetor de dependecias VAZIO
        <>
            <h1>Listagem de alunos</h1>
            
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