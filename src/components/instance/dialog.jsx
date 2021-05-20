import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {LoadingAnime} from "./loading";

export default function InitDialog(param) {
    let content
    switch (param.step) {
        case "loading":
            content = <LoadingDialog text={"載入中..."}/>
            break
        case "error":
            content = <ErrDialog text={param.text} onRetry={param.onRetry}/>
            break
    }

    return (
        <div>
            <Dialog
                open={param.step !== "playing"}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {content}
            </Dialog>
        </div>
    )
}

export function ErrDialog(param) {
    const {onRetry} = param
    return (
        <>
            <DialogTitle id="alert-dialog-title">錯誤</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {param.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onRetry} color="primary" autoFocus>
                    重試
                </Button>
            </DialogActions>
        </>
    );
}

export function LoadingDialog(param) {
    return (
        <DialogContent>
            <LoadingAnime/>
            <DialogContentText id="alert-dialog-description" style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                {param.text}
            </DialogContentText>
        </DialogContent>
    );
}