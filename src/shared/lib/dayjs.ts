import dayjs, { BusinessHoursMap } from 'dayjs';
import businessTime from 'dayjs-business-time';

const businessDays: BusinessHoursMap = {
  sunday: null,
  monday: [{ start: '09:00:00', end: '17:00:00' }],
  tuesday: [
    { start: '09:00:00', end: '12:00:00' },
    { start: '13:00:00', end: '18:00:00' },
  ],
  wednesday: [
    { start: '09:00:00', end: '12:00:00' },
    { start: '13:00:00', end: '16:00:00' },
    { start: '13:00:00', end: '17:00:00' },
  ],
  thursday: [{ start: '09:00:00', end: '17:00:00' }],
  friday: [{ start: '09:00:00', end: '17:00:00' }],
  saturday: null,
};

dayjs.extend(businessTime);
dayjs.setBusinessTime(businessDays);

export default dayjs;
