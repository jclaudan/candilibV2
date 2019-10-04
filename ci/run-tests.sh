#!/bin/bash
basename=$(basename $0)

# Set run test env
# use dedicated compose file for api in test mode
export DC_APP_API_BUILD_PROD='$(APP_API_PATH)/docker-compose.e2e.api.yml'
export DC_APP_API_RUN_PROD='$(APP_API_PATH)/docker-compose.e2e.api.yml'

ret=1
echo "# build all services (front_candidat,front_admin,api,db) in prod mode"
time make build-all NPM_AUDIT_DRY_RUN=false \
     DC_APP_API_RUN_PROD=$DC_APP_API_RUN_PROD \
     DC_APP_API_BUILD_PROD=$DC_APP_API_BUILD_PROD
ret=$?
if [ "$ret" -gt 0 ] ; then
  echo "$basename build-all ERROR"
  exit $ret
fi
docker images

# Set run test env
export FRONT_ADMIN_PORT=81
export DBDATA=../test-db
# Variables stack e2e
export PUBLIC_URL=http://candidat.candilib.local/candilib
export SMTP_SERVER=mailhog
export SMTP_PORT=1025
export CONTAINER_NAME_CANDIDAT=candidat.candilib.local
export CONTAINER_NAME_ADMIN=admin.candilib.local
export LC_ALL=fr_FR.UTF-8
# Variable api e2e
#export FAKETIME="${FAKETIME:-@2020-12-24 20:30:00}"
export FAKETIME="${FAKETIME:-}"

ret=1
echo "# run all separated services (front_candidat,front_admin,api,db) in prod mode"
time make up-all \
     DC_APP_API_RUN_PROD=$DC_APP_API_RUN_PROD \
     DC_APP_API_BUILD_PROD=$DC_APP_API_BUILD_PROD
ret=$?
if [ "$ret" -gt 0 ] ; then
  echo "$basename up-all ERROR"
  exit $ret
fi
docker ps

ret=1
echo "# test all services up&running"
time make test-all \
     DC_APP_API_RUN_PROD=$DC_APP_API_RUN_PROD \
     DC_APP_API_BUILD_PROD=$DC_APP_API_BUILD_PROD

ret=$?
if [ "$ret" -gt 0 ] ; then
  echo "$basename test-all ERROR"
  exit $ret
fi

# To disable tests, set DISABLE_E2E_TESTS to true
if [ -z "$DISABLE_E2E_TESTS" ] ; then
  ret=1
  echo "# init db for e2e tests"
  time make init-db-e2e
  ret=$?
  if [ "$ret" -gt 0 ] ; then
    echo "$basename init-db-e2e ERROR"
    exit $ret
  fi

  ret=1
  echo "# build e2e images"
  time make build-e2e

  ret=$?
  if [ "$ret" -gt 0 ] ; then
    echo "$basename build-e2e ERROR"
    exit $ret
  fi

  ret=1
  echo "# e2e tests"
  time make up-e2e

  ret=$?
  if [ "$ret" -gt 0 ] ; then
    echo "$basename up-e2e ERROR"
    exit $ret
  fi

  ret=1
  echo "# remove e2e container"
  time make down-e2e
  ret=$?
  if [ "$ret" -gt 0 ] ; then
    echo "$basename down-e2e ERROR"
    exit $ret
  fi
fi

ret=1
echo "# remove all services"
time make down-all \
     DC_APP_API_RUN_PROD=$DC_APP_API_RUN_PROD \
     DC_APP_API_BUILD_PROD=$DC_APP_API_BUILD_PROD

ret=$?
if [ "$ret" -gt 0 ] ; then
  echo "$basename down-all ERROR"
  exit $ret
fi

exit $ret
