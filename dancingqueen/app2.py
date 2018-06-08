from flask import Flask, url_for
from os import path

app = Flask(__name__)

DIR = path.dirname(__file__)


#console output will appear in /var/log/apache2/error.log

@app.route('/')
def root():
    return "deployment successful, but there is a db error"


if __name__ == '__main__':
    app.debug = False #DANGER DANGER! Set to FALSE before deployment!
    app.run()
