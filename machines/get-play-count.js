module.exports = {
  friendlyName: 'Get play count',
  description: 'Display the number of views of a Youtube Video.',
  cacheable: true,
  extendedDescription: '',
  inputs: {
    url: {
      example: 'https://www.youtube.com/watch?v=TruIq5IxuiU',
      description: 'The URL of a Youtube Video.',
      required: true
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
    rateLimitExceeded: {
      description: 'The rate limit has been exceeded.',
    },
    invalidUrl: {
      description: 'Unable to parse a video id from the provided YouTube URL.'
    },
    success: {
      description: 'Returns statistics about the video',
      extendedDescription: 'Counts are reflected as strings to prevent integer overflow issues.',
      example: {
        viewCount: '19255096',
        likeCount: '116321'
      }
    }
  },
  fn: function(inputs, exits) {

    var util = require('util');
    var _ = require('lodash');
    var Machine = require('machine');
    var Http = require('machinepack-http');

    // The Youtube API URL setup
    var BASE_URL = Machine.build(require('./get-base-url')).execSync();

    // Get the id of the video from the URL
    var videoId = Machine.build(require('./parse-video-id')).configure({
      url: inputs.url
    }).execSync();

    Http.sendHttpRequest({
      baseUrl: BASE_URL,
      method: 'get',
      url: '/videos',
      params: {
        part: 'contentDetails,statistics',
        id: videoId,
        key: inputs.apiKey
      }
    }).exec({
      // OK.
      success: function(httpResponse) {

        // Parse response body and build up result.
        var responseBody;
        var result;
        try {
          responseBody = JSON.parse(httpResponse.body);
          result = {
            viewCount: responseBody.items[0].statistics.viewCount,
            likeCount: responseBody.items[0].statistics.likeCount
          };
        } catch (e) {
          return exits.error('Unexpected response from YouTube API:\n'+util.inspect(responseBody, false, null)+'\nParse error:\n'+util.inspect(e));
        }

        return exits.success(result);

      },
      // Non-2xx status code returned from server
      notOk: function(httpResponse) {

        try {
          var responseBody = JSON.parse(httpResponse.body);
          if (httpResponse.status === 403 && _.any(responseBody.error.errors, {
              reason: 'rateLimitExceeded'
            })) {
            return exits.rateLimitExceeded();
          }
          // Unknown youtube error
          return exits.error(httpResponse);
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
