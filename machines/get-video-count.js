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
    success: { 
      description: 'Returns statistical data about the Video', 
      example: {
        viewCount: "19255096",
        likeCount: "116321"
      }
    } 
  },
  fn: function (inputs,exits) {

    URL = require('url');
    QS = require('querystring');
    Request = require('request');


    // The Youtube API URL setup
    var BASE_URL = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id='

    // Get the id of the video from the URL
    var Video_id = QS.parse(URL.parse(inputs.url).query).v;

    // Build up the necessary Access Key
    var Access_key = '&key=' + inputs.appId;

    // Make a request to the Google Youtube API
    Request(BASE_URL+Video_id+Access_key, function(err, response, httpBody) {

      // Parse the httpBody
      try{
      var responseBody = JSON.parse(httpBody);
      }
      catch(e) {
        return exits.error('Not JSON');
      }

      // Return only the viewCount and likeCount
      return exits.success({
        viewCount: responseBody.items[0].statistics.viewCount,
        likeCount: responseBody.items[0].statistics.likeCount
      });
    })

  },

};
