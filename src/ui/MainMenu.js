import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from 'react-router-dom';
import {makeStyles} from "@mui/styles";

const useStyle = makeStyles(theme=>({
  link:{
    color: theme.palette.text.primary,
    textDecoration: 'none',
    width: '100%'
  },
  linkTitle:{
    textDecoration: 'none',
    fontSize: 20,
    padding: 16,
    width: '100%',
    color:theme.palette.secondary.main
  }
}))

export default function MainMenu() {

  const classes = useStyle()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
        <IconButton 
        edge="start" 
        color="inherit" 
        aria-label="menu" 
        sx={{ mr: 2 }}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}>
            <MenuIcon />
        </IconButton>
        
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
        >
            <span className={classes.linkTitle}>Alunos</span>
            <MenuItem onClick={handleClose}>
              <Link className={classes.link} to="/aluno">Listagem de alunos</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link className={classes.link} to="/aluno/novo">Cadastrar novo aluno</Link>
            </MenuItem>

            <span className={classes.linkTitle}>Professores</span>
            <MenuItem onClick={handleClose}>
              <Link className={classes.link} to="/professor">Listagem de professores</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link className={classes.link} to="/professor/novo">Cadastrar novo professor</Link>
            </MenuItem>

            <span className={classes.linkTitle}>Cursos</span>
            <MenuItem onClick={handleClose}>
              <Link className={classes.link} to="/curso">Listagem de cursos</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link className={classes.link} to="/curso/novo">Cadastrar novo curso</Link>
            </MenuItem>
        </Menu>
    </div>
  );
}
