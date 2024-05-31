/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { genConst } from 'store/constant';
import CircularProgress from '@mui/material/CircularProgress';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import PayPalButton from './PayPalButton';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import { fullDate } from 'utils/validations';
import { createDocument, getGameCardsById, updateDocument } from 'config/firebaseEvents';
import { IconFile } from '@tabler/icons';
import defaultImage from 'assets/images/addImage.png';
import { generateId } from 'utils/idGenerator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uiStyles } from './styles';
import { collPayments } from 'store/collections';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const ConfirmationBuy = () => {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const id = searchParams.get('id');
  const idCard = searchParams.get('idCard');
  const num = searchParams.get('num');
  const eventId = searchParams.get('eventId');
  const eventName = searchParams.get('eventName');
  const eventDate = searchParams.get('eventDate');
  const total = '19.99';
  const [picture, setPicture] = useState({ preview: '', raw: '' });
  const [openLoader, setOpenLoader] = useState(false);
  const [value, setValue] = useState('1');
  const [userId, setUserId] = useState('');
  const [object, setObject] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setUserId(user.uid);
        getGameCardsById(idCard.toString()).then((data) => {
          const obj = {
            id: id,
            idCard: idCard,
            num: num,
            eventId: eventId,
            eventName: eventName,
            eventDate: eventDate,
            order: Number.parseInt(num),
            b: data[0].b,
            i: data[0].i,
            n: data[0].n,
            g: data[0].g,
            o: data[0].o,
            bingoNumbers: data[0].bingoNumbers,
            state: 0,
            createAt: fullDate(),
            userId: user.uid
          };
          console.log(obj);
          setObject(obj);
        });
      }
    });
  }, []);

  const handleSend = () => {
    if (!picture.preview) {
      toast.info('Comprobante es requerido!', { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const idComp = generateId(10);
      const paymentObject = {
        id: ide,
        status: 'PENDING',
        details: eventName + ' / ' + eventDate + ' / Cartilla Nro: ' + num,
        total: total,
        card: idCard,
        paypalOrderId: null,
        createAt: fullDate(),
        userId: userId,
        picture: null
      };
      createDocument(collPayments, idComp, paymentObject);
      setTimeout(() => {
        if (picture.raw !== null) {
          const imageName = idComp + 'voucher.jpg';
          const imageRef = ref(storage, `vouchers/${imageName}`);
          uploadBytes(imageRef, picture.raw).then((snap) => {
            getDownloadURL(snap.ref).then((url) => {
              const obj = {
                picture: url
              };
              updateDocument(collPayments, idComp, obj);
            });
          });
        }
        setOpenLoader(false);
        handleClean();
        navigate('/app/dashboard');
        toast.success('Comprobante enviado correctamente!', { position: toast.POSITION.TOP_RIGHT });
      }, 3000);
    }
  };

  const handleChangeFile = (e) => {
    if (e.target.files.length) {
      let img = new Image();
      img.src = window.URL.createObjectURL(e.target.files[0]);
      let raw = e.target.files[0];
      img.onload = () => {
        setPicture({
          preview: img.src,
          raw: raw
        });
      };
    }
  };

  const handleClean = () => {
    setPicture({ preview: '', raw: '' });
  };

  return (
    <Grid container spacing={1}>
      <ToastContainer />
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item lg={4} md={12} sm={12} xs={12} sx={{ backgroundColor: '#FFF', borderRadius: 4 }}>
            <div style={{ padding: 10, paddingRight: 20 }}>
              <div style={{ borderRadius: 8, padding: 10 }}>
                <Typography variant="h3" component="h3" sx={{ flexGrow: 1, color: '#000', mt: 3 }} align="center">
                  {eventName}
                </Typography>
                <center>
                  <p style={{ color: '#000', fontSize: 16 }}>{eventDate}</p>
                  <p style={{ color: '#000', fontSize: 16 }}>{'Cartilla'}</p>
                  <Typography
                    variant="h3"
                    component="h3"
                    sx={{
                      flexGrow: 1,
                      color: '#FFF',
                      backgroundColor: genConst.CONST_UPDATE_COLOR,
                      borderRadius: 50,
                      height: 60,
                      width: 60,
                      padding: 2,
                      mb: 3
                    }}
                    align="center"
                  >
                    {num}
                  </Typography>
                  <p style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>$ {total}</p>
                </center>
                <p hidden>{id}</p>
                <p hidden>{idCard}</p>
                <p hidden>{eventId}</p>
                <p hidden>{id}</p>
              </div>
            </div>
          </Grid>
          <Grid item lg={8} md={12} sm={12} xs={12}>
            <div style={{ padding: 20 }}>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                      <Tab label="Depósito / Transferencia" value="1" />
                      <Tab label="Pago en línea" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <Grid container spacing={2}>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <center>
                          <p style={{ fontWeight: 'bold' }}>Banco</p>
                          <p>Tipo</p>
                          <p>Numero</p>
                          <parseFloat>Ci</parseFloat>
                        </center>
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <center>
                          <p style={{ fontWeight: 'bold' }}>Banco</p>
                          <p>Tipo</p>
                          <p>Numero</p>
                          <p>Ci</p>
                        </center>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Typography variant="p" component="p" sx={{ flexGrow: 1, color: '#000', mt: 3, fontSize: 16 }} align="center">
                          Si ya realizaste el pago, adjunta el comprobante!
                        </Typography>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <center>
                          <input type="file" id="picture" style={{ display: 'none' }} onChange={handleChangeFile} accept="image/*" />
                          <div htmlFor="picture" id="picture">
                            <label htmlFor="picture">
                              <img
                                src={picture.preview || defaultImage}
                                alt="Comprobante"
                                width={80}
                                style={{ borderRadius: 15, paddingTop: 5, cursor: 'pointer' }}
                              />
                              <br />
                              {picture.preview ? (
                                <Button
                                  startIcon={<IconFile />}
                                  style={{
                                    backgroundColor: '#009ee3',
                                    width: 200,
                                    height: 40,
                                    borderRadius: 10,
                                    padding: 12,
                                    color: '#FFF',
                                    marginTop: 0
                                  }}
                                  onClick={handleSend}
                                >
                                  Enviar
                                </Button>
                              ) : (
                                <p style={{ fontSize: 13, color: '#3a3b3c', marginTop: 0 }}>Archivo no adjunto</p>
                              )}
                            </label>
                          </div>
                        </center>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="2">
                    <PayPalScriptProvider
                      options={{
                        'client-id': 'AaPgorgNdJSFjdNLhd-TYYEjHyILNwarVBEM3PAtDFHaq92n0JEYhAHyxcFprWJ28NF3TqEp65Y5p4wO'
                      }}
                    >
                      <center>
                        <div style={{ width: '50%' }}>
                          <PayPalButton
                            invoice={eventName + ' / ' + eventDate + ' / Cartilla Nro: ' + num}
                            totalValue={total}
                            object={object}
                          />
                        </div>
                      </center>
                    </PayPalScriptProvider>
                  </TabPanel>
                </TabContext>
              </Box>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Modal open={openLoader} aria-labelledby="modal-loader" aria-describedby="modal-loader">
        <center>
          <Box sx={uiStyles.loader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </Grid>
  );
};

export default ConfirmationBuy;
