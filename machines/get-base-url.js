module.exports = {


  friendlyName: 'Get base URL',


  description: 'Return the base URL for the YouTube API.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
      example: 'https://www.googleapis.com/youtube/v3'
    },

  },


  fn: function (inputs,exits) {
    return exits.success('https://www.googleapis.com/youtube/v3');
  },



};
