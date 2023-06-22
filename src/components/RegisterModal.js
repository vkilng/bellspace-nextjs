import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Modal from '@mui/material/Modal';
import FormHelperText from '@mui/material/FormHelperText'
import Input from "@mui/material/Input";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from "@mui/material/TextField";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function RegisterModal({ registerOpen = true, handleClose, emailValue = '', setEmailIsValid, setEmailHelperText }) {
  const router = useRouter();

  // Username validity handlers for Sign Up
  const [usernameIsValid, setUsernameIsValid] = useState(true);
  const [usernameHelperText, setUsernameHelperText] = useState('');
  const handleUsernameValidity = async (event) => {
    const usernameInputValue = event.target.value;
    setUsernameHelperText('');
    if (usernameInputValue) {
      if (usernameInputValue.match(/^.{4,19}$/g)) {
        if (usernameInputValue.match(/[^A-Za-z0-9-_]/g)) {
          setUsernameIsValid(false);
          setUsernameHelperText('Letters, numbers, dashes, and underscores only. Please try again without symbols.')
          return;
        }
        const usernameExists = await (await fetch(`/api/checkusername/${usernameInputValue}`)).json();
        if (usernameExists.res) setUsernameHelperText('That username is already taken');
        else setUsernameHelperText('');
        setUsernameIsValid(!usernameExists.res);
      } else {
        setUsernameIsValid(false);
        setUsernameHelperText('Username must be between 3 and 20 characters');
      }
    } else {
      setUsernameIsValid(true);
      setUsernameHelperText('');
    }
  }

  // Password error toggler for Sign Up
  const [passwordIsValid, setpasswordIsValid] = useState(true);
  const [passwordHelperText, setPasswordHelperText] = useState('');
  const handlePasswordValidity = (e) => {
    const passwordInputValue = e.target.value;
    setPasswordHelperText('');
    if (passwordInputValue && passwordInputValue.length < 8) {
      setpasswordIsValid(false);
      setPasswordHelperText('Password must be atleatst 8 characters long');
    } else {
      setpasswordIsValid(true);
      setPasswordHelperText('');
    }
  }

  // Password Visibility handlers
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Handle Sign Up submit
  async function handleSubmit(e) {
    e.preventDefault();
    const logInFormData = Object.fromEntries(new FormData(e.target).entries());
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logInFormData),
      })
      if (res.status === 200) {
        router.push('/')
      } else {
        const { errorMsg } = await res.json();
        console.log('errorMsg: ', errorMsg)
        if (errorMsg.includes('email')) {
          handleClose();
          setEmailIsValid(false);
          setEmailHelperText(errorMsg);
        }
        if (errorMsg.includes('Username') || errorMsg.includes('username')) {
          setUsernameIsValid(false);
          setUsernameHelperText(errorMsg);
        }
        if (errorMsg.includes('password')) {
          setpasswordIsValid(false);
          setPasswordHelperText(errorMsg);
        }
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
    }
  }

  return (
    <Modal
      open={registerOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="grid auto-rows-min m-auto w-1/3 h-full content-center px-12 bg-white focus:outline-none overflow-y-auto">
        <IconButton onClick={handleClose} className="justify-self-start mb-5 -ms-3">
          <ArrowBackIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h5" className="font-bold">
          Create your username and password
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="subtitle2">
          {"Bellspace is anonymous, so your username is what you'll go by here. Choose wisely—because once you get a name, you can't change it."}
        </Typography>

        <form action="/api/register" method="post" onSubmit={handleSubmit}
          className="w-2/3 my-10 grid gap-7 justify-self-center"
        >
          <input type="email" name="email" value={emailValue} hidden readOnly />
          <TextField variant="standard" label='Username' onChange={handleUsernameValidity}
            error={!usernameIsValid} helperText={usernameHelperText} autoComplete="username"
            required name="username"
          />
          <FormControl variant="standard">
            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="password"
              required name="password"
              error={!passwordIsValid}
              onChange={handlePasswordValidity}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText error={!passwordIsValid}>{passwordHelperText}</FormHelperText>
          </FormControl>
          <Button variant="contained" color="primary" size="large" fullWidth
            type="submit" className="rounded-full my-5 font-semibold normal-case"
            disabled={!usernameIsValid || !passwordIsValid}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </Modal>
  )
}