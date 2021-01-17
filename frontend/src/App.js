import './App.css';
import React,{useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { /*Button, ButtonToggle,*/ Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


function App() {

  function refreshPage() {
    window.location.reload();
  }

  const baseUrl="https://localhost:44352/api/libros";
  const[data, setData]=useState([]);

  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);

  const [libroSeleccionado, setLibrosSeleccionado]=useState({
    id: 0,
    nombreLibro: '',
    lanzamiento: 0,
    autor:''
  });
  const handleChange=e=>{
    const {name, value}=e.target;
    setLibrosSeleccionado({
      ...libroSeleccionado,
      [name]: value
    });
    console.log(libroSeleccionado);
  }

  const abrirCerarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }
  
  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    delete libroSeleccionado.id;
    libroSeleccionado.lanzamiento=parseInt(libroSeleccionado.lanzamiento);
    await axios.post(baseUrl, libroSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerarModalInsertar();
      refreshPage();
    }).catch(error=>{
      console.log(error);
      abrirCerarModalInsertar();
      refreshPage();
    })
  }

  const peticionPut=async()=>{
    libroSeleccionado.lanzamiento=parseInt(libroSeleccionado.lanzamiento);
    await axios.put(baseUrl+"/"+libroSeleccionado.id, libroSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(libros=>{
        if(libros.id===libroSeleccionado.id){
          libros.nombreLibro=respuesta.nombreLibro;
          libros.lanzamiento=respuesta.lanzamiento;
          libros.autor=respuesta.autor;
        }
      })
      abrirCerarModalEditar();
      refreshPage();
    }).catch(error=>{
      console.log(error);
      abrirCerarModalEditar();
      refreshPage();
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+libroSeleccionado.id)
    .then(response=>{
      setData(data.filter(libros=>libros.id!==libros.data));
      abrirCerrarModalEliminar();
      refreshPage();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarLibro=(libro, caso)=>{
    setLibrosSeleccionado(libro);
    (caso==="Editar")?
    abrirCerarModalEditar(): abrirCerrarModalEliminar();
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div className="App">
      <br/>
      <button onClick={()=>abrirCerarModalInsertar()} className="btn btn-success">Insertar nuevo libro</button>
      <br/><br/>
      <table className="table table-bordered">
        <thead>
          <th>ID</th>
          <th>Nombre Libro</th>
          <th>Lanzamiento</th>
          <th>Autor</th>
          <th>Acciones</th>
        </thead>

        <tbody>
          {data.map(libros=>(
            <tr key={libros.id}>
              <td>{libros.id}</td>
              <td>{libros.nombreLibro}</td>
              <td>{libros.lanzamiento}</td>
              <td>{libros.autor}</td>
              <td>
                <button type="submit" className="btn btn-primary" onClick={()=>seleccionarLibro(libros, "Editar")}>Editar</button>{" "}
                <button className="btn btn-danger" onClick={()=>seleccionarLibro(libros, "Eliminar")}>Eliminar</button>{" "}
              </td>
            </tr>
          ))}
          
        </tbody>
      </table>

      {/* Guardar */}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Guardar Libros</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre Libro</label>
            <br/>
            <input type="text" className="form-control" name="nombreLibro" onChange={handleChange}/>
            <br/>
            <label>Lanzamiento</label>
            <br/>
            <input type="number" className="form-control" name="lanzamiento" onChange={handleChange}/>
            <br/>
            <label>Autor</label>
            <br/>
            <input type="text" className="form-control"name="autor" onChange={handleChange}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{" "}
          <button className="btn btn-danger" onClick={()=>abrirCerarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      {/* Editar */}
      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Libro</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Id</label>
            <br/>
            <input type="text" className="form-control"  readOnly onChange={handleChange} value={libroSeleccionado && libroSeleccionado.id}/>
            <br/>
            <label>Editar Registro</label>
            <br/>
            <input type="text" className="form-control" name="nombreLibro" onChange={handleChange} value={libroSeleccionado && libroSeleccionado.nombreLibro}/>
            <br/>
            <label>Lanzamiento</label>
            <br/>
            <input type="number" className="form-control" name="lanzamiento" onChange={handleChange} value={libroSeleccionado && libroSeleccionado.lanzamiento}/>
            <br/>
            <label>Autor</label>
            <br/>
            <input type="text" className="form-control" name="autor" onChange={handleChange} value={libroSeleccionado && libroSeleccionado.autor}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" name="Editar" onClick={()=>peticionPut()}>Editar</button>{" "}
          <button className="btn btn-danger" name="Eliminar" onClick={()=>abrirCerarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      {/* Eliminar */}
      <Modal isOpen={modalEliminar}>
        {/* <ModalHeader>Eliminar Libro</ModalHeader> */}
        <ModalBody>
        ¿Esta seguro de eliinar el registro {libroSeleccionado && libroSeleccionado.nombreLibro}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" name="Editar" onClick={()=>peticionDelete()}>Si</button>{" "}
          <button className="btn btn-success" name="Eliminar" onClick={()=>abrirCerrarModalEliminar()}>No</button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
