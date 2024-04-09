import { getMainContent } from "@functions/Home";
import {
  confirmSignUp,
  signIn,
  signUp,
} from "@functions/Login";
import { getProfiles, addNewProfile } from "@functions/Profile";

export default {
  confirmSignUp,
  signIn,
  signUp,
  getProfiles,
  addNewProfile,
  getMainContent
} as const;
