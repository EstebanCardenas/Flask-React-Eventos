import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();

  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  function login(evt) {
    evt.preventDefault()
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
          usuario: user,
          contrasena: pass
      })
    })
    .then(resp => resp.json())
    .then(json => {
      console.log(json)
      if (json['error']) {
        alert(`Error: ${json['error']}`)
        return
      }
      localStorage.setItem("id", json["id"])
      localStorage.setItem("usuario", json["usuario"])
      localStorage.setItem("access_token", json["access_token"])
      localStorage.setItem("refresh_token", json["refresh_token"])
      window.location.replace("/gestor")
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} onSubmit={login}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="username"
            label="Usuario"
            id="username"
            value={user}
            onChange={evt => setUser(evt.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={pass}
            onChange={evt => setPass(evt.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Entrar
          </Button>
          <Link href="/registro" variant="body2">
            {"¿No tienes una cuenta? Regístrate"}
          </Link>
        </form>
      </div>
    </Container>
  );
}