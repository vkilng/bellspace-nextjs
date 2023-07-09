/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

import { MuiFileInput } from "mui-file-input";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from '@mui/material/Modal';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";
import Tooltip from '@mui/material/Tooltip'
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import UploadSimple from "@phosphor-icons/react/UploadSimple";

export default function CreateCommunityModal({ modalOpen = true, handleClose }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  // Community Input Value handlers
  const [communityNameIsValid, setCommunityNameIsValid] = useState(true);
  const [helperText, setHelperText] = useState('');
  const [descriptionIsValid, setDescriptionIsValid] = useState(true);
  const [descriptionHelperText, setDescriptionHelperText] = useState('');
  const handleCommunityNameValidity = (e) => {
    if (e.target.value && e.target.value.match(/([^a-zA-Z_])|^(.{0,3}|.{21,})$/)) {
      setCommunityNameIsValid(false);
      setHelperText('That community name is invalid. Check out the tooltip.')
    } else {
      setCommunityNameIsValid(true);
      setHelperText('');
    }
  }
  const handleDescriptionValidity = (e) => {
    if (e.target.value && e.target.value.length < 8) {
      setDescriptionIsValid(false);
      setDescriptionHelperText('Description must be atleast 8 characters long');
    } else {
      setDescriptionIsValid(true);
      setDescriptionHelperText('');
    }
  }

  // File Input validators
  const [file, setFile] = useState(null);
  const [fileIsValid, setFileIsValid] = useState(true);
  const [fileHelperText, setFileHelperText] = useState("");
  const handleFileChange = (newFile) => {
    const newFileType = newFile?.type.split('/')[1];
    if (newFile && !['png', 'jpg', 'jpeg'].includes(newFileType)) {
      setFileIsValid(false);
      setFileHelperText('incorrect File type');
      setFile(null);
      return;
    }
    setFileIsValid(true);
    setFileHelperText("");
    setFile(newFile);
  };

  // Handle community info submit
  async function handleSubmit(e) {
    e.preventDefault()
    const cCFormData = new FormData(e.target);
    if (file) {
      cCFormData.delete("community_profile_pic");
      cCFormData.append("community_profile_pic", file, file.name);
    } else {
      setFileIsValid(false);
      setFileHelperText("Select a file to continue");
      return;
    }
    try {
      const res = await fetch('/api/r/create-community', {
        method: 'POST',
        body: cCFormData,
      })
      if (res.status === 200) {
        const communityName = await res.text();
        handleClose();
        mutate('/api/r/get-list');
        router.push(`/r/${communityName}`);
      } else {
        const errorMsg = await res.text();
        console.log('errorMsg: ', errorMsg)
        if (errorMsg.includes('name')) {
          setCommunityNameIsValid(false);
          setHelperText(errorMsg);
          return;
        }
        if (errorMsg.includes('Description')) {
          setDescriptionIsValid(false);
          setDescriptionHelperText(errorMsg);
          return;
        }
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
    }
  }

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="grid items-center justify-center"
    >
      <div className="p-2 grid rounded-lg bg-white dark:bg-zinc-950 dark:text-white focus:outline-none overflow-y-auto max-h-full">
        <IconButton onClick={handleClose} size="small" className="justify-self-end">
          <CloseOutlinedIcon />
        </IconButton>
        <div className="p-8 pt-2 grid gap-2">
          <Typography id="modal-modal-title" variant="h5" className="font-bold">
            Create a community
          </Typography>
          <Divider />
          <form method="post" encType="multipart/form-data" onSubmit={handleSubmit} className="py-3 grid gap-10"
          >
            <div className="flex gap-3 items-center w-full">
              <TextField
                name="community_name"
                variant="standard"
                label="Community Name"
                required
                error={!communityNameIsValid}
                helperText={helperText}
                onChange={handleCommunityNameValidity}
                InputProps={{ startAdornment: <InputAdornment position="start" >r / </InputAdornment> }}
                fullWidth
              ></TextField>
              <Tooltip
                title='Names cannot have spaces (e.g., " r /bookclub" not "r/book club"), must be between 3-21 characters, and underscores ("_") are the only special characters allowed. Avoid using solely trademarked names (e.g., "r/FansOfAcme" not "r/Acme").'
                arrow placement="right"
              >
                <InfoOutlinedIcon fontSize="small" />
              </Tooltip>
            </div>
            <TextField
              name="community_description"
              variant="standard"
              multiline
              label="Community Description"
              required
              error={!descriptionIsValid}
              helperText={descriptionHelperText}
              onChange={handleDescriptionValidity}
            ></TextField>
            <MuiFileInput
              value={file}
              onChange={handleFileChange}
              variant="standard"
              label="Profile Picture"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UploadSimple size={20} />
                  </InputAdornment>
                ),
              }}
              error={!fileIsValid}
              helperText={fileHelperText}
            />
            <Button variant="contained" color="primary" type="submit" disabled={!communityNameIsValid}
              className="h-min rounded-full normal-case text-base font-bold px-10 py-2"
            >
              Create Community
            </Button>
          </form>
        </div>

      </div>
    </Modal>
  )
}