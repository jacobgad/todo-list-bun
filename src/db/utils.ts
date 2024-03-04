import { add } from "date-fns";
import { generateId } from "lucia";

export const generateSessionId = () => generateId(24);
export const getSessionExpiry = () => add(new Date(), { months: 1 });
