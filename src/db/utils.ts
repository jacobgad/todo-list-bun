import { alphabet, generateRandomString } from "oslo/crypto";
import { add } from "date-fns";

export const generateSessionId = () => generateRandomString(24, alphabet("a-z", "A-Z", "0-9"));
export const getSessionExpiry = () => add(new Date(), { months: 1 });
