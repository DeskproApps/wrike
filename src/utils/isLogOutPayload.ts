import { EventPayload, LogOutPayload } from '../types';

export function isLogOutPayload(payload: EventPayload): payload is LogOutPayload {
  return typeof payload === 'object' && Boolean(payload) && payload.type === 'logOut';
};