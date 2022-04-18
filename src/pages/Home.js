import { Container, Grid } from '@mui/material'
import React from 'react'
import Tasks from '../components/home/Tasks'

const Home = () => {
  return (
    <Container>
      <Grid container>
        <Grid item md={12} xs={12}>
          <Tasks />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home