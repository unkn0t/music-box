export class TimeFormatter {
  static format(millis: number): string {
    const time = this.toTime(millis);
    let res = '';
    if (time.hours) {
      res += time.hours + ':';
      res += this.formatWithZero(time.minutes) + ':';
    } else {
      res += time.minutes + ':';
    }
    res += this.formatWithZero(time.seconds);
    return res;
  }

  static formatAbout(millis: number): string {
    const time = this.toTime(millis);
    let res = '';
    if (time.weeks) {
      res += time.weeks + ' w';
      if (time.days) {
        res += ' ' + time.days + ' days';
      }
    } else if (time.days) {
      res += time.days + ' d';
      if (time.hours) {
        res += ' ' + time.hours + ' hours';
      }
    } else if (time.hours) {
      res += time.hours + ' h';
      if (time.minutes) {
        res += ' ' + time.minutes + ' mins';
      }
    } else if (time.minutes) {
      res += time.minutes + ' m';
      if (time.seconds) {
        res += ' ' + time.seconds + ' secs';
      }
    } else if (time.seconds) {
      res += time.seconds + ' s';
      if (time.millis) {
        res += ' ' + time.millis + ' ms';
      }
    } else {
      res += time.millis + ' ms';
    }
    return res;
  }

  private static formatWithZero(data: number): string {
    return data < 10 ? '0' + data : `${data}`;
  }

  private static toTime(millis: number): Time {
    const seconds = Math.floor(millis / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    return {
      millis: millis % 1000,
      seconds: seconds % 60,
      minutes: minutes % 60,
      hours: hours % 24,
      days: days % 7,
      weeks: weeks
    };
  }
}

interface Time {
  weeks: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  millis: number,
}
