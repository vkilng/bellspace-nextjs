export interface currentUserType {
  _id?: String;
  created_at: Date;
  updated_at?: Date;
  username: String;
  email?: String;
  password?: String;
  profilepicurl?: String;
  communities?: Array<String>;
  upvoted?: Array<String>;
  downvoted?: Array<String>;
  pinned?: Array<String>;
  saved?: Array<String>;
}

export interface postObj {
  _id: string;
  created_at: Date;
  updated_at?: Date;
  title: string;
  body?: string;
  imgurl?: string;
  author: string;
  community?: string;
  commentCount: number;
  upvotes: number;
}

export interface commentObj {
  _id: string;
  created_at: Date;
  updated_at?: Date;
  body: string;
  author: string;
  post: string;
  upvotes: number;
  parent_comment: string;
  depth: number;
}

export interface pageBannerObj {
  icon: string;
  url?: string;
  text: string;
}

export interface imageObj {
  file_name:string,
  url:string,
  updated_at: Date,
  expires_at: Date
}
