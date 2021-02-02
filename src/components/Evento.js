import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useState } from 'react';
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

export default function Evento(props) {
    //hooks
    const [openVer, setOpenVer] = useState(false)
    const [openEditar, setOpenEditar] = useState(false)

    const [evtNombre, setEvtNombre] = useState(props.nombre)
    const [evtLugar, setEvtLugar] = useState(props.lugar)
    const [evtCategoria, setEvtCategoria] = useState(props.categoria)
    const [evtDireccion, setEvtDireccion] = useState(props.direccion)
    const [evtFechaInicio, setEvtFechaInicio] = useState(props.f_inicio)
    const [evtFechaFin, setEvtFechaFin] = useState(props.f_fin)
    const [evtPresencial, setEvtPresencial] = useState(props.presencial)

    //funciones
    function eliminarFront() {
        let newArr = [...props.eventos]
        let rmvIdx = (a, idx) => a.slice(0,idx).concat(a.slice(idx+1, a.length))
        props.setEventos(rmvIdx(newArr, props.ind))
    }

    function eliminar() {
        const url = `/api/eventos/${props.evtId}`
        fetch(url, {
            method: 'DELETE'
        })
        .then(resp => resp.json())
        .then(json => {
            if (json["error"]) {
                alert(`Error: ${json["error"]}`)
                return
            }
            eliminarFront()
        })
    }

    function darEventosModificados() {
        const newEvs = [...props.eventos]
        const newEv = {}
        if (evtNombre !== props.nombre) {
            newEvs[props.ind].nombre = evtNombre
            newEv["nombre"] = evtNombre
        }
        if (evtCategoria !== props.categoria) {
            newEvs[props.ind].categoria = evtCategoria
            newEv["categoria"] = evtCategoria
        }
        if (evtLugar !== props.lugar) {
            newEvs[props.ind].lugar = evtLugar
            newEv["lugar"] = evtLugar
        }
        if (evtDireccion !== props.direccion) {
            newEvs[props.ind].direccion = evtDireccion
            newEv["direccion"] = evtDireccion
        }
        if (evtFechaInicio !== props.f_inicio) {
            newEvs[props.ind].f_inicio = evtFechaInicio
            newEv["f_inicio"] = new Date(evtFechaInicio).getTime()
        }
        if (evtFechaFin !== props.f_fin) {
            newEvs[props.ind].f_fin = evtFechaFin
            newEv["f_fin"] = new Date(evtFechaFin).getTime()
        }
        if (evtPresencial !== props.presencial) {
            newEvs[props.ind].presencial = evtPresencial
            newEv["presencial"] = evtPresencial
        }
        //Devolver modificado
        return Object.keys(newEv).length ? [newEvs, newEv] : []
    }

    function editarEvento(evt) {
        evt.preventDefault()
        const mod = darEventosModificados()
        if (mod.length) {
            const newEv = mod[1]
            const uid = localStorage.getItem("id")
            fetch(`/api/eventos/${uid}/${props.evtId}`, {
                method: 'PUT',
                body: JSON.stringify(newEv)
            })
            .then(resp => resp.json())
            .then(json => {
                if (json['error']) {
                    alert(`Error: ${json['error']}`)
                    return
                }
                //actualizar front
                props.setEventos(mod[0])
                alert("Evento actualizado!")
                setOpenEditar(false)
            })
        } else {
            alert("No se ha modificado ningún atributo")
        }
    }

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card>
            <CardHeader
                title={props.nombre}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                className={props.classes.classHeader}
            />
            <CardContent>
                <Typography variant="h6">
                    <b>Categoría:</b> {props.categoria[0].toUpperCase() + props.categoria.slice(1).toLowerCase()}
                </Typography>
                <Typography variant="h6">
                    <b>Lugar:</b> {props.lugar[0].toUpperCase() + props.lugar.slice(1).toLowerCase()}
                </Typography>
            </CardContent>
            <CardActions>
                {/* Modal Ver */}
                <Button size="small" color="primary" onClick={() => setOpenVer(true)}>
                    Ver
                </Button>
                <Modal
                    aria-labelledby="transition-modal-verEvento"
                    className={props.classes.modal}
                    open={openVer}
                    onClose={() => setOpenVer(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openVer}>
                        <div className={props.classes.paper}>
                            <h1 id="transition-modal-title">Detalles del Evento:</h1>
                            <div>
                                <Grid container spacing={3}>
                                    {/* Nombre */}
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="ver-nombre"
                                        name="ver-nombre"
                                        label="Nombre"
                                        value={props.nombre}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    </Grid>
                                    {/* Lugar */}
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="ver-lugar"
                                        name="ver-lugar"
                                        label="Lugar"
                                        value={props.lugar}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    </Grid>
                                    {/* Dirección */}
                                    <Grid item xs={12}>
                                    <TextField
                                        id="ver-direccion"
                                        name="ver-direccion"
                                        label="Dirección"
                                        value={props.direccion}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    </Grid>
                                    {/* Fecha Inicio */}
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="ver-f-inicio"
                                        name="ver-f-inicio"
                                        label="Fecha de Inicio"
                                        type="datetime-local"
                                        fullWidth
                                        value={props.f_inicio}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    </Grid>
                                    {/* Fecha Fin */}
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="ver-f-fin"
                                        name="ver-f-fin"
                                        label="Fecha de Fin"
                                        type="datetime-local"
                                        fullWidth
                                        value={props.f_fin}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    </Grid>
                                    {/* Categoría */}
                                    <Grid item>
                                    <TextField
                                        id="ver-categoria"
                                        name="ver-categoria"
                                        label="Categoría"
                                        fullWidth
                                        value={props.categoria[0].toUpperCase() + props.categoria.slice(1).toLowerCase()}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    </Grid>
                                    {/* Presencialidad */}
                                    <Grid item>
                                    <TextField
                                        id="ver-presencialidad"
                                        name="ver-presencialidad"
                                        label="Presencialidad"
                                        fullWidth
                                        value={props.presencial ? "Presencial" : "Virtual"}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    </Grid>
                                </Grid>
                                </div>
                        </div>
                    </Fade>
                </Modal>
                {/* Modal Editar */}
                <Button size="small" color="primary" onClick={() => setOpenEditar(true)}>
                    Editar
                </Button>
                <Modal
                    aria-labelledby="transition-modal-editar"
                    className={props.classes.modal}
                    open={openEditar}
                    onClose={() => setOpenEditar(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openEditar}>
                        <div className={props.classes.paper}>
                        <h1 id="transition-modal-title">Editar Evento:</h1>
                            <form onSubmit={editarEvento}>
                                <div>
                                <Grid container spacing={3}>
                                    {/* Nombre */}
                                    <Grid item xs={12} sm={6}>
                                    <TextField
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
                                    <FormControl className={props.classes.formControl}>
                                        <InputLabel id="categoria-label">Categoría</InputLabel>
                                        <Select
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
                                    <FormControl className={props.classes.formControl}>
                                        <InputLabel id="presencialidad-label">Presencialidad</InputLabel>
                                        <Select
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
                                        className={props.classes.button}
                                    >
                                        Editar!
                                    </Button>
                                </Grid>
                                </div>
                            </form>
                        </div>
                    </Fade>
                </Modal>
                {/* Eliminar Evento */}
                <Button size="small" color="secondary" onClick={eliminar}>
                    Eliminar
                </Button>
            </CardActions>
            </Card>
        </Grid>
    )
}