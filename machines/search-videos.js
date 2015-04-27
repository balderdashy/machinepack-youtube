module.exports = {


  friendlyName: 'Search videos',


  description: 'List Youtube videos which match the specified search query.',


  cacheable: true,


  extendedDescription: '',


  inputs: {

    query: {
      description: 'The search query',
      example: 'grumpy cat',
      required: true
    },

    limit: {
      example: 15,
      description: 'The maximum number of results to return.',
      defaultsTo: 5,
      max: 50,
      min: 1,
    },

    apiKey: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The private Google API key for this application.',
      required: true,
      protect: true,
      whereToGet: {
        url: 'https://console.developers.google.com/project/hip-cycling-830/apiui/credential',
        description: 'Copy and paste an API key, or create one if you haven\'t already.',
        extendedDescription: 'If the key type you need does not already exist, create an API key by selecting Create New Key and then selecting "Server API Key". Then enter the additional data required for that key type.  Also make sure the YouTube API is enabled here: https://console.developers.google.com/project/hip-cycling-830/apiui/apiview/youtube'
      }
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      description: 'Returns an array of video metadata.',
      example: [{
        id: 'INscMGmhmX4',
        url: 'https://youtube.com/watch?v=INscMGmhmX4',
        title: 'The Original Grumpy Cat',
        description: 'Visit Grumpy Cat\'s Website: www.grumpycats.com New Tshirts at: http://bit.ly/gcteeshirts Twitter @RealGrumpyCat www.twitter.com/RealGrumpyCat Facebook ...',
        publishedAt: '2012-09-25T14:36:51.000Z'
      }]
    }

  },


  fn: function(inputs, exits) {

    var util = require('util');
    var _ = require('lodash');
    var Machine = require('machine');
    var Http = require('machinepack-http');

    // If specified `limit` must be between 1 and 50.
    if (!_.isUndefined(inputs.limit) && (inputs.limit > 50 || inputs.limit < 1)) {
      return exits.error('Input value for `limit` should be a number between 1 and 50.');
    }

    Http.sendHttpRequest({
      baseUrl: Machine.build(require('./get-base-url')).execSync(),
      method: 'get',
      url: '/search',
      params: {
        part: 'id,snippet',
        type: 'video',
        q: inputs.query,
        maxResults: inputs.limit || 5,
        key: inputs.apiKey
      }
    }).exec({

      // An unexpected error occurred.
      error: function(err) {
        return exits.error(err);
      },

      // OK.
      success: function(httpResponse) {

        // Parse response body and build up result.
        var responseBody;
        var result;
        try {
          responseBody = JSON.parse(httpResponse.body);
          result = _.reduce(responseBody.items, function (memo, video){

            // Omit results with no video id
            // (i.e. when the type is something other than youtube#video)
            if (!video.id.videoId) {
              return memo;
            }
            memo.push({
              id: video.id.videoId,
              url: 'https://youtube.com/watch?v='+video.id.videoId,
              title: video.snippet.title,
              description: video.snippet.description,
              publishedAt: video.snippet.publishedAt
            });
            return memo;
          }, []);
        }
        catch (e) {
          return exits.error('Unexpected response from YouTube API:\n'+util.inspect(responseBody, false, null)+'\n\nParse error:\n'+util.inspect(e));
        }

        return exits.success(result);

      }

    });

  },

};
