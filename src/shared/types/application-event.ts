import {
  ChangeStatusEventPayload,
  CreationEventPayload,
  NoteCreationEventPayload,
} from './application-event-payload';

export type ApplicationCreationEvent = {
  type: 'CREATION';
  payload: CreationEventPayload;
};

export type ApplicationChangeStatusEvent = {
  type: 'STATUS_CHANGE';
  payload: ChangeStatusEventPayload;
};

export type ApplicationCreateNoteEvent = {
  type: 'NOTE_CREATION';
  payload: NoteCreationEventPayload;
};

export type ApplicationEventData =
  | ApplicationCreationEvent
  | ApplicationChangeStatusEvent
  | ApplicationCreateNoteEvent;
