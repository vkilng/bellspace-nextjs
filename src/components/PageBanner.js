/* eslint-disable @next/next/no-img-element */

import HomeIcon from '@mui/icons-material/Home';
import { Plus } from "@phosphor-icons/react";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import IconButton from '@mui/material/IconButton'
import { useBannerStore } from "@/lib/store";
import Image from './Image';

export default function PageBanner() {
  const { bannerContent, sidebarHidden, toggleSidebar } = useBannerStore();

  function getIcon(icon = bannerContent?.icon) {
    switch (icon) {
      case 'home':
        return <HomeIcon fontSize='small' />
        break;

      case 'plus':
        return <Plus size={20} />
        break;

      case 'user':
        return <img src='/images/blank-profile-pic.png' alt='pp' width={20} height={20} className="rounded-full" />;
        break;

      case 'image':
        return <Image image={bannerContent.image} alt="img" classes="w-6 h-6 rounded-full" />

      default:
        break;
    }
  }

  return (
    <div className='flex gap-3 items-center justify-center py-1 px-4 font-sans text-sm dark:text-white'>
      <div className='hidden lg:block'>
        {sidebarHidden &&
          <IconButton aria-label="toggle-sidebar" onClick={toggleSidebar}>
            <MenuOpenIcon />
          </IconButton>
        }
      </div>
      <div className='flex gap-3 items-center'>
        {getIcon()}
        <div className='max-w-[8rem] overflow-hidden whitespace-nowrap text-ellipsis md:max-w-full'>{bannerContent?.text}</div>
      </div>
    </div>
  )
}