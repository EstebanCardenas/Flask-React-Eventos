import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
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

export default function Register() {
  const classes = useStyles();

  const [email, setEmail] = useState("")
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  function handleRegister(evt) {
    evt.preventDefault()
    fetch('/registro', {
        method: "POST",
        body: JSON.stringify({
          usuario: user,
          email: email,
          contrasena: pass
        })
    })
    .then(resp => resp.json())
    .then(json => {
        if (json['error']) {
            alert(`Error: ${json['error']}`)
            return
        }
        localStorage.setItem("id", json["id"])
        localStorage.setItem("usuario", json["usuario"])
        localStorage.setItem("access_token", json["access_token"])
        localStorage.setItem("refresh_token", json["refresh_token"])
        alert("Registro exitoso!")
        window.location.replace("/")
    })
    .catch(err => {
        console.log(err)
        alert(`No se pudo realizar el registro: ${err}`)
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
          Registro
        </Typography>
        <form className={classes.form} onSubmit={handleRegister}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="email"
            id="email"
            label="Correo"
            value={email}
            onChange={evt => setEmail(evt.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="username"
            id="username"
            label="Usuario"
            value={user}
            onChange={evt => setUser(evt.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            label="Contraseña"
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
            Registrarse
          </Button>
        </form>
      </div>
    </Container>
  );
}