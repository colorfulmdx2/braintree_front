import React, {useState} from 'react';
import './App.css';
import {getClientToken, makePayment} from "./api";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    makeStyles,
    Paper,
    Snackbar,
    Typography
} from "@material-ui/core";
import {grey, indigo} from "@material-ui/core/colors";
import DropIn from "braintree-web-drop-in-react";
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';


function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
    root: {
        width: 275,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: grey[600],
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 25,
        color: '#fff'
    },
    pos: {
        fontSize: 20,
        color: indigo[100],
        marginBottom: 12,
    },
    paper: {
        background: grey[900],
        height: '100vh'
    },
    button: {
        margin: '0 auto'
    },
    cardContent: {
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center'
    },
    dropIn: {
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }
});
type StoreType = { token: string | null, success: string, error: string, instance: any, }
export const App = () => {
    const classes = useStyles();

    const [error, setError] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [store, setStore] = useState<StoreType>({
        token: null,
        success: '',
        instance: '',
        error: ''
    })
    console.log(store.token, 'token')
    const getToken = async () => {
        try {
            const res: any = await getClientToken()
            console.log(res, 'GET TOKEN RESPONSE');
            if (res.err) {
                console.log(res.err, 'GET TOKEN ERROR');
                setStore({...store, error: res.err})
                setError(true)
            } else {
                setStore({...store, token: res.token})
            }
        } catch (error) {
            setStore({...store, error: String(error)})
            setError(true)
        }

    }

    const onPurchase = () => {
        setError(false)
        console.log(store.instance, "INSTANCE")
        console.log(store.instance.requestPaymentMethod, "REQUEST PAYMENT METHOD")
        store.instance.requestPaymentMethod().then((res: any) => {
            if (res) {
                console.log('MAKE PAYMENT RESPONSE', res)
                console.log('NONCE', res.nonce)
                const nonce = res.nonce;
                const paymentData = {
                    nonce: nonce,
                    amount: 50
                }

                makePayment(paymentData).then((res: any) => {






                    console.log("PAYMENT DATA", paymentData )
                    console.log("RESPONSE MAKE PAYMENT",res)
                    if (!res.data.success) {
                        console.log('MAKE PAYMENT ERROR', res.err)
                        setStore({...store, error: res.er})
                        setError(true)
                    } else {
                        console.log('MAKE PAYMENT SUCCESS', res.data.success)
                        setStore({...store, error: '', success: res.data.success})
                        setSuccess(true)
                        setStore({...store, token: null})
                    }
                }).catch((error) => setStore({...store, error: error, success: ''}))
            }
        })
    }

    /*  useEffect(() => {
        getToken()
      }, [])*/

    return (
        <>
            {
                store.token && <div className={classes.dropIn}>
                    <DropIn options={{authorization: store.token}}
                            onInstance={((instance) => setStore({
                                ...store,
                                instance: instance
                            }))}/>
                    <Button onClick={onPurchase} className={classes.button} variant={'contained'} color={'primary'}
                            size="small">Byu</Button>
                </div>

            }
            <Paper className={classes.paper}>
                <Snackbar open={error} autoHideDuration={30000} onClose={() => setError(false)}>
                    <Alert onClose={() => setError(false)} severity="error">
                        {store.error}
                    </Alert>
                </Snackbar>

                <Snackbar open={success} autoHideDuration={30000} onClose={() => setSuccess(false)}>
                    <Alert onClose={() => setSuccess(false)} severity="success">
                        {store.success}
                    </Alert>
                </Snackbar>


                <Card className={classes.root}>
                    <>
                        <CardContent className={classes.cardContent}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Your amount is
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                50$
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={getToken} className={classes.button} variant={'contained'}
                                    color={'primary'}
                                    size="small">Byu</Button>
                        </CardActions>
                    </>

                </Card>
            </Paper>
        </>
    );
}

export default App;
