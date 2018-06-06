import os, hashlib
from flask import session, render_template
import db

#encrypts passwords
def encrypt(password):
    return hashlib.sha224(password.encode('utf-8')).hexdigest()

#creates a new user
def new_user(username, password):
    return db.adduser(username, encrypt(password))

#print "new user: ", new_user('Bob', 'pass')

def update_pass(username, password):
    return db.change_password(username, encrypt(password))

#checks passworddev
def verify(username, password):
    return encrypt(password) == db.get_password(username)

#print "verify: ", verify('Bob', 'pass')

#checks username
def user_exists(username):
    return db.get_password(username) is not None

#print "user exists: ", user_exists('Bob')

#checks to see if logged in
def logged_in():
    return 'username' in session

#creates a new session if username and password match
def login(username, password):
    if(verify(username,password)):
        session['username'] = username
        return True
    else:
        return False

#removes login cookie
def logout():
    if logged_in():
        session.pop('username')

def in_session(function):
	"""
	decorator
	
	if user is logged in, return <function>.
	else, return render_template('index.html')
	"""
	def wrapper():
		if(logged_in()):
			return function()
		else:
			return render_template('index.html')
	wrapper.func_name = function.func_name
	return wrapper
