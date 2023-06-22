/* eslint-disable @next/next/no-img-element */
import { useContext } from "react";
import { PageBannerContext } from "./Context";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Plus from '@phosphor-icons/react/Plus';


export default function PageBanner() {
  const { bannerContent } = useContext(PageBannerContext);

  function getIcon(icon = bannerContent.icon) {
    switch (icon) {
      case 'home':
        return <HomeOutlinedIcon fontSize='small' />
        break;

      case 'add':
        return <Plus size={20} />
        break;

      case 'image':
        return <img src={bannerContent.url} alt='img' width={12} height={12} className='rounded-full' />

      default:
        break;
    }
  }

  return (
    <div className='flex items-center justify-center py-2 px-4'>
      {getIcon()}
      {bannerContent.text}
    </div>
  )
}