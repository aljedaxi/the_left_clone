'use strict'
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

const ssbkeys = require('ssb-keys');

/**
  @returns content portion of a gathering declaration
  @class
  */
function EventDeclaration() {
  const org = 'ryuuko';
  const app = 'the_left';
  return {
    type: `${org}-${app}-gathering`,
  };
}

/**
  * this is literally just here to describe what {Event} needs
  @class
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
  @class
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

  const event_id = event_meta.event_id;
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

/**
  @class
  @param {string} event_id       
  @param {string} title          
  @param {string} event_location 
  @param {string} description    
  @param {EventMeta} event_meta  
  @returns {Event}
  */
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

/**
  // https://ssbc.github.io/scuttlebutt-protocol-guide/
  @class
  @param {string} author   -- id of the author of the message
  @param {string} previous -- id of the previous message in the feed
  @param {number} sequence -- where this message fits into the message feed
  @param {Object} content  -- the content of the message
  @returns the 'value' portion of a scuttlebutt message (without the signature)
  */
function MessageVal(previous, author, sequence, content) {
  return {
    previous,
    sequence,
    author,
    timestamp: new Date().getTime(),
    hash: 'sha256',
    content,
  };
}

/**
  * signs the value of the message, attaches the key, and timestamps the message
  @class
  @param {MessageVal} message_value_without_sig
  @param              keys                      -- keys supplied by ssbkeys
  @returns a scuttlebutt message
  */
function MessageWrapper(message_value_without_sig, keys) {
  const message_value = ssbkeys.signObj(keys, message_value_without_sig);

  const id = ssbkeys.hash(JSON.stringify(message_value, null, 2)); //TODO encoding?

  return {
    key: `%${id}`,
    value: message_value,
    timestamp: new Date().getTime(),
  }
}

/**
  @class
  @param          keys     -- keys supplied ssbkeys
  @param {string} previous -- id of the previous message in the feed
  @param {number} sequence -- where this message fits into the message feed
  @param {Object} content  -- the content of the message
  @returns a {MessageVal} wrapped in {MessageWrapper}
  */
function Message(keys, previous, sequence, content) {
  const me = keys.id;
  return new MessageWrapper(
    new MessageVal(
      previous, me, sequence, content
    ),
    keys
  );
}


//const e = new EventMeta(5, 'meme', 

//test
const test_suite = () => {
  const fail_EventMeta = () => new EventMeta();

  const fail_Event = () => new Event({title: 'meme'});

  const fail_OpeningEvent = () => new OpeningEvent();
};

const test_feed = (keys) => {
  const me = keys.id;

  const test_Message = MessageVal.bind(null, null, me, 1);

  const event_declaration = new EventDeclaration();

  const opening_event = test_Message(event_declaration);

  const opening_message = new MessageWrapper(opening_event, keys);

  const opening_message_id = opening_message.key;

  const basic_event = new OpeningEvent(opening_message_id, 'test gathering', "Jules'", "bazinga");

  const basic_message = new MessageVal(opening_message_id, me, 2, basic_event);

  const message_out = new MessageWrapper(basic_message, keys);
  return [
   opening_message,
   message_out,
  ]
};

const new_test_feed = (keys) => {
  const event_declaration = new EventDeclaration();

  const opening_message = new Message(keys, null, 1, event_declaration);

  const opening_message_id = opening_message.key;

  const basic_event = new OpeningEvent(opening_message_id, 'test gathering', "Jules'", "bazinga");

  const message_out = new Message(keys, opening_message_id, 2, basic_event);
  return [
   opening_message,
   message_out,
  ]
};

const testing = false;
if(testing) {
  const keys = ssbkeys.generate();
  console.log(test_feed(keys));
  console.log(new_test_feed(keys));
}

module.exports = {
  EventDeclaration,
  EventMeta,
  Event,
  OpeningEvent,
  MessageVal,
  MessageWrapper,
  Message,
};
