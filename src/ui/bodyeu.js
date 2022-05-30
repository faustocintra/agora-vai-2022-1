import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import eu from '../Assets/eu.jpg'


export default function Appbody() {
    return(
        <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="200"
            image={eu}
            alt="Fernando"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Dev Fernando
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aluno da fatec
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    )
}