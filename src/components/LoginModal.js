/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import FormHelperText from '@mui/material/FormHelperText'
import Input from "@mui/material/Input";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function LoginModal({ LogInOpen = true, handleClose }) {
  const router = useRouter();

  // Username validity handlers for Log In
  const [usernameIsValid, setUsernameIsValid] = useState(true);
  const [usernameHelperText, setUsernameHelperText] = useState('');
  const handleUsernameValidity = async (event) => {
    const usernameInputValue = event.target.value;
    if (usernameInputValue && usernameInputValue.length >= 3) {
      const usernameExists = await (await fetch(`/api/checkusername/${usernameInputValue}`)).json();
      if (usernameExists.res) setUsernameHelperText('');
      else setUsernameHelperText('User with that username does not exist');
      setUsernameIsValid(usernameExists.res);
    } else if (usernameInputValue && usernameInputValue.length < 3) {
      setUsernameIsValid(false);
      setUsernameHelperText('Username must be between 3 and 20 characters');
    } else {
      setUsernameIsValid(true);
      setUsernameHelperText('');
    }
  }

  // Password error toggler for Log In
  const [passwordIncorrect, setpasswordIncorrect] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState('');

  // Password Visibility handlers
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Handle Log In submit
  async function handleSubmit(e) {
    e.preventDefault()
    const logInFormData = Object.fromEntries(new FormData(e.target).entries());
    try {
      const res = await fetch('/api/login/auth/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logInFormData),
      })
      if (res.status === 200) {
        router.reload('/')
      } else {
        const errorMsg = await res.text()
        console.log('errorMsg: ', errorMsg)
        if (errorMsg.includes('Username')) {
          setUsernameIsValid(false);
          setUsernameHelperText('Username is incorrect');
        } else {
          setpasswordIncorrect(true);
          setPasswordHelperText('Password is incorrect');
        }
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
    }
  }

  return (
    <Modal
      open={LogInOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="grid auto-rows-min m-auto w-1/3 h-full p-12 bg-white focus:outline-none overflow-y-auto">
        <IconButton onClick={handleClose} className="justify-self-end">
          <ArrowBackIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h5" className="font-bold">
          Log In
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          By continuing, you are setting up a Bellspace account and agree to our User Agreement and Privacy Policy.
        </Typography>
        <div className="mt-10">
          <Button href="/api/login/auth/google" variant="outlined" size="large" color="secondary" fullWidth
            className="normal-case rounded-full bg-white border-gray-300 hover:bg-[rgb(238,238,238)] hover:border-gray-300 focus:outline-none"
            startIcon={<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/32px-Google_%22G%22_Logo.svg.png" alt="Google &quot;G&quot; Logo" width={20} height={20} />}
          >
            <div className="p-1 w-full flex justify-center text-base font-semibold text-stone-500">Continue with Google</div>
          </Button>
        </div>

        <Divider className="py-10">OR</Divider>

        <form action="/api/login" method="post" onSubmit={handleSubmit}
          className="w-2/3 grid gap-7 justify-self-center">
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
              required
              name="password"
              error={passwordIncorrect}
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
            <FormHelperText error={passwordIncorrect}>{passwordHelperText}</FormHelperText>
          </FormControl>
          <Button variant="contained" color="primary" size="large" fullWidth
            type="submit" className="rounded-full my-5 font-semibold normal-case">
            Log In
          </Button>
        </form>
      </div>
    </Modal>
  )
}