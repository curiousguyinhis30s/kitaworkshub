// Calendar utility for generating Add to Calendar links

interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
}

// Generate Google Calendar URL
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(event.startDate)}/${formatDate(event.endDate)}`,
    details: event.description || '',
    location: event.location || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Generate ICS file content for download
export function generateICS(event: CalendarEvent): string {
  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KitaWorksHub//EN
BEGIN:VEVENT
DTSTART:${formatDate(event.startDate)}
DTEND:${formatDate(event.endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
END:VEVENT
END:VCALENDAR`;
}

// Download ICS file
export function downloadICS(event: CalendarEvent): void {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Parse date string like "Jan 15, 2025" and time "9:00 AM - 5:00 PM"
export function parseEventDateTime(dateStr: string, timeStr: string): { start: Date; end: Date } {
  const dateParts = dateStr.replace(',', '').split(' ');
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  const month = months[dateParts[0]];
  const day = parseInt(dateParts[1]);
  const year = parseInt(dateParts[2]);

  const timeParts = timeStr.split(' - ');

  const parseTime = (t: string) => {
    const [time, period] = t.trim().split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let adjustedHours = hours;
    if (period === 'PM' && hours !== 12) adjustedHours += 12;
    if (period === 'AM' && hours === 12) adjustedHours = 0;
    return { hours: adjustedHours, minutes };
  };

  const startTime = parseTime(timeParts[0]);
  const endTime = timeParts[1] ? parseTime(timeParts[1]) : { hours: startTime.hours + 1, minutes: startTime.minutes };

  const start = new Date(year, month, day, startTime.hours, startTime.minutes);
  const end = new Date(year, month, day, endTime.hours, endTime.minutes);

  return { start, end };
}
