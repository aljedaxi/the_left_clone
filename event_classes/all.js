/**
  @file event schemata
  @copyright fuck off
  @author daxi
*/
/*
  fyi, gatherings work by creating an {EventDeclaration} message; 
  that message doesn't contain any information of its own.
  Information about the event is contained within various "about" messages,
  which link back to the original {EventDeclaration}.
 */

const org = 'ryuuko';
const app = 'the_left';

/**
  @returns content portion of a gathering declaration
*/
function EventDeclaration() {
  return {
    type: `${org}-${app}-gathering`,
  };
}

/**
  * this is literally just here to describe what {Event} needs
 */
class EventMeta {
  constructor(event_id, title, description, event_location, startDateTime, endDateTime, contributors, hosts, attendees, images, address) {
    if (!event_id) {
      throw SyntaxError('this is metadata; it must refer to data');
    }
    this.event_id = event_id;
    this.title = title;
    this.description = description;
    this.event_location = event_location;
    this.startDateTime = startDateTime;
    if(endDateTime) {
      this.endDateTime = endDateTime;
    }
    if(contributors) {
      this.contributors = contributor;
    }
    if(hosts) {
      this.hosts = host;
    }
    if(attendees) {
      this.attendees = attendee;
    }
    if(images) {
      this.images = image;
    }
    if(address) {
      this.address = addres;
    }
  }
}

/**
  @description generates the content portion of an gathering
  @returns content portion of a message detailing gathering metadata
  @param {EventMeta} event_meta
  details the async part of https://github.com/pietgeursen/patch-gatherings
 */
function Event(event_meta) {
  if(!event_meta.event_id) {
    throw new SyntaxError('metadata must be meta to data. call this with an event_id');
  }

  const decompose_date_time = time => {
    return {
      epoch: time.getTime(),
      tz: this.timezone,
    };
  };

  this.geocode = address => address; //TODO //nomintatim.org

  this.timezone = event_meta.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  event_id = event_meta.event_id;
  delete event_meta.event_id;

  //these things are mandatory
  event_meta.type = 'about';
  event_meta.about = event_id;
  event_meta.branch = event_id; //don't actually know what this means
  //these things need processing
  if (event_meta.start_time) {
    event_meta.startDateTime = decompose_date_time(start_time, event_timezone);
  }
  if (event_meta.end_time) {
    event_meta.endDateTime = decompose_date_time(end_time, event_timezone);
  }
  if (event_meta.address) {
    event_meta.geometry = this.geocode(address);
  }
  //everything else is already in ${event_meta}
  return event_meta;
}

function OpeningEvent(event_id, title, event_location, description, event_meta) {
  if (!(title && event_location && description && event_id) ) {
    throw new SyntaxError('the event metadata you passed lacked a title, location, description, or event_id.');
  }

  event_meta = event_meta || {};
  Object.assign(event_meta, {
    event_id,
    title,
    event_location,
    description,
  });

  return new Event(event_meta);
}

// https://ssbc.github.io/scuttlebutt-protocol-guide/
function Message(previous, author, sequence, content) {
  return {
    previous,
    author,
    sequence,
    content,
    hash: 'sha256',
    timestamp: new Date().getTime(),
  };
}

const me = "@3P07vY/2X2ErDk9tJPhMgyyJdPGWfnP3CgazkMYc66E=.ed25519";
const test_Message = Message.bind(null, null, me, 1);

//const e = new EventMeta(5, 'meme', 

//test
const fail_EventMeta = () => new EventMeta();

const fail_Event = () => new Event({title: 'meme'});

const fail_OpeningEvent = () => new OpeningEvent();

const basic_event = new OpeningEvent(5, 'party', "Jules'", "party");

const basic_message = new test_Message(basic_event);

console.log(basic_message);
