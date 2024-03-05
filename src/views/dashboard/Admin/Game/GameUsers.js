/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Box,
  Typography,
  Modal,
  Grid,
  ButtonGroup
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import MessageDark from 'components/message/MessageDark';
import { IconTrash, IconEdit, IconCircleX, IconPlus, IconUser, IconArrowLeft, IconUserPlus } from '@tabler/icons';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import { TabContext } from '@mui/lab';
//Firebase Events
import { createDocument, deleteDocument, getGameUsers, getUsersList } from 'config/firebaseEvents';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { genConst } from 'store/constant';
import { collGameInscription } from 'store/collections';
import { titles } from './Game.texts';
import { uiStyles } from './Game.styles';

//Utils
import { fullDate } from 'utils/validations';
import { generateId } from 'utils/idGenerator';

export default function GameUsers() {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idGame = searchParams.get('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [gameList, setGameList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [openLoader, setOpenLoader] = useState(false);

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //Hook
  useEffect(() => {
    getGameUsers(idGame).then((data) => {
      setGameList(data);
    });
    getUsersList().then((data) => {
      setUserList(data);
    });
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const reloadData = () => {
    window.location.reload();
  };

  const handleCreateGame = (idUser, nameUser, emailUser) => {
    const ide = generateId(10);
    const object = {
      ide: ide,
      idGame: idGame,
      idUser: idUser,
      name: nameUser,
      emailUser: emailUser,
      createAt: fullDate()
    };
    setOpenLoader(true);
    createDocument(collGameInscription, ide, object);
    console.log(object);
    setTimeout(() => {
      setOpenLoader(false);
      setOpenCreate(false);
      toast.success(titles.successUpdate, { position: toast.POSITION.TOP_RIGHT });
    }, 2000);
  };

  const handleDeleteUser = () => {
    setOpenLoader(true);
    deleteDocument(collGameInscription, id);
    setTimeout(() => {
      setOpenLoader(false);
      setOpenDelete(false);
      reloadData();
      toast.success(titles.successDelete, { position: toast.POSITION.TOP_RIGHT });
    }, 2000);
  };

  return (
    <Box sx={uiStyles.box}>
      <ToastContainer />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            variant="scrollable"
            scrollButtons
            onChange={handleChange}
            aria-label="Tabs notifications"
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                '&.Mui-disabled': { opacity: 0.3 }
              }
            }}
          >
            <Tab label="Usuarios" value="1" />
            <Tab label="Inscripciones" value="2" />
          </Tabs>
        </Box>
        <TabPanel value="1">
          <>
            <Button
              style={{ backgroundColor: genConst.CONST_CREATE_COLOR, borderRadius: 8, marginRight: 10 }}
              onClick={() => {
                navigate('/main/new-game');
              }}
              startIcon={<IconArrowLeft color="#FFF" />}
            >
              <span style={{ paddingLeft: 0, color: '#FFF' }}>Volver</span>
            </Button>
            <Button
              style={{ backgroundColor: genConst.CONST_CREATE_COLOR, borderRadius: 8 }}
              onClick={() => {
                handleOpenCreate();
              }}
              startIcon={<IconPlus color="#FFF" />}
            >
              <span style={{ paddingLeft: 4, color: '#FFF' }}>Inscribir Usuario</span>
            </Button>
            {gameList.length > 0 ? (
              <Paper style={{ marginTop: 10 }}>
                <TableContainer sx={{ maxHeight: '100%' }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell key="id-name" align="left" style={{ minWidth: 70, fontWeight: 'bold' }}>
                          ID Inscripción
                        </TableCell>
                        <TableCell key="id-email" align="left" style={{ minWidth: 200, fontWeight: 'bold' }}>
                          Nombre
                        </TableCell>
                        <TableCell key="id-profile" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                          Partida
                        </TableCell>
                        <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                          {titles.tableCellActions}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {gameList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                        <TableRow hover key={r.id}>
                          <TableCell align="left">{r.ide}</TableCell>
                          <TableCell align="left">{r.name}</TableCell>
                          <TableCell align="left">{r.idGame}</TableCell>
                          <TableCell align="center">
                            <ButtonGroup variant="contained">
                              <Button
                                style={{ backgroundColor: genConst.CONST_CREATE_COLOR }}
                                onClick={() => {
                                  setId(r.ide);
                                }}
                              >
                                <IconUser color="#FFF" />
                              </Button>
                              <Button
                                style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                                onClick={() => {
                                  setId(r.ide);
                                  setName(r.name);
                                  handleOpenCreate();
                                }}
                              >
                                <IconEdit color="#FFF" />
                              </Button>
                              <Button
                                style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                                onClick={() => {
                                  setId(r.ide);
                                  setName(r.name);
                                  handleOpenDelete();
                                }}
                              >
                                <IconTrash color="#FFF" />
                              </Button>
                            </ButtonGroup>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  labelRowsPerPage={titles.maxRecords}
                  component="div"
                  count={gameList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            ) : (
              <Grid container style={{ marginTop: 20 }}>
                <Grid item xs={12}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <MessageDark message={titles.loading} submessage="" />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </>
        </TabPanel>
        <TabPanel value="2"></TabPanel>
        <TabPanel value="3"></TabPanel>
      </TabContext>

      <Modal open={openCreate} onClose={handleCloseCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Inscribir Usuario
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  {userList.length > 0 ? (
                    <Paper style={{ marginTop: 10 }}>
                      <TableContainer sx={{ maxHeight: '100%' }}>
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell key="id-email" align="left" style={{ minWidth: 200, fontWeight: 'bold' }}>
                                Nombre
                              </TableCell>
                              <TableCell key="id-profile" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                                Email
                              </TableCell>
                              <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                                {titles.tableCellActions}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                              <TableRow hover key={r.id}>
                                <TableCell align="left">{r.fullName}</TableCell>
                                <TableCell align="left">{r.email}</TableCell>
                                <TableCell align="center">
                                  <ButtonGroup variant="contained">
                                    <Button
                                      style={{ backgroundColor: genConst.CONST_CREATE_COLOR }}
                                      onClick={() => {
                                        setId(r.id);
                                        handleCreateGame(r.id, r.fullName, r.email);
                                      }}
                                    >
                                      <IconUserPlus color="#FFF" />
                                    </Button>
                                    <Button
                                      style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                                      onClick={() => {
                                        setId(r.ide);
                                        setName(r.name);
                                        handleOpenDelete();
                                      }}
                                    >
                                      <IconTrash color="#FFF" />
                                    </Button>
                                  </ButtonGroup>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        labelRowsPerPage={titles.maxRecords}
                        component="div"
                        count={gameList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Paper>
                  ) : (
                    <Grid container style={{ marginTop: 20 }}>
                      <Grid item xs={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <MessageDark message={'Cargando Usuarios...'} submessage="" />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal open={openDelete} onClose={handleCloseDelete} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStylesDelete}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Eliminar Partida
          </Typography>
          <Typography id="modal-modal-title" variant="p" component="p" style={{ marginTop: 20, fontSize: 16 }}>
            {titles.titleDeleteModal} <strong>{name}</strong>
          </Typography>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconTrash />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_DELETE_COLOR, color: '#FFF' }}
                        onClick={handleDeleteUser}
                      >
                        {titles.buttonDelete}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CANCEL_COLOR, color: '#FFF' }}
                        onClick={handleCloseDelete}
                      >
                        {titles.buttonCancel}
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={uiStyles.modalStylesLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </Box>
  );
}