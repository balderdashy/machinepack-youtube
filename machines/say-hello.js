module.exports = {

  friendlyName: 'Say hello',

  description: 'Log a hello message with a generated secret code and other information',

  extendedDescription: 'This example machine is part of machinepack-boilerplate, used to introduce everyone to machines.',

  inputs: {

    name: {

      example: 'John',

      description: 'The name of the person that will be sent the hello message.',

      required: true
    }

  },

  defaultExit: 'success',

  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      example:  {
        numLettersInName: 4,
        secretCode: "e9ec627220bc9e8ca66f916b7fba92f3"
      }
    }
  },

  fn: function (inputs, exits) {

    /**
     * Module Dependencies
     */

    // ...


    // Generate a secret code.
    var secretCode = ''+(Math.random());

    // Get the number of characters in the provided `name`.
    var myLength = inputs.name.length;

    // Log the provided name and the secret code.
    console.log("Hello %s, your secret code is %s", inputs.name, secretCode);

    // Return an object containing myLength and the secretCode
    return exits.success({
      numLettersInName: myLength,
      secretCode: secretCode
    });

  }

};
