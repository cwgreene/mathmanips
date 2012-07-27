#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import json

from google.appengine.api import users
from google.appengine.ext import ndb
from google.appengine.ext.webapp import template

import logging


class UserStats(ndb.Model):
    user_email = ndb.StringProperty()
    user_visits = ndb.IntegerProperty()

class MainHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            self.response.out.write('Hello %s!! <a href="%s">Sign out</a>' 
                                    % (user.nickname(), users.create_logout_url("/")))
        else:
            self.response.out.write('<a href="%s">Please Sign in</a>' %
                                     users.create_login_url("/"))
 
class AdminHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            self.response.write(template.render(
                "admin/admin.html",
                {
                    "user" : user,
                    "logout" : users.create_logout_url("/")
                }
                ))
        else:
            self.response.out.write('<a href="%s">Please Sign in</a>' %
                                     users.create_login_url("/admin"))

    def post(self):
        story = self.request.get('story')
        fractions = self.request.get('fractions').split(",")
        sequence_id = int(self.request.get('sequence_id'))
        results = ndb.gql("select * from Problem where sequence_id = %s" % sequence_id)
        results = [result for results in results]
        if results == []:
            problem = Problem(sequence_id=sequence_id, fractions=fractions, story=story)
        else:
            problem = [result for result in results][0]
            problem.story = story
            problem.fractions = fractions
        problem.put()
        
              
class TestJsonHandler(webapp2.RequestHandler):
    def get(self):
        self.response.out.write('{"a":"chicken"}');

class Problem(ndb.Model):
    """Problems consist of:
        sequence_id : reference to holding sequence, at the moment, one per user
        fractions : list of strings corresponding to fractionts
        story : story descriptor for problem"""
    sequence_id = ndb.IntegerProperty()
    fractions = ndb.StringProperty(repeated=True)
    story = ndb.TextProperty()

class ProblemsHandler(webapp2.RequestHandler):
    def problem(self, id, fractions, story):
        return {'id':id,
                'fractions' : fractions,
                'story' : story}
    def problems(self):
        gql_problems = ndb.gql("select * from Problem");
        return {"problems":
                    [self.problem(p.sequence_id, p.fractions, p.story) for p in gql_problems]}
    def get(self):
        encoder = json.JSONEncoder()
        self.response.out.write(encoder.encode(self.problems()))
        logging.info("admin request:\n"+ str(self.request))
      

logging.getLogger().setLevel(logging.DEBUG)
app = webapp2.WSGIApplication([('/', MainHandler),
                               ('/admin', AdminHandler),
                               ('/test.json', TestJsonHandler),
                               ('/problems', ProblemsHandler)],
                              debug=True)
