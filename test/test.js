const test = require('ava');
const jsonSchemaMerge = require('../');

test('work', t => {
  const s1 = {
    "title": "A registration form 1123",
    "type": "object",
    "required": [
      "firstName",
      "lastName"
    ],
    "properties": {
      "firstName": {
        "type": "string",
        "title": "First name 1"
      }
    }
  };
  const s2 = {
    "title": "A registration form",
    "description": "A simple form example.",
    "type": "object",
    "required": [
      "firstName",
      "lastName"
    ],
    "properties": {
      "firstName": {
        "type": "string",
        "title": "First name"
      },
      "lastName": {
        "type": "string",
        "title": "Last name"
      },
      "tasks": {
        "type": "array",
        "title": "Tasks",
        "items": {
          "type": "object",
          "required": [
            "title"
          ],
          "properties": {
            "title": {
              "type": "string",
              "title": "Title",
              "description": "A sample title"
            },
            "done": {
              "type": "boolean",
              "title": "Done?",
              "default": false
            }
          }
        }
      }
    }
  };
  const s3 = {
    "title": "A registration form",
    "description": "A simple form example.",
    "type": "object",
    "required": [
      "firstName",
      "lastName"
    ],
    "properties": {
      "firstName": {
        "type": "string",
        "title": "First name"
      },
      "lastName": {
        "type": "string",
        "title": "Last name"
      },
      "tasks": {
        "type": "array",
        "title": "Tasks",
        "items": {
          "type": "object",
          "required": [
            "title"
          ],
          "properties": {
            "title": {
              "type": "string",
              "title": "Title",
              "description": "A sample title"
            },
            "done": {
              "type": "boolean",
              "title": "Done?",
              "default": false
            }
          }
        }
      }
    }
  };
  t.deepEqual(jsonSchemaMerge(s1, s2), s3);
});
