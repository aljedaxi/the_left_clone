/*
  @file event schemata
  @copyright fuck off
  @author daxi
*/

class MalformedMetaData extends Error {
  constructor(message) {
    super(message);
    this.name = 'MalformedMetaData';
  }
}

const org = 'ryuuko';
const app = 'the_left';
/*
  @returns content portion of a gathering declaration
*/
function EventDeclaration() {
  return {
    type: `${org}-${app}-gathering`,
  };
}

class EventMeta {
  constructor(
    event_id, 
    title, 
    description, 
    event_location, 
    startDateTime, 
    endDateTime, 
    contributors,
    hosts,
    attendees,
    images,
    address,
  ) {
    this.event_id = event_id, 
    this.title = title, 
    this.description = description, 
    this.event_location = event_location, 
    this.startDateTime = startDateTime, 
    if(endDateTime) {
      this.endDateTime = endDateTime, 
    }
    if(contributors) {
      this.contributors = contributors,
    }
    if(hosts) {
      this.hosts = hosts,
    }
    if(attendees) {
      this.attendees = attendees,
    }
    if(images) {
      this.images = images,
    }
    if(address) {
      this.address = address,
    }
  }
}

/*
  @returns content portion of a message detailing gathering metadata
  @param {EventMeta} event_meta
  details the async part of https://github.com/pietgeursen/patch-gatherings
 */

function Event(event_meta, event_id) {
  if (!(event_meta.title && event_meta.location && event_meta.description && (event_id || event_meta.event_id) ) ) {
    throw new MalformedMetaData('the event metadata you passed lacked a title, location, description, or event_id.');
  }

  const decompose_date_time = time => {
    return {
      epoch: time.getTime(),
      tz: this.timezone,
    };
  };

  this.geocode = address => address; //TODO //nomintatim.org

  this.timezone = event_meta.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  event_id = event_id || event_meta.event_id;
  event_meta.type = 'about';
  event_meta.about = event_id;
  event_meta.branch = event_id; //don't actually know what this means
  if (event_meta.start_time) {
    event_meta.startDateTime = decompose_date_time(start_time, event_timezone);
  }
  if (event_meta.end_time) {
    event_meta.endDateTime = decompose_date_time(end_time, event_timezone);
  }
  if (event_meta.address) {
    event_meta.geometry = this.geocode(address);
  }
    
  return event_meta;
}
