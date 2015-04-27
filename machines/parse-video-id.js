module.exports = {


  friendlyName: 'Parse video ID',


  description: 'Parse the video ID from the provided YouTube.com URL.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    url: {
      example: 'https://www.youtube.com/watch?v=TruIq5IxuiU',
      description: 'The URL of a Youtube Video.',
      required: true
    },

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    invalidUrl: {
      description: 'Unable to parse a video id from the provided YouTube URL.'
    },

    success: {
      description: 'Done.',
      example: 'TruIq5IxuiU'
    }

  },


  fn: function (inputs,exits) {

    var URL = require('url');
    var QS = require('querystring');

    try {
      var videoId = QS.parse(URL.parse(inputs.url).query).v;
      return exits.success(videoId);
    }
    catch (e) {
      return exits.invalidUrl(e);
    }

  },



};
