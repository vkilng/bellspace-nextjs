/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

export default function Image({
  image,
  classes = "",
  alt = "error fetching image",
}: any) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!("url" in image) || new Date() > new Date(image.expires_at)) {
        try {
          const res = await fetch(`/api/updateurl/${image._id}`);
          image.url = await res.text();
          console.log("image.url: ", image.url);
        } catch (error) {
          console.error(error);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return <div className={`${classes} bg-slate-300`}></div>;

  return <img src={image.url} alt={alt} className={classes} />;
}
