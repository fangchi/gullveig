module.exports = {
  route_paths: {
    'get /login': {
      'pre': [{
        'validatorplugin': {
          's': 's222'
        }
      }, {
        'mergeplugin': {
          'name': 'username'
        }
      }],
      'after': []
    },
    'post /login/:loginid': {
      'pre': [{
        'changeplugin': {
          'query': {
            'sd': 'newAttr'
          },
          'body': {
            's1': 'newAttr2'
          },
        }
      }, {
        'mergeplugin': {
          'query': {
            's3': 's3'
          },
          'body': {
            's4': 's4'
          },
          'cookies': {
            'user': 'user_id'
          }
        }
      }],
      'after': [{
        'handleresponseplugin': {
          'ssss': 'sssss'
        }
      }]
    },
    'delete /login': {
      'pre': ['validatorplugin', 'mergeplugin'],
      'after': []
    },
    'put /login': {
      'pre': ['validatorplugin', 'mergeplugin'],
      'after': []
    }
  },
  default_handle_seq: {
    'pre': [{
      'changeplugin': {}
    }, {
      'mergeplugin': { }
    }],
    'after': [{
      'handleresponseplugin': { }
    }]
  },
  redirect: {
    '/login[?]{0,1}\S*': 'http://localhost:8998'
  },
  default_redirect_path: 'http://localhost:8998'
};