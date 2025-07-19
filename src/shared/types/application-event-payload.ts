import { ApplicationStatus } from '@prisma/client';

export type ChangeStatusEventPayload = {
  from: ApplicationStatus;
  to: ApplicationStatus;
};

export type NoteCreationEventPayload = {
  note: string;
};

export type CreationEventPayload = {};
