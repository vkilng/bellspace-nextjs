import IconButton from '@mui/material/IconButton'
import { ArrowUp } from '@phosphor-icons/react'
import { useEffect, useState } from 'react';


export default function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);

  const toggleButton = () => {
    if (document.querySelector('.scroll-up-container').scrollTop > 100)
      setShowButton(true);
    else setShowButton(false);
  }

  useEffect(() => {
    let counter = 0;
    const intervalId = setInterval(() => {
      counter++;
      if (document.querySelector('.scroll-up-container')) {
        toggleButton();
        document.querySelector('.scroll-up-container').onscroll = toggleButton;
        clearInterval(intervalId);
        return;
      }
      if (counter > 5) {
        clearInterval(intervalId);
      }
    }, 1000);
  })


  const scrollUp = () => {
    document.querySelector('.scroll-up-container').scrollTo({ top: 0, behavior: 'smooth' });
    setShowButton(false);
  }

  if (showButton) return (
    <IconButton aria-label="" onClick={scrollUp} className='absolute bottom-5 right-10'>
      <ArrowUp size={32} />
    </IconButton>
  )

  return <div></div>
}