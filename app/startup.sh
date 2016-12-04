#!/bin/sh

# @Author: Philipp Fauser (philipp@attic-studio.net)
# @Date:   2016-06-14 14:28:52
# @Last Modified by:   Philipp
# @Last Modified time: 2016-12-03 14:06:43

# set env variables
export MONGO_URL='mongodb://admin:hacks@ds119768.mlab.com:19768/mobilityhacks'
# export MAIL_URL=''

# set settings.json for startup
#meteor run android-device --port 3000 --settings settings.json
meteor run --port 3000 --settings settings.json
