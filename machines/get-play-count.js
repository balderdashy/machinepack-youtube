module.exports = {
  friendlyName: 'Get play count',
  description: 'Display the number of views of a Youtube Video.',
  extendedDescription: '',
  inputs: {
    url: {
      example: 'https://www.youtube.com/watch?v=TruIq5IxuiU',
      description: 'The URL of a Youtube Video.',
      required: true
    },
    appId: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The public Google API key for this application.',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    rateLimitExceeded: {
      description: 'The rate limit has been exceeded.',
    },
    success: {
      description: 'Returns statistical data about the Video',
      example: {
        viewCount: "19255096",
        likeCount: "116321"
      }
    }
  },
  fn: function(inputs, exits) {

    var util = require('util');
    var URL = require('url');
    var QS = require('querystring');
    var _ = require('lodash');
    var Http = require('machinepack-http');

    // The Youtube API URL setup
    var BASE_URL = 'https://www.googleapis.com';

    Http.sendHttpRequest({
      baseUrl: BASE_URL,
      url:
      '/youtube/v3/videos?part=contentDetails,statistics&'+
      // Get the id of the video from the URL
      'id='+QS.parse(URL.parse(inputs.url).query).v+
      '&key=' + inputs.appId,
      method: 'get',
    }).exec({
      // OK.
      success: function(result) {

        var responseBody;
        try {
          responseBody = JSON.parse(result.body);
          responseBody = {
            viewCount: responseBody.items[0].statistics.viewCount,
            likeCount: responseBody.items[0].statistics.likeCount
          };
        } catch (e) {
          return exits.error('Unexpected response from YouTube API:\n'+util.inspect(responseBody, false, null)+'\nParse error:\n'+util.inspect(e));
        }

        return exits.success();

      },
      // Non-2xx status code returned from server
      notOk: function(result) {

        try {
          var responseBody = JSON.parse(result.body);
          if (result.status === 403 && _.any(responseBody.error.errors, {
              reason: 'rateLimitExceeded'
            })) {
            return exits.rateLimitExceeded();
          }
          // Unknown youtube error
          return exits.error(result);
        } catch (e) {
          return exits.error('Unexpected response from YouTube API:\n'+util.inspect(responseBody, false, null)+'\nParse error:\n'+util.inspect(e));
        }

      },
      // An unexpected error occurred.
      error: function(err) {
        return exits.error(err);
      }
    });

  },

};
