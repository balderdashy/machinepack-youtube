module.exports = {
  friendlyName: 'Get video count',
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

    var URL = require('url');
    var QS = require('querystring');
    var _ = require('lodash');
    var Http = require('machinepack-http');


    // The Youtube API URL setup
    var BASE_URL = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id='

    // Get the id of the video from the URL
    var Video_id = QS.parse(URL.parse(inputs.url).query).v;

    // Build up the necessary Access Key
    var Access_key = '&key=' + inputs.appId;

    baseUrl = BASE_URL + Video_id + Access_key;

    Http.sendHttpRequest({
      baseUrl: baseUrl,
      url: '',
      method: 'get',
    }).exec({
      // OK.
      success: function(result) {

        try {
          var responseBody = JSON.parse(result.body);
        } catch (e) {
          return exits.error('An error occurred while parsing the body.');
        }

        return exits.success({
          viewCount: responseBody.items[0].statistics.viewCount,
          likeCount: responseBody.items[0].statistics.likeCount
        });

      },
      // Non-2xx status code returned from server
      notOk: function(result) {

        try {
          if (result.status === 403 && _.any(parsedBody.error.errors, {
              reason: 'rateLimitExceeded'
            })) {
            return exits.rateLimitExceeded();
          }
        } catch (e) {
          return exits.error(e);
        }

        try {
          var responseBody = JSON.parse(result.body);
        } catch (e) {
          return exits.error('An error occurred while parsing the body.');
        }

        return exits.error(err);

      },
      // An unexpected error occurred.
      error: function(err) {

        return exits.error(err);


      },
    });

    // // Make a request to the Google Youtube API
    // Request(BASE_URL+Video_id+Access_key, function(err, response, httpBody) {

    //   // Check rate for limit
    //   if (response.statusCode === '403' || '') {
    //     returns exits.rateLimitExceeded("Your rate limit has been exceeded.");
    //   }

    //   // Parse the httpBody
    //   try{
    //   var responseBody = JSON.parse(httpBody);
    //   }
    //   catch(e) {
    //     return exits.error('An error occurred while parsing httpBody');
    //   }

    //   // Return only the viewCount and likeCount
    //   return exits.success({
    //     viewCount: responseBody.items[0].statistics.viewCount,
    //     likeCount: responseBody.items[0].statistics.likeCount
    //   });
    // })

  },

};