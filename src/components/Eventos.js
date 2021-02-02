import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Evento from './Evento'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '25ch',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 180,
        marginLeft: 12
      },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
        float: 'right'
    },
}));

export default function Eventos() {
    const classes = useStyles();
    const [eventos, setEventos] = useState([])
    //estado para nuevo evento
    const [evtNombre, setEvtNombre] = useState("")
    const [evtLugar, setEvtLugar] = useState("")
    const [evtCategoria, setEvtCategoria] = useState("")
    const [evtDireccion, setEvtDireccion] = useState("")
    const [evtFechaInicio, setEvtFechaInicio] = useState("")
    const [evtFechaFin, setEvtFechaFin] = useState("")
    const [evtPresencial, setEvtPresencial] = useState(false)
    
    //modal
    const [open, setOpen] = useState(false)

    //onMount
    useEffect(() => {
        const id = localStorage.getItem("id")
        if (id) {
            fetch(`/api/eventos/${id}`)
            .then(resp => {
                return resp.json()
            })
            .then(json => {
                if (!('error' in json)) {
                    setEventos(json)
                    console.log(json)
                } else {
                    console.log(json["error"])
                }
            })
            .catch(err => {
                alert(`Error: ${err}`)
                console.log(err)
            })
        } else {
            alert("Haz login para gestionar tus eventos")
        }
    }, [])

    function crearEvento(evt) {
        evt.preventDefault()
        const evtDatos = {
            nombre: evtNombre,
            categoria: evtCategoria,
            lugar: evtLugar,
            direccion: evtDireccion,
            f_inicio: new Date(evtFechaInicio).getTime(),
            f_fin: new Date(evtFechaFin).getTime(),
            presencial: evtPresencial
        }
        const id = localStorage.getItem("id")
        const url = `/api/eventos/${id}`
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(evtDatos)
        })
        .then(resp => {
            return resp.json()
        })
        .then(json => {
            if (json['error'])
                alert(`Error: ${json['error']}`)
            else {
                let newArr = [...eventos]
                newArr.unshift({
                    id: json["id"],
                    nombre: evtNombre,
                    categoria: evtCategoria,
                    lugar: evtLugar,
                    direccion: evtDireccion,
                    f_inicio: evtFechaInicio,
                    f_fin: evtFechaFin,
                    presencial: evtPresencial
                })
                setEventos(newArr)
                alert ("Evento creado!")
                setOpen(false)
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
            <div className={classes.heroContent}>
                <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Gestor de Eventos
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    Visualiza, crea y edita tus eventos.
                </Typography>
                <div className={classes.heroButtons}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        justify="center"
                        onClick={() => setOpen(true)}
                    >
                        Crea un Evento
                    </Button>
                    {/* Modal CREAR EVENTO */}
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={() => setOpen(false)}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                        <div className={classes.paper}>
                            <h1 id="transition-modal-title">Detalles del Evento:</h1>
                            <form onSubmit={crearEvento}>
                                <div>
                                <Grid container spacing={3}>
                                    {/* Nombre */}
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="nombre"
                                        name="nombre"
                                        label="Nombre"
                                        fullWidth
                                        autoComplete="given-name"
                                        value={evtNombre}
                                        onChange={evt => setEvtNombre(evt.target.value)}
                                    />
                                    </Grid>
                                    {/* Lugar */}
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="lugar"
                                        name="lugar"
                                        label="Lugar"
                                        fullWidth
                                        autoComplete="family-name"
                                        value={evtLugar}
                                        onChange={evt => setEvtLugar(evt.target.value)}
                                    />
                                    </Grid>
                                    {/* Dirección */}
                                    <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="direccion"
                                        name="direccion"
                                        label="Dirección"
                                        fullWidth
                                        autoComplete="shipping address-line1"
                                        value={evtDireccion}
                                        onChange={evt => setEvtDireccion(evt.target.value)}
                                    />
                                    </Grid>
                                    {/* Fecha Inicio */}
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="f-inicio"
                                        name="f-inicio"
                                        label="Fecha de Inicio"
                                        type="datetime-local"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={evtFechaInicio}
                                        onChange={evt => setEvtFechaInicio(evt.target.value)}
                                    />
                                    </Grid>
                                    {/* Fecha Fin */}
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="f-fin"
                                        name="f-fin"
                                        label="Fecha de Fin"
                                        type="datetime-local"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={evtFechaFin}
                                        onChange={evt => setEvtFechaFin(evt.target.value)}
                                    />
                                    </Grid>
                                    {/* Categoría */}
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="categoria-label">Categoría</InputLabel>
                                        <Select
                                            required
                                            labelId="categoria-label"
                                            id="categoria-select"
                                            value={evtCategoria}
                                            onChange={evt => setEvtCategoria(evt.target.value)}
                                        >
                                            <MenuItem value={"conferencia"}>Conferencia</MenuItem>
                                            <MenuItem value={"seminario"}>Seminario</MenuItem>
                                            <MenuItem value={"congreso"}>Congreso</MenuItem>
                                            <MenuItem value={"curso"}>Curso</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {/* Presencialidad */}
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="presencialidad-label">Presencialidad</InputLabel>
                                        <Select
                                            required
                                            labelId="presencialidad-label"
                                            id="presencialidad-select"
                                            value={evtPresencial}
                                            onChange={evt => setEvtPresencial(evt.target.value)}
                                        >
                                            <MenuItem value={true}>Presencial</MenuItem>
                                            <MenuItem value={false}>Virtual</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {/* Submit */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        className={classes.button}
                                    >
                                        Crear!
                                    </Button>
                                </Grid>
                                </div>
                            </form>
                        </div>
                        </Fade>
                    </Modal>
                </div>
                </Container>
            </div>
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                {eventos.length ? eventos.map((evt, idx) => (
                    <Evento
                        key={idx}
                        classes={classes}
                        eventos={eventos}
                        setEventos={setEventos}
                        ind={idx}
                        evtId={evt.id}

                        nombre={evt.nombre}
                        lugar={evt.lugar}
                        direccion={evt.direccion}
                        f_inicio={evt.f_inicio}
                        f_fin={evt.f_fin}
                        categoria={evt.categoria}
                        presencial={evt.presencial}
                    />
                )) : ""}
                </Grid>
            </Container>
            </main>
        </React.Fragment>
    )
}