import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, ButtonGroup, FormControl, Grid, InputLabel, Modal, OutlinedInput, Paper, Typography } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { uiStyles } from './Game.styles';
import { countCards, createDocument, deleteDocument, getGameCardsByEvent, getGamesList } from 'config/firebaseEvents';
import { fullDate } from 'utils/validations';
import { collCards } from 'store/collections';
import CircularProgress from '@mui/material/CircularProgress';
//Tabs
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import { TabContext } from '@mui/lab';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateId } from 'utils/idGenerator';
import { IconArrowBack, IconCards, IconCheck, IconCircleX, IconDeviceFloppy, IconEye, IconPlus, IconTrash } from '@tabler/icons';
import MessageDark from 'components/message/MessageDark';
import { titles } from './Game.texts';
import { bingoValues, genConst } from 'store/constant';
import { searchingCard } from 'utils/search';

export default function CardGame() {
  const theme = useTheme();
  const [bNumbers, setBNumbers] = useState([]);
  const [iNumbers, setINumbers] = useState([]);
  const [nNumbers, setNNumbers] = useState([]);
  const [gNumbers, setGNumbers] = useState([]);
  const [oNumbers, setONumbers] = useState([]);
  const [bN, setBN] = useState([]);
  const [iN, setIN] = useState([]);
  const [nN, setNN] = useState([]);
  const [gN, setGN] = useState([]);
  const [oN, setON] = useState([]);
  const [event, setEvent] = useState('');
  const [eventName, setEventName] = useState('');
  const [cards, setCards] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [cardNumber, setCardNumber] = useState(0);
  const [cardN, setCardN] = useState(0);
  const [openLoader, setOpenLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [openCard, setOpenCard] = useState(false);
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [gameList, setGameList] = useState([]);
  const [isEvent, setIsEvent] = useState(false);

  let idCard = 0;
  let order = 0;
  let cardBingoNumbers = [];
  let object = {};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleOpenCard = () => {
    setOpenCard(true);
  };
  const handleCloseCard = () => {
    setOpenCard(false);
  };

  const handleOpenCreateCard = () => {
    setOpenCreateCard(true);
  };
  const handleCloseCreateCard = () => {
    setOpenCreateCard(false);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getGamesList().then((data) => {
      setGameList(data);
    });
  }, []);

  function generateBsection(min, max) {
    let matrix = [];
    let b = [];
    for (var a = 0; a < 5; a++) {
      b[a] = Math.floor(Math.random() * (max - min) + min);
    }
    for (var outer = 0; outer < b.length; outer++) {
      for (var inner = 0; inner < b.length; inner++) {
        if (inner != outer && b[outer] == b[inner]) {
          b[outer] = Math.floor(Math.random() * (max - min) + min);
        }
      }
    }
    matrix.push(b);
    setBNumbers(matrix[0]);
    return matrix[0];
  }

  function generateIsection(min, max) {
    let matrix = [];
    let i = [];
    for (var a = 0; a < 5; a++) {
      i[a] = Math.floor(Math.random() * (max - min) + min);
    }
    for (var outer = 0; outer < i.length; outer++) {
      for (var inner = 0; inner < i.length; inner++) {
        if (inner != outer && i[outer] == i[inner]) {
          i[outer] = Math.floor(Math.random() * (max - min) + min);
        }
      }
    }
    matrix.push(i);
    setINumbers(matrix[0]);
    return matrix[0];
  }

  function generateNsection(min, max) {
    let matrix = [];
    let n = [];
    for (var a = 0; a < 5; a++) {
      if (a == 2) {
        n[a] = 0;
      } else {
        n[a] = Math.floor(Math.random() * (max - min) + min);
      }
    }
    for (var outer = 0; outer < n.length; outer++) {
      for (var inner = 0; inner < n.length; inner++) {
        if (inner != outer && n[outer] == n[inner]) {
          n[outer] = Math.floor(Math.random() * (max - min) + min);
        }
      }
    }
    matrix.push(n);
    setNNumbers(matrix[0]);
    return matrix[0];
  }

  function generateGsection(min, max) {
    let matrix = [];
    let g = [];
    for (var a = 0; a < 5; a++) {
      g[a] = Math.floor(Math.random() * (max - min) + min);
    }
    for (var outer = 0; outer < g.length; outer++) {
      for (var inner = 0; inner < g.length; inner++) {
        if (inner != outer && g[outer] == g[inner]) {
          g[outer] = Math.floor(Math.random() * (max - min) + min);
        }
      }
    }
    matrix.push(g);
    setGNumbers(matrix[0]);
    return matrix[0];
  }

  function generateOsection(min, max) {
    let matrix = [];
    let o = [];
    for (var a = 0; a < 5; a++) {
      o[a] = Math.floor(Math.random() * (max - min) + min);
    }
    for (var outer = 0; outer < o.length; outer++) {
      for (var inner = 0; inner < o.length; inner++) {
        if (inner != outer && o[outer] == o[inner]) {
          o[outer] = Math.floor(Math.random() * (max - min) + min);
        }
      }
    }
    matrix.push(o);
    setONumbers(matrix[0]);
    return matrix[0];
  }

  function handleGetCard() {
    generateBsection(bingoValues.B_START, bingoValues.B_END);
    generateIsection(bingoValues.I_START, bingoValues.I_END);
    generateNsection(bingoValues.N_START, bingoValues.N_END);
    generateGsection(bingoValues.G_START, bingoValues.G_END);
    generateOsection(bingoValues.O_START, bingoValues.O_END);
    setShowCard(true);
  }

  function handleSaveCard() {
    setOpenLoader(true);
    idCard = generateId(10);
    order = cardNumber + 1;
    cardBingoNumbers = [...bNumbers, ...iNumbers, ...nNumbers, ...gNumbers, ...oNumbers];
    object = {
      event: event,
      eventName: eventName,
      id: idCard,
      b: bNumbers,
      i: iNumbers,
      n: nNumbers,
      g: gNumbers,
      o: oNumbers,
      bingoNumbers: cardBingoNumbers,
      order: order,
      num: order + '',
      createAt: fullDate(),
      state: bingoValues.STATE_AVAILABLE
    };
    createDocument(collCards, idCard, object);
    setTimeout(() => {
      setOpenLoader(false);
      toast.success(titles.successCardCreate, { position: toast.POSITION.TOP_RIGHT });
      reloadData();
    }, 2000);
  }

  function generateAndSaveCard(index) {
    setCardNumber(index + 1);
    idCard = generateId(10);
    let array1 = generateBsection(bingoValues.B_START, bingoValues.B_END);
    let array2 = generateIsection(bingoValues.I_START, bingoValues.I_END);
    let array3 = generateNsection(bingoValues.N_START, bingoValues.N_END);
    let array4 = generateGsection(bingoValues.G_START, bingoValues.G_END);
    let array5 = generateOsection(bingoValues.O_START, bingoValues.O_END);
    cardBingoNumbers = [...array1, ...array2, ...array3, ...array4, ...array5];
    let object = {
      event: event,
      eventName: eventName,
      id: idCard,
      b: array1,
      i: array2,
      n: array3,
      g: array4,
      o: array5,
      bingoNumbers: cardBingoNumbers,
      order: index,
      num: index + '',
      createAt: fullDate(),
      state: bingoValues.STATE_AVAILABLE
    };
    createDocument(collCards, idCard, object);
  }

  const reloadData = () => {
    getGameCardsByEvent(event).then((data) => {
      setCards(data);
      countCards().then((count) => {
        setCardNumber(count);
      });
    });
  };

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleDelete = (id) => {
    setOpenLoader(true);
    deleteDocument(collCards, id);
    setTimeout(() => {
      setOpenLoader(false);
      toast.success(titles.successCardDelete, { position: toast.POSITION.TOP_RIGHT });
      reloadData(event);
    }, 1000);
  };

  return (
    <Box sx={uiStyles.box}>
      <ToastContainer />
      {isEvent ? (
        <>
          <Button
            variant="contained"
            startIcon={<IconArrowBack />}
            size="large"
            style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
            onClick={() => setIsEvent(false)}
          >
            {'Volver'}
          </Button>
        </>
      ) : (
        <>
          {gameList.length > 0 ? (
            <Paper style={{ marginTop: 10 }}>
              <h3>Seleccione el evento</h3>
              <TableContainer sx={{ maxHeight: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell key="id-name" align="left" style={{ minWidth: 70, fontWeight: 'bold' }}>
                        ID
                      </TableCell>
                      <TableCell key="id-email" align="left" style={{ minWidth: 200, fontWeight: 'bold' }}>
                        Nombre
                      </TableCell>
                      <TableCell key="id-profile" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        Fecha
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
                        <TableCell align="left">{r.startDate}</TableCell>
                        <TableCell align="center">
                          <ButtonGroup variant="contained">
                            <Button
                              style={{ backgroundColor: genConst.CONST_CREATE_COLOR }}
                              onClick={() => {
                                setEvent(r.ide);
                                setEventName(r.name);
                                setIsEvent(true);
                                setOpenLoader(true);
                                getGameCardsByEvent(r.ide).then((data) => {
                                  setCards(data);
                                  countCards().then((count) => {
                                    setCardNumber(count);
                                  });
                                });
                                setTimeout(() => {
                                  setOpenLoader(false);
                                }, 1000);
                              }}
                            >
                              <IconCheck color="#FFF" />
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
      )}
      {isEvent ? (
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              variant="scrollable"
              scrollButtons
              onChange={handleChange}
              aria-label="Tabs cards"
              sx={{
                [`& .${tabsClasses.scrollButtons}`]: {
                  '&.Mui-disabled': { opacity: 0.3 }
                }
              }}
            >
              <Tab label="Lista de Cartillas" value="1" />
              <Tab label="Generador Cartilla" value="2" />
            </Tabs>
          </Box>
          <TabPanel value="1">
            <Button
              style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF', marginBottom: 10, marginTop: -10 }}
              onClick={() => {
                handleOpenCreateCard();
              }}
            >
              <IconPlus />
            </Button>
            {cards.length > 0 ? (
              <Paper sx={uiStyles.paper}>
                <Box sx={uiStyles.box2}>
                  <OutlinedInput
                    id="searchField"
                    type="text"
                    name="searchField"
                    onChange={(ev) => setSearch(ev.target.value)}
                    placeholder={titles.searchPlace}
                    style={{ width: '100%' }}
                  />
                </Box>
                <TableContainer sx={{ maxHeight: '100%' }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell key="id-col1" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                          {'Número'}
                        </TableCell>
                        <TableCell key="id-col1" align="left" style={{ minWidth: 80, fontWeight: 'bold' }}>
                          {'Estado'}
                        </TableCell>
                        <TableCell key="id-col3" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                          {'Fecha'}
                        </TableCell>
                        <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                          {'Acciones'}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cards
                        .filter(searchingCard(search))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((r) => (
                          <TableRow hover key={r.id}>
                            <TableCell align="left">{r.num}</TableCell>
                            <TableCell align="left">
                              {r.state == bingoValues.STATE_AVAILABLE ? (
                                <span style={{ color: genConst.CONST_SUCCESS_COLOR, fontWeight: 'bold' }}>
                                  {bingoValues.STATE_DESC_AVAILABLE}
                                </span>
                              ) : (
                                <span style={{ color: genConst.CONST_ERROR_COLOR, fontWeight: 'bold' }}>
                                  {bingoValues.STATE_DESC_NOT_AVAILABLE}
                                </span>
                              )}
                            </TableCell>
                            <TableCell align="left">{r.createAt}</TableCell>
                            <TableCell align="center">
                              <ButtonGroup variant="contained">
                                <Button
                                  style={{ backgroundColor: genConst.CONST_UPDATE_COLOR, color: '#FFF' }}
                                  onClick={() => {
                                    handleOpenCard();
                                    setCardN(r.num);
                                    setBN(r.b);
                                    setIN(r.i);
                                    setNN(r.n);
                                    setGN(r.g);
                                    setON(r.o);
                                  }}
                                >
                                  <IconEye />
                                </Button>
                                <Button
                                  style={{ backgroundColor: genConst.CONST_DELETE_COLOR, color: '#FFF' }}
                                  onClick={() => {
                                    handleDelete(r.id);
                                  }}
                                >
                                  <IconTrash />
                                </Button>
                              </ButtonGroup>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100, 200, 500, 1000]}
                  labelRowsPerPage={titles.rowsPerPage}
                  component="div"
                  count={cards.length}
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
                    <MessageDark message={titles.noCardsFound} submessage="" />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value="2">
            <ButtonGroup>
              <Button
                startIcon={<IconCards />}
                variant="contained"
                style={{ color: '#FFF', height: 50, width: 180 }}
                onClick={handleGetCard}
              >
                Generar Cartillas
              </Button>
              <Button startIcon={<IconDeviceFloppy />} variant="outlined" style={{ height: 50, width: 180 }} onClick={handleSaveCard}>
                Guardar Cartillas
              </Button>
            </ButtonGroup>
            <br />
            <Grid container style={{ marginTop: 10 }}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    {showCard ? (
                      <div>
                        <h3>No: {cardNumber + 1}</h3>
                        <ButtonGroup aria-label="Basic button group" orientation="vertical">
                          <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 62, width: 62, borderRadius: 0 }}>
                            B
                          </Button>
                          {bNumbers.map((item, key) => (
                            <Button key={'b' + key} variant="outlined" style={{ height: 62, width: 62, borderRadius: 0 }}>
                              {item}
                            </Button>
                          ))}
                        </ButtonGroup>
                        <ButtonGroup aria-label="Basic button group" orientation="vertical">
                          <Button variant="contained" style={{ color: '#FFF', height: 62, width: 62, borderRadius: 0 }}>
                            I
                          </Button>
                          {iNumbers.map((item, key) => (
                            <Button key={'i' + key} variant="outlined" style={{ height: 62, width: 62, borderRadius: 0 }}>
                              {item}
                            </Button>
                          ))}
                        </ButtonGroup>
                        <ButtonGroup aria-label="Basic button group" orientation="vertical">
                          <Button variant="contained" style={{ color: '#FFF', height: 62, width: 62, borderRadius: 0 }}>
                            N
                          </Button>
                          {nNumbers.map((item, key) =>
                            item == 0 ? (
                              <Button key={'n' + key} variant="contained" style={{ height: 62, width: 62, color: '#FFF', borderRadius: 0 }}>
                                FREE
                              </Button>
                            ) : (
                              <Button key={'n' + key} variant="outlined" style={{ height: 62, width: 62, borderRadius: 0 }}>
                                {item}
                              </Button>
                            )
                          )}
                        </ButtonGroup>
                        <ButtonGroup aria-label="Basic button group" orientation="vertical">
                          <Button variant="contained" style={{ color: '#FFF', height: 62, width: 62, borderRadius: 0 }}>
                            G
                          </Button>
                          {gNumbers.map((item, key) => (
                            <Button key={'g' + key} variant="outlined" style={{ height: 62, width: 62, borderRadius: 0 }}>
                              {item}
                            </Button>
                          ))}
                        </ButtonGroup>
                        <ButtonGroup aria-label="Basic button group" orientation="vertical">
                          <Button variant="contained" style={{ color: '#FFF', height: 62, width: 62, borderRadius: 0 }}>
                            O
                          </Button>
                          {oNumbers.map((item, key) => (
                            <Button key={'o' + key} variant="outlined" style={{ height: 62, width: 62, borderRadius: 0 }}>
                              {item}
                            </Button>
                          ))}
                        </ButtonGroup>
                      </div>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>
      ) : (
        <></>
      )}

      <Modal open={openCard} onClose={handleCloseCard} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStylesDelete}>
          <Typography id="modal-modal-title" variant="h3" component="h2" sx={{ textAlign: 'center' }}>
            Cartilla: 0000{cardN}
          </Typography>
          <div style={{ marginTop: 20 }}>
            <center>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 55, width: 55, borderRadius: 0 }}>
                  B
                </Button>
                {bN.map((item, key) => (
                  <Button key={'b' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
                  I
                </Button>
                {iN.map((item, key) => (
                  <Button key={'i' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
                  N
                </Button>
                {nN.map((item, key) =>
                  item == 0 ? (
                    <Button key={'n' + key} variant="contained" style={{ height: 55, width: 55, color: '#FFF', borderRadius: 0 }}>
                      FREE
                    </Button>
                  ) : (
                    <Button key={'n' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                      {item}
                    </Button>
                  )
                )}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
                  G
                </Button>
                {gN.map((item, key) => (
                  <Button key={'g' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
                  O
                </Button>
                {oN.map((item, key) => (
                  <Button key={'o' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
            </center>
          </div>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                        onClick={handleCloseCard}
                      >
                        {titles.buttonClose}
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={openCreateCard}
        onClose={handleCloseCreateCard}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h3" component="h2" sx={{ textAlign: 'center' }}>
            Generar Cartillas
          </Typography>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="quantity">
                        <span>*</span> {'Ingrese la cantidad de cartillas a generar'}
                      </InputLabel>
                      <OutlinedInput
                        id={'quantity'}
                        type="number"
                        name={'quantity'}
                        inputProps={{}}
                        onChange={(ev) => setQuantity(ev.target.value)}
                      />
                    </FormControl>
                  </center>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        startIcon={<IconCards />}
                        variant="contained"
                        style={{ color: '#FFF', height: 50, width: 180 }}
                        onClick={() => {
                          if (!quantity) {
                            toast.info(titles.requireField, { position: toast.POSITION.TOP_RIGHT });
                          } else {
                            setOpenLoader(true);
                            let cardNum = cardNumber;
                            for (let index = cardNum; index < cardNum + parseInt(quantity); index++) {
                              generateAndSaveCard(index + 1);
                            }
                            setTimeout(() => {
                              setOpenLoader(false);
                              toast.success(titles.successCardCreate, { position: toast.POSITION.TOP_RIGHT });
                              reloadData();
                              setOpenCreateCard(false);
                            }, parseInt(quantity) * 50);
                          }
                        }}
                      >
                        Generar
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
