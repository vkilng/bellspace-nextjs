import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/lib/helperFunctions/fetcher";
import TiptapEditor from "@/components/TiptapEditor";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CommunityInfoPanel from "@/components/CommunityInfoPanel";
import { CurrentUserContext } from "@/lib/context";
import CircularProgress from "@mui/material/CircularProgress";
import { useBannerStore } from "@/lib/store";

export default function CreatePost() {
  const currentUser = useContext(CurrentUserContext);
  const router = useRouter();

  const setBannerContent = useBannerStore((state) => state.setBannerContent);
  useEffect(() => {
    setBannerContent({ icon: "plus", text: "Create Post" });
  }, []);

  // Editor content handlers
  const [content, setContent] = useState(
    '{"type":"doc","content":[{"type":"paragraph"}]}'
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const handleSetContent = (body: string) => setContent(body);
  const handleSetImageFiles = (files: Array<File>) => setImageFiles(files);

  // fetch community info using SWR
  const {
    data: { community = {} } = {},
    error,
    isLoading,
  } = useSWR(`/api/r/${router.query.community}`, fetcher);

  if (isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="h-full w-full flex items-center justify-center">
        Community with that name does not exist
      </div>
    );

  // Create Post submit handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const createPostFormData = new FormData(e.currentTarget);
    createPostFormData.append("community_id", community._id);
    if (imageFiles.length > 0)
      imageFiles.forEach((file) => {
        createPostFormData.append("imageFiles", file, file.name);
      });
    try {
      if (currentUser) {
        const res = await fetch(`/api/r/${community.name}/submit`, {
          method: "POST",
          body: createPostFormData,
        });
        if (res.status === 200) router.push(`/r/${community.name}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (currentUser)
    return (
      <div className="grid grid-rows-1 lg:overflow-y-hidden lg:h-full">
        <div className="overflow-y-auto p-3 md:p-5 lg:p-10 grid lg:grid-cols-[2fr_1fr] gap-3 lg:gap-10">
          <div className="lg:hidden">
            <CommunityInfoPanel community={community} key={community._id} />
          </div>
          {currentUser?.communities &&
          currentUser.communities.includes(community._id) ? (
            <form
              className="overflow-y-auto px-1 grid gap-5 auto-rows-min"
              method="POST"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <TextField
                className="m-2"
                name="post_title"
                label="Title"
                variant="standard"
                color="secondary"
                required
              />
              <input type="hidden" name="post_content" hidden value={content} />
              <TiptapEditor
                options={{
                  type: "post",
                  functions: [handleSetContent, handleSetImageFiles],
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                className="w-min rounded-full px-10 font-bold justify-self-end"
                disableElevation
              >
                Post
              </Button>
            </form>
          ) : (
            <div className="text-center">{`You're not a member of this community`}</div>
          )}
          <div className="hidden lg:block">
            <CommunityInfoPanel community={community} key={community._id} />
          </div>
        </div>
      </div>
    );
}
