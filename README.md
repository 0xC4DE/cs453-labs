# CS 453/553 Labs

This repository contains examples and lab exercises for CS 453/553 Client-Server Programming.

It has my (Joshua Cantrell's) implementations of the labs as I work through the class.

## Repository Structure

    cs453-labs/
    ├── docs/
    ├── examples/
    ├── labs/        # Contains my implementations of each lab
    └── scripts/

## Running a Lab implmenetation

Each example has its own folder and README.

For example:

    cd labs/01-tcp-echo
    npm install
    npm run server

Then open a second terminal:

    cd labs/01-tcp-echo
    npm run client

## Run All Tests

From the repository root:

    ./scripts/test-all.sh

This runs tests for examples and labs that contain a `package.json`.

## Notes

Do not commit `node_modules/`.

Do commit `package.json` and `package-lock.json` for examples and labs so that dependencies are reproducible.
