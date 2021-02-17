#!/usr/bin/env sh

if [[ ! -z "$DATABASE_URL" ]]; then
  cp ${PWD}/.env.example ${PWD}.env
else
  echo 'DATABASE_URL was properly set'
fi
