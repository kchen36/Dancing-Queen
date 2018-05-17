from flask import session, render_template
from utils import db

def logged_in():
	"returns True if user is logged in, else false"
	pass

def login(username,password):
	"""
	if <username> and <password> are valid,
	creates a login session for user and returns True
	returns False otherwise
	"""
	pass

def logout():
	"""
	removes login session
	"""
	pass

def new_user(username,password):
	"""
	creates a new user account.
	with <username> and hashed <password>
	
	returns True if an account is made,
	False otherwise
	"""
	if not user_exists(username):
		db.adduser(username,password)
		return True
	else:
		return False
	

def user_exists(username):
	"""
	returns True if <username> is in the database
	false otherwise
	"""
	returns not db.getpass(username) == None

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

	return wrapper
