import * as React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function About() {

  const [likes, setLikes] = React.useState(
    () => parseInt(window.localStorage.getItem('likes')) || 0
  )

  React.useEffect(() => {
    window.localStorage.setItem('likes', likes)    
  }, [likes])

  return (
    <>
      <h1>Sobre o autor</h1>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="345"
          image='https://github.com/Leomendferre.png'
          alt="Minha foto"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Leonardo M. Ferreira
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Um estudante em busca do seu crescimento no mundo da programação.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            color="secondary"
            variant="contained"
            startIcon={<FavoriteIcon />}
            onClick={() => setLikes(likes + 1)}
          >
            Curtir ({likes})
          </Button>
        </CardActions>
      </Card>
    </>

  )
}
