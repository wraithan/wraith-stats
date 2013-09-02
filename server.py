#!/usr/bin/env python
import logging

from flask import Flask


app = Flask(__name__)
app.debug = True


@app.before_first_request
def setup_logging():
    app.logger.addHandler(logging.StreamHandler())
    app.logger.setLevel(logging.INFO)


@app.route('/')
def index():
    with open('templates/index.html') as f:
        return f.read()


if __name__ == '__main__':
    app.run(port=1789)
