import TextField from "@mui/material/TextField";
import MagnifyingGlass from "@phosphor-icons/react/MagnifyingGlass";


export default function SearchBar() {
  return (
    <form className="w-1/3 justify-self-center relative">
      <TextField
        variant="filled"
        size="medium"
        fullWidth
        placeholder="Search..."
        InputProps={{
          startAdornment: <MagnifyingGlass size={12} className="mr-1" />,
          sx: { borderRadius: 99999, '& .MuiInputBase-input': { padding: 0.7 } },
          disableUnderline: true,
          style: { fontSize: '0.8rem' }
        }}
      ></TextField>
    </form>
  )
}